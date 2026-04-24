import type { BlogArticle, BlogArticleSection } from "@/entities/blog-post";
import { RequestCta } from "@/features/request-cta";
import { WidowFix } from "@/shared/ui/widow-fix";
import { ArticleAccentMiniCardsSection } from "@/widgets/article-accent-mini-cards-section";
import { ArticleBudgetOptimizationSection } from "@/widgets/article-budget-optimization-section";
import { ArticleChecklistSection } from "@/widgets/article-checklist-section";
import { ArticleHero } from "@/widgets/article-hero";
import { ArticleMerchTypesSection } from "@/widgets/article-merch-types-section";
import { ArticleNumberedMiniCardsSection } from "@/widgets/article-numbered-mini-cards-section";
import { ArticleSummarySection } from "@/widgets/article-summary-section";
import { ArticleTaskGoalsSection } from "@/widgets/article-task-goals-section";
import { ArticleTextColumnsImageSection } from "@/widgets/article-text-columns-image-section";
import { ArticleTextImageSection } from "@/widgets/article-text-image-section";
import { ArticleTextMiniCardsSection } from "@/widgets/article-text-mini-cards-section";
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
    case "text-mini-cards":
      return <ArticleTextMiniCardsSection key={`${section.type}-${index}`} section={section} />;
    case "merch-types":
      return <ArticleMerchTypesSection key={`${section.type}-${index}`} section={section} />;
    case "checklist":
      return <ArticleChecklistSection key={`${section.type}-${index}`} section={section} />;
    case "task-goals":
      return <ArticleTaskGoalsSection key={`${section.type}-${index}`} section={section} />;
    case "text-columns-image":
      return <ArticleTextColumnsImageSection key={`${section.type}-${index}`} section={section} />;
    case "text-image":
      return <ArticleTextImageSection key={`${section.type}-${index}`} section={section} />;
    case "numbered-mini-cards":
      return <ArticleNumberedMiniCardsSection key={`${section.type}-${index}`} section={section} />;
    case "budget-optimization":
      return <ArticleBudgetOptimizationSection key={`${section.type}-${index}`} section={section} />;
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
