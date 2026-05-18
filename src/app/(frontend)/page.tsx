import { HomePage } from "@/views/home";
import { getDocumentAdminPath } from "@/payload/preview";
import { getHomePageData } from "@/shared/lib/payload/home-page";
import { getManagedPageBySlug, isDraftModeEnabled } from "@/shared/lib/payload/page-docs";
import { getManagedPageMetadata } from "@/shared/lib/payload/page-seo";
import { AdminBar } from "@/shared/ui/admin-bar";

export async function generateMetadata() {
  return getManagedPageMetadata("home");
}

export default async function Page() {
  const isDraft = await isDraftModeEnabled();
  const page = await getManagedPageBySlug("home");
  const homePageData = await getHomePageData();

  return (
    <>
      {isDraft && page ? <AdminBar currentPath="/" editHref={getDocumentAdminPath("pages", page.id)} title={page.title} /> : null}
      <HomePage data={homePageData} />
    </>
  );
}
