import type { Metadata } from "next";
import { PartnerCatalogPage } from "@/views/partner-catalog";
import { getPartnerCatalogInitialData } from "@/views/partner-catalog/model/partner-catalog-data";
import {
  PARTNER_CATALOG_QUERY_CATEGORY_KEY,
  PARTNER_CATALOG_QUERY_SUBCATEGORY_KEY,
} from "@/views/partner-catalog/model/partner-catalog-query";

export const metadata: Metadata = {
  title: "Каталог продукции",
};

type PartnerCatalogPageSearchParams = Promise<{
  [PARTNER_CATALOG_QUERY_CATEGORY_KEY]?: string;
  [PARTNER_CATALOG_QUERY_SUBCATEGORY_KEY]?: string;
}>;

export default async function Page({ searchParams }: { searchParams: PartnerCatalogPageSearchParams }) {
  const resolvedSearchParams = await searchParams;

  return (
    <PartnerCatalogPage
      initialData={getPartnerCatalogInitialData(16, {
        category: resolvedSearchParams.category,
        subcategory: resolvedSearchParams.subcategory,
      })}
    />
  );
}
