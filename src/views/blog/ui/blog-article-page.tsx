import type { BlogArticle, BlogArticleSection } from "@/entities/blog-post";
import { RequestCta } from "@/features/request-cta";
import { WidowFix } from "@/shared/ui/widow-fix";
import { ArticleHero } from "@/widgets/article-hero";
import { ArticleSummarySection } from "@/widgets/article-summary-section";
import type { PropsWithChildren } from "react";

type BlogArticlePageProps = PropsWithChildren<{
  article: BlogArticle;
}>;

function renderArticleSection(section: BlogArticleSection, index: number) {
  switch (section.type) {
    case "summary":
      return <ArticleSummarySection key={`${section.type}-${index}`} section={section} />;
  }
}

export function BlogArticlePage({
  article,
  children,
}: BlogArticlePageProps) {
  return (
    <>
      <WidowFix />
      <article>
        <ArticleHero article={article} />
        {article.sections.map(renderArticleSection)}
        {children}
      </article>
      <RequestCta />
    </>
  );
}
