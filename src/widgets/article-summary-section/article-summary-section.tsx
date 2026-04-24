import type { BlogArticleSummarySection } from "@/entities/blog-post";
import { PageSubheading } from "@/shared/ui/page-subheading";
import Image from "next/image";

type ArticleSummarySectionProps = {
  section: BlogArticleSummarySection;
};

export function ArticleSummarySection({ section }: ArticleSummarySectionProps) {
  return (
    <section aria-label={section.title}>
      <div className="grid gap-5 md:gap-6 xl:grid-cols-[8fr_4fr] xl:gap-10">
        <div className="relative order-2 overflow-hidden rounded-[18px] md:rounded-[22.5px] bg-[var(--accent)] px-5 py-5 text-white md:px-[30px] md:py-8 xl:order-1 xl:p-[54px]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[url('/blog/articles/img_summary_card_cover.svg')] bg-[length:auto_100%] bg-[position:right_center] bg-no-repeat opacity-70"
          />

          <div className="relative z-10">
            <PageSubheading title={section.title} titleClassName="text-white" />

            <div className="mt-4 md:mt-5 flex flex-col gap-2 md:gap-2.5">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="m-0 text-sm leading-[1.3] tracking-[-0.04em] text-white md:text-base xl:text-lg">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="relative order-1 aspect-3/2 overflow-hidden rounded-[18px] md:rounded-[22.5px] bg-white xl:order-2">
          <Image
            src={section.image.url}
            alt={section.image.alt}
            fill
            sizes="(max-width: 767px) calc(100vw - 60px), (max-width: 1279px) calc(100vw - 60px), 586px"
            className="object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}
