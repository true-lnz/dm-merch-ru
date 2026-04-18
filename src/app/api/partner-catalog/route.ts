import { NextResponse } from "next/server";
import { getPartnerCatalogProductsPage, PARTNER_CATALOG_ALL_FILTER_ID } from "@/views/partner-catalog/model/partner-catalog-data";

const DEFAULT_LIMIT = 16;
const MAX_LIMIT = 100;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filterId = searchParams.get("filterId") || PARTNER_CATALOG_ALL_FILTER_ID;
  const offset = Number.parseInt(searchParams.get("offset") ?? "0", 10);
  const limit = Number.parseInt(searchParams.get("limit") ?? String(DEFAULT_LIMIT), 10);

  const slice = getPartnerCatalogProductsPage(
    filterId,
    Number.isFinite(offset) ? offset : 0,
    Number.isFinite(limit) ? Math.min(Math.max(limit, 1), MAX_LIMIT) : DEFAULT_LIMIT,
  );

  return NextResponse.json(slice);
}
