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
  ctaNode?: ReactNode;
  onCtaClick?: MouseEventHandler<HTMLButtonElement>;
  image: ContentCardImage;
  imageContainerClassName?: string;
};

export function ContentCard({
  title,
  excerpt,
  href,
  hrefTarget = "_self",
  hrefRel,
  ctaLabel = "Перейти",
  ctaNode,
  onCtaClick,
  image,
  imageContainerClassName,
}: ContentCardProps) {
  const hasExcerpt = excerpt?.trim();
  const imageAspectClass = imageContainerClassName ?? "aspect-[3/2]";

  function renderCta() {
    if (ctaNode) {
      return ctaNode;
    }

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
        rel={hrefTarget === "_blank" ? (hrefRel ?? "noreferrer") : hrefRel}
        aria-label={`Открыть: ${title}`}
        className={buttonVariants({ variant: "blue" })}
      >
        {ctaLabel}
      </Link>
    );
  }

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[18px] md:rounded-[22.5px] bg-[var(--card-bg)]">
      <div className={cn("relative w-full overflow-hidden bg-[var(--surface)]", imageAspectClass)}>
        <Image
          src={image.url}
          alt={image.alt}
          fill
          quality={80}
          sizes={image.sizes ?? "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"}
          className={cn("object-cover object-top", image.className)}
        />
      </div>
      <div className="flex flex-1 flex-col p-[18px] md:p-[27px]">
        <div className="flex flex-1 flex-col justify-between gap-[9px] mb-[18px] md:mb-[18px]">
          <h3 className="xl:whitespace-pre-line font-heading text-3xl md:text-4xl leading-[0.95] tracking-[0.01em] text-[var(--heading)]">{title}</h3>
          {hasExcerpt ? <p className="text-sm md:text-base text-[var(--text-muted)] whitespace-pre-line">{excerpt}</p> : null}
        </div>
        <div className="mt-auto">{renderCta()}</div>
      </div>
    </article>
  );
}
