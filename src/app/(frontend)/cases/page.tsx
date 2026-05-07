import { CasesPage } from "@/views/cases";
import { getCasesPageData } from "@/views/cases/model/get-cases-page-data";
import { getDocumentAdminPath } from "@/payload/preview";
import { getManagedPageBySlug, isDraftModeEnabled } from "@/shared/lib/payload/page-docs";
import { getManagedPageMetadata } from "@/shared/lib/payload/page-seo";
import { AdminBar } from "@/shared/ui/admin-bar";

export async function generateMetadata() {
  return getManagedPageMetadata("cases");
}

export default async function Page() {
  const isDraft = await isDraftModeEnabled();
  const data = await getCasesPageData();
  const page = await getManagedPageBySlug("cases");

  return (
    <>
      {isDraft && page ? <AdminBar currentPath="/cases" editHref={getDocumentAdminPath("pages", page.id)} title={page.title} /> : null}
      <CasesPage items={data.items} themes={data.themes} />
    </>
  );
}
