import { CatalogProductsPage } from "@/views/catalog-products";
import { getCatalogProductsLandingData } from "@/views/catalog-products/model/catalog-products-data";
import { getDocumentAdminPath } from "@/payload/preview";
import { getCatalogProductsPageDocument, getCatalogProductsPageMetadata } from "@/shared/lib/payload/catalog-products-page";
import { isDraftModeEnabled } from "@/shared/lib/payload/page-docs";
import { AdminBar } from "@/shared/ui/admin-bar";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return getCatalogProductsPageMetadata();
}

export default async function Page() {
  const isDraft = await isDraftModeEnabled();
  const data = await getCatalogProductsLandingData();
  const page = await getCatalogProductsPageDocument();

  return (
    <>
      {isDraft && page ? (
        <AdminBar currentPath="/catalog-products" editHref={getDocumentAdminPath("catalog-products-page", page.id)} title="Каталог продукции: настройки" />
      ) : null}
      <CatalogProductsPage data={data} />
    </>
  );
}
