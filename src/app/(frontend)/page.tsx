import { HomePage } from "@/views/home";
import { getDocumentAdminPath } from "@/payload/preview";
import { getManagedPageBySlug, isDraftModeEnabled } from "@/shared/lib/payload/page-docs";
import { getManagedPageMetadata } from "@/shared/lib/payload/page-seo";
import { AdminBar } from "@/shared/ui/admin-bar";

export async function generateMetadata() {
  return getManagedPageMetadata("home");
}

export default async function Page() {
  const isDraft = await isDraftModeEnabled();
  const page = await getManagedPageBySlug("home");

  return (
    <>
      {isDraft && page ? <AdminBar currentPath="/" editHref={getDocumentAdminPath("pages", page.id)} title={page.title} /> : null}
      <HomePage />
    </>
  );
}
