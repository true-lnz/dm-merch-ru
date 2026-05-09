import { CasesPage } from "@/views/cases";
import { getCasesPageData } from "@/views/cases/model/get-cases-page-data";
import { getDocumentAdminPath } from "@/payload/preview";
import { getCasesPageDocument, getCasesPageMetadata } from "@/shared/lib/payload/cases-page";
import { isDraftModeEnabled } from "@/shared/lib/payload/page-docs";
import { AdminBar } from "@/shared/ui/admin-bar";
import { FaqSection } from "@/widgets/faq-section";

export async function generateMetadata() {
  return getCasesPageMetadata();
}

export default async function Page() {
  const isDraft = await isDraftModeEnabled();
  const data = await getCasesPageData();
  const page = await getCasesPageDocument();

  return (
    <>
      {isDraft && page ? (
        <AdminBar currentPath="/cases" editHref={getDocumentAdminPath("cases-page", page.id)} title="Кейсы: настройки" />
      ) : null}
      <CasesPage items={data.items} themes={data.themes} title={page?.heroTitle || "Кейсы"} />
      <FaqSection />
    </>
  );
}
