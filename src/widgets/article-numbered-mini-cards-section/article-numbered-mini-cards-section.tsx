import type { BlogArticleNumberedMiniCardsSection } from "@/entities/blog-post";
import { cn } from "@/shared/lib/cn";
import { PageSubheading } from "@/shared/ui/page-subheading";
import { ArticleMiniCard } from "@/widgets/article-mini-card";

type ArticleNumberedMiniCardsSectionProps = {
  section: BlogArticleNumberedMiniCardsSection;
};

export function ArticleNumberedMiniCardsSection({ section }: ArticleNumberedMiniCardsSectionProps) {
  return (
    <section aria-label={section.title}>
      <div className="flex flex-col gap-8 md:gap-10">
        <PageSubheading title={section.title} titleClassName="max-w-[942px]" />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 xl:gap-5">
          {section.items.map((item) => (
            <ArticleMiniCard
              key={item.number}
              number={item.number}
              text={item.text}
              variant="accent"
              className="min-h-[170px]"
              textClassName="text-white"
            />
          ))}
        </div>

        <div className="border-t border-[rgba(64,64,64,0.2)] pt-10">
          {section.note ? (
            <div className="flex items-start gap-[15px]">
              <span className="mt-[7px] block size-[10px] rounded-full bg-[var(--accent)]" />
              <p className={cn("text-sm leading-[1.35] tracking-[-0.03em] text-[var(--text)] md:text-base xl:text-lg")}>{section.note}</p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
