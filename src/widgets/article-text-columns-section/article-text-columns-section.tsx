import type { BlogArticleTextColumnsSection } from "@/entities/blog-post";
import { PageSubheading } from "@/shared/ui/page-subheading";

type ArticleTextColumnsSectionProps = {
  section: BlogArticleTextColumnsSection;
};

export function ArticleTextColumnsSection({ section }: ArticleTextColumnsSectionProps) {
  return (
    <section aria-label={section.title ?? "Текстовый блок статьи"}>
      <div className="flex flex-col gap-4 xl:gap-5">
        {section.title ? <PageSubheading title={section.title} /> : null}
        <div className="grid gap-4 xl:grid-cols-2 xl:gap-5">
          {section.columns.map((column) => (
            <div key={column.title} className="flex flex-col gap-5 md:gap-6">
              {!section.hideColumnTitles ? (
                <h3 className="font-heading whitespace-pre-line text-2xl leading-[0.95] tracking-[0.015em] uppercase text-[var(--heading)] md:text-4xl xl:max-w-[70%]">
                  {column.title}
                </h3>
              ) : null}
              <div className="space-y-4 md:space-y-5">
                {column.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="text-sm leading-[1.35] tracking-[-0.03em] text-[var(--text)] md:text-base xl:text-lg">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
