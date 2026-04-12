import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBlogPostBySlug, getBlogPostSlugs } from "@/entities/blog-post";
import { BlogArticlePage } from "@/views/blog";

type BlogArticleRouteProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return getBlogPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogArticleRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getBlogPostBySlug(slug);

  if (!article) {
    return {
      title: "Статья не найдена",
    };
  }

  return {
    title: article.seoTitle,
  };
}

export default async function Page({ params }: BlogArticleRouteProps) {
  const { slug } = await params;
  const article = getBlogPostBySlug(slug);

  if (!article) {
    notFound();
  }

  return <BlogArticlePage article={article} />;
}
