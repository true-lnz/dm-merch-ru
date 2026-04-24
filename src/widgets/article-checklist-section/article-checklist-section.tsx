import type { BlogArticleChecklistSection } from "@/entities/blog-post";
import { cn } from "@/shared/lib/cn";
import { PageSubheading } from "@/shared/ui/page-subheading";
import { ArticleMiniCard } from "@/widgets/article-mini-card";

type ArticleChecklistSectionProps = {
  section: BlogArticleChecklistSection;
};

export function ArticleChecklistSection({ section }: ArticleChecklistSectionProps) {
  const isLightCard = (index: number, columns: number) => {
    const row = Math.floor(index / columns);
    const col = index % columns;

    return (row + col) % 2 === 0;
  };

  return (
    <section aria-label={section.title}>
      <div className="relative overflow-hidden rounded-[18px] bg-[var(--accent)] p-[27px] md:rounded-[22.5px] md:p-[54px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[length:auto_100%] bg-[position:right_center] bg-no-repeat opacity-70"
          style={{ backgroundImage: `url('${section.backgroundAssetUrl ?? "/blog/img_conclusion_card_cover.svg"}')` }}
        />

        <div className="relative z-10 flex flex-col gap-8 md:gap-10">
          <PageSubheading title={section.title} titleClassName="text-white" />

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 xl:gap-5">
            {section.items.map((item, index) => {
              const isLightOnMobile = isLightCard(index, 1);
              const isLightOnTablet = isLightCard(index, 2);
              const isLightOnDesktop = isLightCard(index, 3);

              return (
                <ArticleMiniCard
                  key={item.number}
                  number={item.number}
                  text={item.text}
                  className={cn(
                    "min-h-[170px]",
                    isLightOnMobile ? "bg-[#F8F6F0] text-[var(--heading)]" : "bg-[rgba(248,246,240,0.2)] text-white",
                    isLightOnTablet ? "md:bg-[#F8F6F0] md:text-[var(--heading)]" : "md:bg-[rgba(248,246,240,0.2)] md:text-white",
                    isLightOnDesktop ? "xl:bg-[#F8F6F0] xl:text-[var(--heading)]" : "xl:bg-[rgba(248,246,240,0.2)] xl:text-white",
                  )}
                  numberClassName={cn(
                    isLightOnMobile ? "text-[var(--accent)]" : "text-white",
                    isLightOnTablet ? "md:text-[var(--accent)]" : "md:text-white",
                    isLightOnDesktop ? "xl:text-[var(--accent)]" : "xl:text-white",
                  )}
                  textClassName={cn(
                    isLightOnMobile ? "text-[var(--text-muted)]" : "text-white",
                    isLightOnTablet ? "md:text-[var(--text-muted)]" : "md:text-white",
                    isLightOnDesktop ? "xl:text-[var(--text-muted)]" : "xl:text-white",
                  )}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
