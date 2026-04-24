import type { BlogArticleBudgetOptimizationSection } from "@/entities/blog-post";
import { PageSubheading } from "@/shared/ui/page-subheading";
import Image from "next/image";

type ArticleBudgetOptimizationSectionProps = {
  section: BlogArticleBudgetOptimizationSection;
};

export function ArticleBudgetOptimizationSection({ section }: ArticleBudgetOptimizationSectionProps) {
  return (
    <section aria-label={section.title}>
      <div className="grid gap-5 md:gap-6 xl:grid-cols-[minmax(0,1fr)_669px] xl:items-start xl:gap-[74px]">
        <div className="flex flex-col gap-8 md:gap-10 xl:pt-[6px]">
          <PageSubheading
            title={section.title}
            description={section.description}
            descriptionPlacement="bottom"
            titleClassName="max-w-[994px]"
            descriptionClassName="max-w-[996px] text-sm md:text-base xl:text-lg"
          />

          <div className="grid gap-[15px]">
            {section.items.map((item) => (
              <article key={item.number} className="rounded-[18px] bg-[var(--card-bg)] px-5 py-[22px] md:rounded-[20px] md:px-[30px] md:py-[26px]">
                <div className="flex items-start gap-4 md:gap-7">
                  <span className="font-heading shrink-0 text-3xl leading-none tracking-[0.01em] text-[var(--heading)] md:text-4xl">
                    {item.number}
                  </span>
                  <p className="pt-[2px] text-sm leading-[1.3] tracking-[-0.03em] text-[var(--text)] md:text-base">{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="relative aspect-[669/636] overflow-hidden rounded-[18px] bg-white md:rounded-[20px] xl:h-full xl:aspect-auto">
          <Image
            src={section.image.url}
            alt={section.image.alt}
            fill
            sizes="(max-width: 1279px) calc(100vw - 60px), 669px"
            className="object-cover object-top"
          />
        </div>
      </div>
    </section>
  );
}
