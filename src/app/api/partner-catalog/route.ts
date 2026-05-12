import { NextResponse } from "next/server";
import { getPartnerCatalogProductsPage, PARTNER_CATALOG_ALL_FILTER_ID } from "@/views/partner-catalog/model/partner-catalog-data";
import { normalizePartnerCatalogFilters, normalizePartnerCatalogSort } from "@/views/partner-catalog/model/partner-catalog-query";

export const dynamic = "force-dynamic";

const DEFAULT_LIMIT = 16;
const MAX_LIMIT = 80;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filterId = searchParams.get("filterId") || PARTNER_CATALOG_ALL_FILTER_ID;
  const offset = Number.parseInt(searchParams.get("offset") ?? "0", 10);
  const limit = Number.parseInt(searchParams.get("limit") ?? String(DEFAULT_LIMIT), 10);
  const filters = normalizePartnerCatalogFilters({
    priceFrom: searchParams.get("priceFrom") ?? undefined,
    priceTo: searchParams.get("priceTo") ?? undefined,
    stockFrom: searchParams.get("stockFrom") ?? undefined,
  });
  const sort = normalizePartnerCatalogSort(searchParams.get("sort") ?? undefined);

  const slice = await getPartnerCatalogProductsPage(
    filterId,
    Number.isFinite(offset) ? offset : 0,
    Number.isFinite(limit) ? Math.min(Math.max(limit, 1), MAX_LIMIT) : DEFAULT_LIMIT,
    filters,
    sort,
  );

  return NextResponse.json(slice);
}
