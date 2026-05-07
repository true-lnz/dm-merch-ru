import { CatalogProductsPage } from "@/views/catalog-products";
import { getCatalogProductsLandingData } from "@/views/catalog-products/model/catalog-products-data";
import { getDocumentAdminPath } from "@/payload/preview";
import { getManagedPageBySlug, isDraftModeEnabled } from "@/shared/lib/payload/page-docs";
import { getManagedPageMetadata } from "@/shared/lib/payload/page-seo";
import { AdminBar } from "@/shared/ui/admin-bar";

export async function generateMetadata() {
  return getManagedPageMetadata("catalog-products");
}

export default async function Page() {
  const isDraft = await isDraftModeEnabled();
  const data = await getCatalogProductsLandingData();
  const page = await getManagedPageBySlug("catalog-products");

  return (
    <>
      {isDraft && page ? (
        <AdminBar currentPath="/catalog-products" editHref={getDocumentAdminPath("pages", page.id)} title={page.title} />
      ) : null}
      <CatalogProductsPage data={data} />
    </>
  );
}
