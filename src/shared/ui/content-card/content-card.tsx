import { cn } from "@/shared/lib/cn";
import { Button, buttonVariants } from "@/shared/ui/button";
import Image from "next/image";
import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";

type ContentCardImage = {
  url: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  className?: string;
};

export type ContentCardProps = {
  title: ReactNode;
  excerpt?: string | null;
  href?: string;
  hrefTarget?: "_self" | "_blank";
  hrefRel?: string;
  ctaLabel?: string;
  onCtaClick?: MouseEventHandler<HTMLButtonElement>;
  image: ContentCardImage;
  imageDisplayMode?: "3/2" | "1/1" | "auto";
};

export function ContentCard({
  title,
  excerpt,
  href,
  hrefTarget = "_self",
  hrefRel,
  ctaLabel = "Перейти",
  onCtaClick,
  image,
  imageDisplayMode = "3/2",
}: ContentCardProps) {
  const hasExcerpt = excerpt?.trim();
  const imageAspectClass = imageDisplayMode === "1/1" ? "aspect-square" : "aspect-[3/2]";

  function renderCta() {
    if (onCtaClick) {
      return (
        <Button type="button" variant="blue" onClick={onCtaClick} aria-label={ctaLabel}>
          {ctaLabel}
        </Button>
      );
    }

    if (!href) {
      return null;
    }

    return (
      <Link
        href={href}
        target={hrefTarget}
        rel={hrefTarget === "_blank" ? hrefRel ?? "noreferrer" : hrefRel}
        aria-label={`Открыть: ${title}`}
        className={buttonVariants({ variant: "blue" })}
      >
        {ctaLabel}
      </Link>
    );
  }

  if (imageDisplayMode === "auto") {
    return (
      <article className="flex h-full aspect-square flex-col overflow-hidden rounded-[20px] bg-[var(--card-bg)]">
        <div className="relative h-1/2 w-full overflow-hidden bg-[var(--surface)]">
          <Image
            src={image.url}
            alt={image.alt}
            fill
            sizes={image.sizes ?? "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"}
            className={cn("object-cover", image.className)}
          />
        </div>
        <div className="flex h-1/2 flex-col p-5 md:p-7">
          <div className="space-y-2">
            <h3 className="font-heading text-[42px] leading-[0.95] tracking-[0.01em] text-[var(--heading)]">
              {title}
            </h3>
            {hasExcerpt ? <p className="text-xs sm:text-sm md:text-base text-[var(--text-muted)]">{hasExcerpt}</p> : null}
          </div>
          <div className="mt-auto pt-4 md:pt-5 text-base md:text-lg">{renderCta()}</div>
        </div>
      </article>
    );
  }

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[20px] bg-[var(--card-bg)]">
      <div className={cn("relative w-full overflow-hidden bg-[var(--surface)]", imageAspectClass)}>
        <Image
          src={image.url}
          alt={image.alt}
          fill
          sizes={image.sizes ?? "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"}
          className={cn("object-cover", image.className)}
        />
      </div>
      <div className="space-y-2 p-5 md:p-7">
        <h3 className="font-heading text-[42px] leading-[0.95] tracking-[0.01em] text-[var(--heading)]">
          {title}
        </h3>
        {hasExcerpt ? <p className="text-sm text-[var(--text-muted)]">{hasExcerpt}</p> : null}
      </div>
      <div className="mt-auto p-4 pt-0 md:p-5 md:pt-0">{renderCta()}</div>
    </article>
  );
}
