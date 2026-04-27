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
  titleClassName?: string;
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
  titleClassName,
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
  const linkProps = href
    ? {
        href,
        target: hrefTarget,
        rel: hrefTarget === "_blank" ? (hrefRel ?? "noreferrer") : hrefRel,
      }
    : null;

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
        {...linkProps}
        aria-label={`Открыть: ${title}`}
        className={buttonVariants({ variant: "blue" })}
      >
        {ctaLabel}
      </Link>
    );
  }

  const cta = renderCta();

  return (
    <article className="flex h-full w-full flex-col overflow-hidden rounded-[18px] md:rounded-[22.5px] bg-[var(--card-bg)]">
      {linkProps ? (
        <Link {...linkProps} aria-label={`Открыть статью: ${title}`} className="block">
          <div className={cn("relative w-full overflow-hidden bg-[var(--surface)]", imageAspectClass)}>
            <Image
              src={image.url}
              alt={image.alt}
              fill
              quality={80}
              sizes={image.sizes ?? "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"}
              className={cn("object-cover object-top image-hover-scale", image.className)}
            />
          </div>
        </Link>
      ) : (
        <div className={cn("relative w-full overflow-hidden bg-[var(--surface)]", imageAspectClass)}>
          <Image
            src={image.url}
            alt={image.alt}
            fill
            quality={80}
            sizes={image.sizes ?? "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"}
            className={cn("object-cover object-top image-hover-scale", image.className)}
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-[18px] md:p-[27px]">
        <div className="flex flex-1 flex-col justify-between gap-[9px] mb-[18px] md:mb-[18px]">
          <h3
            className={cn(
              "xl:whitespace-pre-line font-heading text-3xl md:text-4xl leading-[0.95] tracking-[0.01em] text-[var(--heading)]",
              titleClassName,
            )}
          >
            {linkProps ? (
              <Link {...linkProps} aria-label={`Открыть статью: ${title}`} className="transition-opacity hover:opacity-80">
                {title}
              </Link>
            ) : (
              title
            )}
          </h3>
          {hasExcerpt ? (
            <p className="text-sm md:text-base text-[var(--text-muted)] tracking-[-0.03em] leading-[1.35] whitespace-pre-line">{excerpt}</p>
          ) : null}
        </div>
        {cta ? <div className="mt-auto">{cta}</div> : null}
      </div>
    </article>
  );
}
