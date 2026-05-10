import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getBlogPostBySlug } from "@/entities/blog-post";
import { getDocumentAdminPath } from "@/payload/preview";
import { buildSEOMetadata } from "@/shared/lib/payload/seo-metadata";
import { isDraftModeEnabled } from "@/shared/lib/payload/page-docs";
import { AdminBar } from "@/shared/ui/admin-bar";
import { BlogArticlePage } from "@/views/blog";

export const dynamic = "force-dynamic";

type BlogArticleRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: BlogArticleRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getBlogPostBySlug(slug);

  if (!article) {
    return {
      title: "Статья не найдена",
    };
  }

  return {
    ...buildSEOMetadata({
      fallbackDescription: article.excerpt || undefined,
      fallbackImage: article.heroImage,
      fallbackTitle: article.seoTitle,
      meta: article.meta,
      pathname: `/blog/${article.slug}`,
      socialType: "article",
    }),
  };
}

export default async function Page({ params }: BlogArticleRouteProps) {
  const { slug } = await params;
  const article = await getBlogPostBySlug(slug);
  const isDraft = await isDraftModeEnabled();

  if (!article) {
    notFound();
  }

  return (
    <>
      {isDraft ? (
        <AdminBar currentPath={`/blog/${article.slug}`} editHref={getDocumentAdminPath("posts", article.id)} title={article.cardTitle} />
      ) : null}
      <BlogArticlePage article={article} />
    </>
  );
}
