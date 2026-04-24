import type { BlogArticleTextImageSection } from "@/entities/blog-post";
import { cn } from "@/shared/lib/cn";
import { PageSubheading } from "@/shared/ui/page-subheading";
import Image from "next/image";

type ArticleTextImageSectionProps = {
  section: BlogArticleTextImageSection;
};

export function ArticleTextImageSection({ section }: ArticleTextImageSectionProps) {
  const isAccent = section.variant === "accent";

  return (
    <section aria-label={section.title}>
      <div
        className={cn(
          "grid gap-5 md:gap-6 xl:grid-cols-[1fr_669px] xl:items-start xl:gap-10",
          isAccent &&
            "relative left-1/2 w-screen -translate-x-1/2 rounded-none bg-[var(--accent)] px-[30px] py-[27px] md:left-auto md:w-auto md:translate-x-0 md:rounded-[22.5px] md:p-[54px] xl:grid-cols-[minmax(0,1fr)_542px] xl:gap-[60px]",
        )}
      >
        <div className={cn("order-1 flex flex-col gap-4 md:gap-5", !isAccent && "xl:pt-[13px]")}>
          <PageSubheading title={section.title} titleClassName={cn("max-w-[1057px]", isAccent && "text-white")} />
          <div className="flex flex-col gap-4 md:gap-5">
            {section.paragraphs.map((paragraph, index) => {
              const paragraphData = typeof paragraph === "string" ? { text: paragraph, variant: "default" as const } : paragraph;

              if (paragraphData.variant === "highlighted") {
                const highlightedParts = paragraphData.text.split("\n\n");

                return (
                  <div
                    key={`${paragraphData.text}-${index}`}
                    className="rounded-[18px] bg-[var(--card-bg)] px-5 py-[22px] md:rounded-[20px] md:px-[30px] md:py-[26px]"
                  >
                    <div className="flex flex-col gap-5">
                      {highlightedParts.map((part, highlightedIndex) => (
                        <div key={`${part}-${highlightedIndex}`}>
                          {highlightedIndex > 0 ? <div className="mb-5 h-px bg-[rgba(64,64,64,0.2)]" /> : null}
                          <p className="text-sm leading-[1.3] tracking-[-0.03em] text-[var(--text)] md:text-base">{part}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <p
                  key={`${paragraphData.text}-${index}`}
                  className={cn("text-sm leading-[1.35] tracking-[-0.03em] md:text-base xl:text-lg", isAccent ? "text-white" : "text-[var(--text)]")}
                >
                  {paragraphData.text}
                </p>
              );
            })}
          </div>
        </div>

        <div
          className={cn(
            "relative order-2 aspect-square overflow-hidden bg-white md:min-h-[320px] md:aspect-auto xl:h-full xl:min-h-0",
            isAccent ? "rounded-[18px] md:rounded-[22.5px]" : "rounded-[18px] md:rounded-[22.5px]",
          )}
        >
          <Image src={section.image.url} alt={section.image.alt} fill sizes="70vw" quality={95} className="object-cover object-top" />
        </div>
      </div>
    </section>
  );
}
