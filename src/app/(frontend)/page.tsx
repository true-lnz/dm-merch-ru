import { HomePage } from "@/views/home";
import { getDocumentAdminPath } from "@/payload/preview";
import { getHomePageData, getHomePageDocument, getHomePageMetadata } from "@/shared/lib/payload/home-page";
import { isDraftModeEnabled } from "@/shared/lib/payload/page-docs";
import { AdminBar } from "@/shared/ui/admin-bar";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return getHomePageMetadata();
}

export default async function Page() {
  const isDraft = await isDraftModeEnabled();
  const page = await getHomePageDocument();
  const homePageData = await getHomePageData();

  return (
    <>
      {isDraft && page ? <AdminBar currentPath="/" editHref={getDocumentAdminPath("home-page", page.id)} title="Главная: настройки" /> : null}
      <HomePage data={homePageData} />
    </>
  );
}
