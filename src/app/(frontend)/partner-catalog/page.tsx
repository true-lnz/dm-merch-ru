import type { Metadata } from "next";
import { PartnerCatalogPage } from "@/views/partner-catalog";
import {
  getPartnerCatalogInitialData,
  getPartnerCatalogProductDetailByVariantId,
  PARTNER_CATALOG_ALL_FILTER_ID,
} from "@/views/partner-catalog/model/partner-catalog-data";
import {
  PARTNER_CATALOG_QUERY_PRICE_FROM_KEY,
  PARTNER_CATALOG_QUERY_PRICE_TO_KEY,
  PARTNER_CATALOG_QUERY_CATEGORY_KEY,
  PARTNER_CATALOG_QUERY_PRODUCT_KEY,
  PARTNER_CATALOG_QUERY_STOCK_FROM_KEY,
  PARTNER_CATALOG_QUERY_SUBCATEGORY_KEY,
  getPartnerCatalogPathForFilter,
  resolvePartnerCatalogSelection,
} from "@/views/partner-catalog/model/partner-catalog-query";
import { PartnerCatalogProductPage } from "@/views/partner-catalog/ui/partner-catalog-product-page";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Каталог продукции",
};

type PartnerCatalogPageSearchParams = Promise<{
  [PARTNER_CATALOG_QUERY_CATEGORY_KEY]?: string;
  [PARTNER_CATALOG_QUERY_SUBCATEGORY_KEY]?: string;
  [PARTNER_CATALOG_QUERY_PRODUCT_KEY]?: string;
  [PARTNER_CATALOG_QUERY_PRICE_FROM_KEY]?: string;
  [PARTNER_CATALOG_QUERY_PRICE_TO_KEY]?: string;
  [PARTNER_CATALOG_QUERY_STOCK_FROM_KEY]?: string;
}>;

export default async function Page({ searchParams }: { searchParams: PartnerCatalogPageSearchParams }) {
  const resolvedSearchParams = await searchParams;
  const initialData = getPartnerCatalogInitialData(16, {
    category: resolvedSearchParams.category,
    subcategory: resolvedSearchParams.subcategory,
    priceFrom: resolvedSearchParams.priceFrom,
    priceTo: resolvedSearchParams.priceTo,
    stockFrom: resolvedSearchParams.stockFrom,
  });
  const productId = resolvedSearchParams.product?.trim();

  if (productId) {
    const detail = getPartnerCatalogProductDetailByVariantId(productId);

    if (!detail) {
      notFound();
    }

    const selection = resolvePartnerCatalogSelection(
      initialData.categories,
      {
        category: resolvedSearchParams.category,
        subcategory: resolvedSearchParams.subcategory,
      },
      PARTNER_CATALOG_ALL_FILTER_ID,
    );

    if (selection.filterId !== detail.sectionId) {
      notFound();
    }

    return (
      <PartnerCatalogProductPage
        key={detail.productId}
        detail={detail}
        listingHref={getPartnerCatalogPathForFilter(initialData.categories, detail.sectionId, PARTNER_CATALOG_ALL_FILTER_ID)}
      />
    );
  }

  return (
    <PartnerCatalogPage
      initialData={initialData}
    />
  );
}
