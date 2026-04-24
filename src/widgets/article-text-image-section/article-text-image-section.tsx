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
          isAccent && "rounded-[18px] bg-[var(--accent)] p-[27px] md:rounded-[22.5px] md:p-[54px] xl:grid-cols-[minmax(0,1fr)_542px] xl:gap-[60px]",
        )}
      >
        <div className={cn("order-1 flex flex-col gap-4 md:gap-5", !isAccent && "xl:pt-[13px]")}>
          <PageSubheading title={section.title} titleClassName={cn("max-w-[1057px]", isAccent && "text-white")} />
          <div className="space-y-4 md:space-y-5">
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className={cn("text-sm leading-[1.35] tracking-[-0.03em] md:text-base xl:text-lg", isAccent ? "text-white" : "text-[var(--text)]")}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        <div
          className={cn(
            "relative overflow-hidden rounded-[18px] bg-white md:rounded-[22.5px]",
            isAccent ? "order-2 aspect-[542/357] xl:mt-[16px]" : "order-2 aspect-[669/361]",
          )}
        >
          <Image
            src={section.image.url}
            alt={section.image.alt}
            fill
            sizes={isAccent ? "(max-width: 1279px) calc(100vw - 114px), 542px" : "(max-width: 1279px) calc(100vw - 60px), 669px"}
            className="object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}
