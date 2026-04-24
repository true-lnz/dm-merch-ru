import type { BlogArticleProblemMiniCardsSection } from "@/entities/blog-post";
import { PageSubheading } from "@/shared/ui/page-subheading";
import { ArticleMiniCard } from "@/widgets/article-mini-card";

type ArticleProblemMiniCardsSectionProps = {
  section: BlogArticleProblemMiniCardsSection;
};

export function ArticleProblemMiniCardsSection({ section }: ArticleProblemMiniCardsSectionProps) {
  return (
    <section aria-label={section.title}>
      <div className="flex flex-col gap-8 md:gap-10 xl:gap-[60px]">
        <PageSubheading title={section.title} titleClassName="max-w-[1350px]" />

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
