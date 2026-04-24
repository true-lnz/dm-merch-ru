import type { BlogArticleTextColumnsImageSection } from "@/entities/blog-post";
import Image from "next/image";

type ArticleTextColumnsImageSectionProps = {
  section: BlogArticleTextColumnsImageSection;
};

export function ArticleTextColumnsImageSection({ section }: ArticleTextColumnsImageSectionProps) {
  return (
    <section>
      <div className="flex flex-col gap-8 md:gap-10 xl:gap-12">
        <div className="grid gap-8 xl:grid-cols-2 xl:gap-[100px]">
          {section.columns.map((column) => (
            <div key={column.title} className="flex flex-col gap-4 md:gap-5">
              <h2 className="font-heading whitespace-pre-line text-3xl uppercase leading-[0.95] tracking-[0.015em] text-[var(--heading)] md:text-4xl xl:text-5xl">
                {column.title}
              </h2>
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

        <div className="relative overflow-hidden rounded-[18px] bg-white md:rounded-[22.5px]" style={{ aspectRatio: section.imageAspectRatio ?? "1740 / 290" }}>
          <Image
            src={section.image.url}
            alt={section.image.alt}
            fill
            sizes="(max-width: 1279px) calc(100vw - 60px), 1740px"
            className="object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}
