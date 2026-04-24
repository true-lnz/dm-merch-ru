import type { BlogArticleTaskGoalsSection } from "@/entities/blog-post";
import { PageSubheading } from "@/shared/ui/page-subheading";
import { ArticleMiniCard } from "@/widgets/article-mini-card";

type ArticleTaskGoalsSectionProps = {
  section: BlogArticleTaskGoalsSection;
};

export function ArticleTaskGoalsSection({ section }: ArticleTaskGoalsSectionProps) {
  return (
    <section aria-label={section.title}>
      <div className="relative overflow-hidden rounded-[18px] bg-[var(--accent)] p-[27px] md:rounded-[22.5px] md:p-[54px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[length:auto_100%] bg-[position:right_center] bg-no-repeat opacity-70"
          style={{ backgroundImage: `url('${section.backgroundAssetUrl ?? "/blog/img_conclusion_card_cover.svg"}')` }}
        />

        <div className="relative z-10 flex flex-col gap-8 md:gap-10">
          <div className="flex flex-col gap-4 md:gap-5">
            <PageSubheading title={section.title} titleClassName="max-w-[1298px] text-white xl:text-[4rem]" />
            <p className="max-w-[914px] text-sm leading-[1.35] tracking-[-0.03em] text-white md:text-base xl:text-lg">{section.description}</p>
          </div>

          <div className="flex flex-col gap-5 md:gap-6">
            <h3 className="font-heading whitespace-pre-line text-3xl leading-[0.95] tracking-[0.015em] uppercase text-white md:text-4xl xl:text-5xl">
              {section.label}
            </h3>
            <div className="grid gap-4 md:grid-cols-2 xl:max-w-[1024px]">
              {section.cards.map((card) => (
                <ArticleMiniCard key={card.title} title={card.title} text={card.text} />
              ))}
            </div>
          </div>

          <p className="max-w-[480px] text-sm leading-[1.35] tracking-[-0.03em] text-white md:text-base xl:text-lg">{section.note}</p>
        </div>
      </div>
    </section>
  );
}
