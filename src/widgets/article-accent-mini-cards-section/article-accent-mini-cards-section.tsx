import type { BlogArticleAccentMiniCardsSection } from "@/entities/blog-post";
import { PageSubheading } from "@/shared/ui/page-subheading";
import { ArticleMiniCard } from "@/widgets/article-mini-card";

type ArticleAccentMiniCardsSectionProps = {
  section: BlogArticleAccentMiniCardsSection;
};

export function ArticleAccentMiniCardsSection({ section }: ArticleAccentMiniCardsSectionProps) {
  return (
    <section aria-label={section.title}>
      <div className="relative overflow-hidden rounded-[18px] bg-[var(--accent)] p-[27px] md:rounded-[22.5px] md:p-[54px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[length:auto_100%] bg-[position:right_center] bg-no-repeat opacity-70"
          style={{ backgroundImage: `url('${section.backgroundAssetUrl ?? "/blog/img_conclusion_card_cover.svg"}')` }}
        />

        <div className="relative z-10 flex flex-col gap-8 md:gap-10">
          <PageSubheading title={section.title} titleClassName="max-w-[1298px] text-white xl:text-[4rem]" />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 xl:gap-5">
            {section.cards.map((card, index) => (
              <ArticleMiniCard
                key={`${card.title}-${index}`}
                title={card.title}
                text={card.text}
                className={index >= 3 ? "xl:col-span-1" : undefined}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
