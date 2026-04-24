import type { BlogArticleTextSplitSection } from "@/entities/blog-post";
import { PageSubheading } from "@/shared/ui/page-subheading";

type ArticleTextSplitSectionProps = {
  section: BlogArticleTextSplitSection;
};

export function ArticleTextSplitSection({ section }: ArticleTextSplitSectionProps) {
  return (
    <section aria-label={section.title}>
      <div className="flex flex-col gap-8 md:gap-10 xl:gap-[54px]">
        <PageSubheading title={section.title} titleClassName="max-w-[1307px]" />

        <div className="grid gap-6 xl:grid-cols-2 xl:gap-[100px]">
          <div className="space-y-4 md:space-y-5">
            {section.leftParagraphs.map((paragraph) => (
              <p key={paragraph} className="text-sm leading-[1.35] tracking-[-0.03em] text-[var(--text)] md:text-base xl:text-lg">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="space-y-4 md:space-y-5">
            {section.rightParagraphs.map((paragraph) => (
              <p key={paragraph} className="text-sm leading-[1.35] tracking-[-0.03em] text-[var(--text)] md:text-base xl:text-lg">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
