"use client";

import { RequestDialog } from "@/features/request-dialog";
import { cn } from "@/shared/lib/cn";
import { buttonVariants } from "@/shared/ui/button";
import { ContentCard } from "@/shared/ui/content-card";
import Image from "next/image";
import type { ComponentPropsWithoutRef } from "react";
import { forwardRef } from "react";
import { DIGEST_CTA_LABEL, type HomeDigestCard, type HomeDigestDefaultCard, type HomeDigestWildCard } from "./home-digest.data";

export type DigestCardLayout = "mobile" | "grid";

type DigestCardProps = {
  item: HomeDigestCard;
  layout: DigestCardLayout;
  isContentVisible?: boolean;
};

type DigestRequestButtonProps = Omit<ComponentPropsWithoutRef<"button">, "children"> & {
  label: string;
  variant?: "accent" | "light";
};

function getContentTransitionClass(layout: DigestCardLayout, isContentVisible: boolean) {
  if (layout !== "mobile") {
    return "";
  }

  return cn("transition-opacity duration-200 ease-out", isContentVisible ? "opacity-100" : "opacity-0");
}

function DigestMobileCard({ item }: { item: HomeDigestCard }) {
  const excerpt = item.variant === "wild" ? item.mobileDescription : item.description;

  return (
    <ContentCard
      title={item.title}
      excerpt={excerpt}
      image={{
        url: item.image.src,
        alt: item.image.alt,
        width: 413,
        height: 291,
        sizes: item.image.sizes,
        className: item.image.imageClassName,
      }}
      imageContainerClassName="aspect-[413/291]"
      ctaNode={
        <RequestDialog source="home-digest-card" context={item.title}>
          <button type="button" className={buttonVariants()} aria-label={`Отправить заявку: ${item.title}`}>
            {DIGEST_CTA_LABEL}
          </button>
        </RequestDialog>
      }
    />
  );
}

const DigestRequestButton = forwardRef<HTMLButtonElement, DigestRequestButtonProps>(function DigestRequestButton(
  { className, label, variant = "accent", type, ...props },
  ref,
) {
  const isLight = variant === "light";

  return (
    <button
      ref={ref}
      type={type ?? "button"}
      className={cn(
        "group flex h-[52px] w-full cursor-pointer items-center justify-center rounded-[7px] px-6 text-center text-lg font-semibold tracking-[-0.02em] transition-colors duration-200",
        isLight ? "bg-[#f5f4ef] text-[var(--accent)] hover:bg-white" : "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]",
        className,
      )}
      {...props}
    >
      <span>{label}</span>
    </button>
  );
});

function DigestDefaultCard({ item, layout, isContentVisible }: { item: HomeDigestDefaultCard; layout: DigestCardLayout; isContentVisible: boolean }) {
  if (layout === "mobile") {
    return <DigestMobileCard item={item} />;
  }

  const contentTransitionClass = getContentTransitionClass(layout, isContentVisible);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[18px] bg-[var(--card-bg)] md:rounded-[22.5px]">
      <div className={cn("relative aspect-3/2 overflow-hidden bg-white", contentTransitionClass)}>
        <Image
          src={item.image.src}
          alt={item.image.alt}
          fill
          sizes={item.image.sizes}
          className={cn("object-cover image-hover-scale", item.image.imageClassName)}
        />
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 p-[18px] md:p-[27px]">
        <div className={cn("flex-1", contentTransitionClass)}>
          <h3 className="font-heading text-3xl md:text-5xl leading-[0.94] tracking-[0.015em] text-[var(--heading)] uppercase">{item.title}</h3>
          <p className="mt-[10px] max-w-[19rem] text-sm md:text-base leading-[1.3] tracking-[-0.04em] text-[#404040] md:mt-3 md:max-w-[17.5rem]">
            {item.description}
          </p>
        </div>

        <div className="pt-[22px] md:pt-6">
          <RequestDialog source="home-digest-card" context={item.title}>
            <DigestRequestButton
              className="h-[48px] rounded-[7px] text-lg transition-colors duration-200 md:h-[47px]"
              label={DIGEST_CTA_LABEL}
              variant="accent"
            />
          </RequestDialog>
        </div>
      </div>
    </article>
  );
}

function DigestWildCard({ item, layout, isContentVisible }: { item: HomeDigestWildCard; layout: DigestCardLayout; isContentVisible: boolean }) {
  if (layout === "mobile") {
    return <DigestMobileCard item={item} />;
  }

  const contentTransitionClass = getContentTransitionClass(layout, isContentVisible);

  return (
    <article className="relative flex h-full overflow-hidden rounded-[18px] md:rounded-[22.5px]">
      <div className={cn("relative w-[calc(50%-15px)] shrink-0 overflow-hidden bg-white", contentTransitionClass)}>
        <Image
          src={item.image.src}
          alt={item.image.alt}
          fill
          sizes={item.image.sizes}
          className={cn("object-cover image-hover-scale", item.image.imageClassName)}
        />
      </div>

      <div
        className={cn(
          "min-w-0 overflow-hidden bg-[var(--accent)] text-white",
          "flex flex-[0_0_calc(50%+15px)] flex-col px-[36px] py-[27px] pt-[36px]",
        )}
        style={{
          backgroundImage: `url("${item.backgroundImageSrc}")`,
          backgroundPosition: "right bottom",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <div className="flex flex-1 flex-col">
          <h3 className="font-heading whitespace-pre-line text-4xl leading-[0.94] tracking-[0.015em] uppercase md:text-5xl">{item.title}</h3>
          <p className="mt-4 text-sm leading-[1.3] tracking-[-0.04em] text-white/80 md:text-base">{item.description}</p>
          <p className="mt-3 text-base leading-[1.3] tracking-[-0.04em] text-white/80">{item.details}</p>
        </div>

        <div className="mt-auto pt-6">
          <RequestDialog source="home-digest-card" context={item.title}>
            <DigestRequestButton
              className={cn("rounded-[7px] text-lg transition-colors duration-200 h-[47px] w-full")}
              label={DIGEST_CTA_LABEL}
              variant="light"
            />
          </RequestDialog>
        </div>
      </div>
    </article>
  );
}

export function DigestCard({ item, layout, isContentVisible = true }: DigestCardProps) {
  return item.variant === "wild" ? (
    <DigestWildCard item={item} layout={layout} isContentVisible={isContentVisible} />
  ) : (
    <DigestDefaultCard item={item} layout={layout} isContentVisible={isContentVisible} />
  );
}
