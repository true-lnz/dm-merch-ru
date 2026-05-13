import { CatalogPage } from "@/views/catalog";
import { getDocumentAdminPath } from "@/payload/preview";
import { getCatalogCategoryMetadata, getCatalogCategoryPageData, normalizeCatalogCategorySlug } from "@/shared/lib/payload/catalog-pages";
import { isDraftModeEnabled } from "@/shared/lib/payload/page-docs";
import { AdminBar } from "@/shared/ui/admin-bar";
import { notFound, permanentRedirect } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return getCatalogCategoryMetadata(slug);
}

export default async function CatalogCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const normalizedSlug = normalizeCatalogCategorySlug(slug);

  if (normalizedSlug && normalizedSlug !== slug) {
    permanentRedirect(`/catalog/${normalizedSlug}`);
  }

  const isDraft = await isDraftModeEnabled();
  const data = await getCatalogCategoryPageData(slug);

  if (!data) {
    notFound();
  }

  return (
    <>
      {isDraft ? (
        <AdminBar
          currentPath={`/catalog/${data.slug}`}
          editHref={getDocumentAdminPath("catalog-category-pages", data.id)}
          title={data.title}
        />
      ) : null}
      <CatalogPage data={data} category={data.slug} />
    </>
  );
}
