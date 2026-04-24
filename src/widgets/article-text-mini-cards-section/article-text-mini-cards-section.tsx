import type { BlogArticleTextMiniCardsSection } from "@/entities/blog-post";
import { PageSubheading } from "@/shared/ui/page-subheading";
import { ArticleMiniCard } from "@/widgets/article-mini-card";

type ArticleTextMiniCardsSectionProps = {
  section: BlogArticleTextMiniCardsSection;
};

export function ArticleTextMiniCardsSection({ section }: ArticleTextMiniCardsSectionProps) {
  return (
    <section aria-label={section.title}>
      <div className="flex flex-col gap-8 md:gap-10 xl:gap-[60px]">
        <PageSubheading
          title={section.title}
          description={section.description}
          descriptionPlacement={section.description ? "side" : "bottom"}
          titleClassName="max-w-[950px]"
          descriptionClassName="max-w-[553px] text-sm md:text-base xl:text-lg"
        />

        <div className="grid gap-5 xl:grid-cols-3">
          {section.cards.map((card) => (
            <ArticleMiniCard key={card.title} title={card.title} text={card.text} variant="accent" />
          ))}
        </div>

        {section.conclusion ? <p className="text-sm leading-[1.35] tracking-[-0.03em] text-[var(--text)] md:text-base xl:text-lg">{section.conclusion}</p> : null}
      </div>
    </section>
  );
}
