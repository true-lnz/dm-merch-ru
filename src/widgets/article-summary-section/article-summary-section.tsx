import type { BlogArticleSummarySection } from "@/entities/blog-post";
import Image from "next/image";

type ArticleSummarySectionProps = {
  section: BlogArticleSummarySection;
};

function SummaryDecoration() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 960 540"
      className="pointer-events-none absolute -right-[118px] -top-[122px] h-[440px] w-[440px] text-[#4c86df] opacity-70 md:-right-[148px] md:-top-[152px] md:h-[560px] md:w-[560px] xl:-right-[238px] xl:-top-[208px] xl:h-[728px] xl:w-[728px]"
    >
      <circle
        cx="480"
        cy="270"
        r="188"
        fill="none"
        stroke="currentColor"
        strokeWidth="42"
      />
      <circle
        cx="480"
        cy="270"
        r="310"
        fill="none"
        stroke="currentColor"
        strokeWidth="42"
      />
      <circle
        cx="480"
        cy="270"
        r="432"
        fill="none"
        stroke="currentColor"
        strokeWidth="42"
      />
    </svg>
  );
}

export function ArticleSummarySection({ section }: ArticleSummarySectionProps) {
  return (
    <section className="mb-[63px] md:mb-[72px] xl:mb-[90px]" aria-label={section.title}>
      <div className="grid gap-5 md:gap-6 xl:grid-cols-[minmax(0,1114px)_minmax(0,586px)] xl:gap-10">
        <div className="relative order-2 overflow-hidden rounded-[20px] bg-[var(--accent)] px-5 py-5 text-white md:px-[30px] md:py-8 xl:order-1 xl:min-h-[418px] xl:rounded-[25px] xl:px-20 xl:py-[76px]">
          <SummaryDecoration />

          <div className="relative z-10 max-w-[962px]">
            <h2 className="m-0 font-heading text-[2.5rem] leading-none uppercase tracking-[0.01em] md:text-[4rem] xl:text-[6rem] xl:leading-[0.97]">
              {section.title}
            </h2>

            <div className="mt-5 space-y-4 md:mt-6 md:space-y-5 xl:mt-[30px] xl:space-y-[14px]">
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph}
                  className="m-0 max-w-[962px] text-xs leading-[1.3] tracking-[-0.04em] text-[#f5f4ef] md:text-base xl:text-[1.25rem]"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="relative order-1 aspect-[340/256] overflow-hidden rounded-[20px] bg-white md:aspect-[586/418] xl:order-2 xl:rounded-[25px]">
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
