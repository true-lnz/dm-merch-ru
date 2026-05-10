import type { Metadata } from "next";

import { getDocumentAdminPath } from "@/payload/preview";
import { getBlogPageDocument, getBlogPageMetadata } from "@/shared/lib/payload/blog-page";
import { isDraftModeEnabled } from "@/shared/lib/payload/page-docs";
import { AdminBar } from "@/shared/ui/admin-bar";
import { BlogPage } from "@/views/blog";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return getBlogPageMetadata();
}

export default async function Page() {
  const isDraft = await isDraftModeEnabled();
  const page = await getBlogPageDocument();

  return (
    <>
      {isDraft && page ? (
        <AdminBar currentPath="/blog" editHref={getDocumentAdminPath("blog-page", page.id)} title="Блог: настройки" />
      ) : null}
      <BlogPage title={page?.heroTitle || "Блог"} />
    </>
  );
}
