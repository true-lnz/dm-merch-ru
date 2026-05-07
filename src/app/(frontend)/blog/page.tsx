import type { Metadata } from "next";

import { getDocumentAdminPath } from "@/payload/preview";
import { getManagedPageBySlug, isDraftModeEnabled } from "@/shared/lib/payload/page-docs";
import { getManagedPageMetadata } from "@/shared/lib/payload/page-seo";
import { AdminBar } from "@/shared/ui/admin-bar";
import { BlogPage } from "@/views/blog";

export async function generateMetadata(): Promise<Metadata> {
  return getManagedPageMetadata("blog");
}

export default async function Page() {
  const isDraft = await isDraftModeEnabled();
  const page = await getManagedPageBySlug("blog");

  return (
    <>
      {isDraft && page ? <AdminBar currentPath="/blog" editHref={getDocumentAdminPath("pages", page.id)} title={page.title} /> : null}
      <BlogPage />
    </>
  );
}
