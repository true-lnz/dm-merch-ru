import { CatalogPage } from "@/views/catalog";
import { getCatalogRootMetadata, getCatalogRootPageData, normalizeCatalogCategorySlug } from "@/shared/lib/payload/catalog-pages";
import { getDocumentAdminPath } from "@/payload/preview";
import { isDraftModeEnabled } from "@/shared/lib/payload/page-docs";
import { AdminBar } from "@/shared/ui/admin-bar";
import { permanentRedirect } from "next/navigation";

type CatalogSearchParams = {
  category?: string;
};

export async function generateMetadata() {
  return getCatalogRootMetadata();
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<CatalogSearchParams>;
}) {
  const { category } = await searchParams;

  if (category) {
    const normalizedSlug = normalizeCatalogCategorySlug(category);

    permanentRedirect(`/catalog/${encodeURIComponent(normalizedSlug || category)}`);
  }

  const isDraft = await isDraftModeEnabled();
  const data = await getCatalogRootPageData();

  return (
    <>
      {isDraft ? (
        <AdminBar
          currentPath="/catalog"
          editHref={getDocumentAdminPath("catalog-category-pages", data.id)}
          title="Весь каталог"
        />
      ) : null}
      <CatalogPage data={data} />
    </>
  );
}
