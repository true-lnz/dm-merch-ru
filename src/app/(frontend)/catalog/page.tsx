import { CatalogPage } from "@/views/catalog";
import { getCatalogData } from "@/views/catalog/model/catalog-data";
import { getDocumentAdminPath } from "@/payload/preview";
import { getManagedPageBySlug, isDraftModeEnabled } from "@/shared/lib/payload/page-docs";
import { getManagedPageMetadata } from "@/shared/lib/payload/page-seo";
import { AdminBar } from "@/shared/ui/admin-bar";

type CatalogSearchParams = {
  category?: string;
};

export async function generateMetadata() {
  return getManagedPageMetadata("catalog");
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<CatalogSearchParams>;
}) {
  const { category } = await searchParams;
  const isDraft = await isDraftModeEnabled();
  const data = getCatalogData(category);
  const page = await getManagedPageBySlug("catalog");

  return (
    <>
      {isDraft && page ? (
        <AdminBar
          currentPath={category ? `/catalog?category=${encodeURIComponent(category)}` : "/catalog"}
          editHref={getDocumentAdminPath("pages", page.id)}
          title={page.title}
        />
      ) : null}
      <CatalogPage data={data} category={category} />
    </>
  );
}
