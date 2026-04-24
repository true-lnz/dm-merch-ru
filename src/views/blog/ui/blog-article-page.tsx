import type { BlogArticle, BlogArticleSection } from "@/entities/blog-post";
import { RequestCta } from "@/features/request-cta";
import { WidowFix } from "@/shared/ui/widow-fix";
import { ArticleAccentMiniCardsSection } from "@/widgets/article-accent-mini-cards-section";
import { ArticleChecklistSection } from "@/widgets/article-checklist-section";
import { ArticleHero } from "@/widgets/article-hero";
import { ArticleMerchTypesSection } from "@/widgets/article-merch-types-section";
import { ArticleProblemMiniCardsSection } from "@/widgets/article-problem-mini-cards-section";
import { ArticleSummarySection } from "@/widgets/article-summary-section";
import { ArticleTextColumnsSection } from "@/widgets/article-text-columns-section";
import { FaqSection } from "@/widgets/faq-section";
import type { PropsWithChildren } from "react";

type BlogArticlePageProps = PropsWithChildren<{
  article: BlogArticle;
}>;

function renderArticleSection(section: BlogArticleSection, index: number) {
  switch (section.type) {
    case "text-columns":
      return <ArticleTextColumnsSection key={`${section.type}-${index}`} section={section} />;
    case "accent-mini-cards":
      return <ArticleAccentMiniCardsSection key={`${section.type}-${index}`} section={section} />;
    case "problem-mini-cards":
      return <ArticleProblemMiniCardsSection key={`${section.type}-${index}`} section={section} />;
    case "merch-types":
      return <ArticleMerchTypesSection key={`${section.type}-${index}`} section={section} />;
    case "checklist":
      return <ArticleChecklistSection key={`${section.type}-${index}`} section={section} />;
    case "summary":
      return <ArticleSummarySection key={`${section.type}-${index}`} section={section} />;
  }
}

export function BlogArticlePage({ article, children }: BlogArticlePageProps) {
  return (
    <>
      <WidowFix />
      <article className="flex flex-col gap-[70px] md:gap-[90px] mb-[35px] md:mb-[45px]">
        <ArticleHero article={article} />
        {article.sections.map(renderArticleSection)}
        {children}
      </article>
      <FaqSection />
      <RequestCta />
    </>
  );
}
