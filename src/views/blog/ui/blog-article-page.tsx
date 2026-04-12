import type { BlogArticle } from "@/entities/blog-post";
import { RequestCta } from "@/features/request-cta";
import { ArticleHero } from "@/widgets/article-hero";
import type { PropsWithChildren } from "react";

type BlogArticlePageProps = PropsWithChildren<{
  article: BlogArticle;
}>;

export function BlogArticlePage({
  article,
  children,
}: BlogArticlePageProps) {
  return (
    <>
      <article>
        <ArticleHero article={article} />
        {children}
      </article>
      <RequestCta />
    </>
  );
}
