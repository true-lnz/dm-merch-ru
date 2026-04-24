import type { BlogArticleNumberedMiniCardsSection } from "@/entities/blog-post";
import { cn } from "@/shared/lib/cn";
import { PageSubheading } from "@/shared/ui/page-subheading";
import { ArticleMiniCard } from "@/widgets/article-mini-card";

type ArticleNumberedMiniCardsSectionProps = {
  section: BlogArticleNumberedMiniCardsSection;
};

export function ArticleNumberedMiniCardsSection({ section }: ArticleNumberedMiniCardsSectionProps) {
  const isAccent = (section.variant ?? "accent") === "accent";
  const desktopColumnsClassName = section.items.length >= 4 ? "xl:grid-cols-4" : section.items.length === 3 ? "xl:grid-cols-3" : "xl:grid-cols-2";

  return (
    <section aria-label={section.title}>
      <div className="flex flex-col gap-8 md:gap-10">
        <PageSubheading
          title={section.title}
          description={section.description}
          descriptionPlacement={section.descriptionPlacement ?? "bottom"}
          sideDescriptionLayout={section.descriptionLayout ?? "two-columns"}
          titleClassName="max-w-[1143px]"
          descriptionClassName="max-w-[1143px] text-sm md:text-base xl:text-lg"
        />

        <div className={cn("grid gap-4 md:grid-cols-2 xl:gap-5", desktopColumnsClassName)}>
          {section.items.map((item) => (
            <ArticleMiniCard
              key={item.number}
              number={item.number}
              text={item.text}
              variant={isAccent ? "accent" : "light"}
              showAccentBackground={false}
              className="min-h-0 md:min-h-[150px]"
              textClassName={isAccent ? "text-white" : undefined}
            />
          ))}
        </div>

        {section.note ? (
          <div className="border-t border-[rgba(64,64,64,0.2)] pt-8">
            <div className="flex items-start gap-[15px]">
              <span className="mt-[7px] block size-[10px] shrink-0 rounded-full bg-[var(--accent)]" />
              <p className={cn("text-sm leading-[1.35] tracking-[-0.03em] text-[var(--text)] md:text-base xl:text-lg")}>{section.note}</p>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
