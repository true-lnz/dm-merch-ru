"use client";

import { RequestDialog } from "@/features/request-dialog";
import { cn } from "@/shared/lib/cn";
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

  return cn(
    "transition-opacity duration-200 ease-out",
    isContentVisible ? "opacity-100" : "opacity-0",
  );
}

const DigestRequestButton = forwardRef<HTMLButtonElement, DigestRequestButtonProps>(
  function DigestRequestButton(
    {
      className,
      label,
      variant = "accent",
      type,
      ...props
    },
    ref,
  ) {
    const isLight = variant === "light";

    return (
      <button
        ref={ref}
        type={type ?? "button"}
        className={cn(
          "group flex h-[52px] w-full cursor-pointer items-center justify-center rounded-[7px] px-6 text-center text-[16px] font-semibold tracking-[-0.02em] transition-colors duration-200",
          isLight
            ? "bg-[#f5f4ef] text-[var(--accent)] hover:bg-white"
            : "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]",
          className,
        )}
        {...props}
      >
        <span>{label}</span>
      </button>
    );
  },
);

function DigestDefaultCard({
  item,
  layout,
  isContentVisible,
}: {
  item: HomeDigestDefaultCard;
  layout: DigestCardLayout;
  isContentVisible: boolean;
}) {
  const contentTransitionClass = getContentTransitionClass(layout, isContentVisible);
  const isMobile = layout === "mobile";

  return (
    <article
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-[18px] md:rounded-[22.5px] bg-[var(--card-bg)]",
        isMobile ? "min-h-[420px]" : "",
      )}
    >
      <div className={cn("relative aspect-3/2 overflow-hidden bg-white", contentTransitionClass)}>
        <Image
          src={item.image.src}
          alt={item.image.alt}
          fill
          sizes={item.image.sizes}
          className={cn("object-cover", item.image.imageClassName)}
        />
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 p-[18px] md:p-[27px]">
        <div className={cn("flex-1", contentTransitionClass)}>
          <h3 className="font-heading text-3xl md:text-5xl leading-[0.94] tracking-[0.015em] text-[var(--heading)] uppercase">
            {item.title}
          </h3>
          <p className="mt-[10px] max-w-[19rem] text-sm md:text-base leading-[1.3] tracking-[-0.04em] text-[#404040] md:mt-3 md:max-w-[17.5rem]">
            {item.description}
          </p>
        </div>

        <div className="pt-[22px] md:pt-6">
          <RequestDialog>
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

function DigestWildCard({
  item,
  layout,
  isContentVisible,
}: {
  item: HomeDigestWildCard;
  layout: DigestCardLayout;
  isContentVisible: boolean;
}) {
  const isMobile = layout === "mobile";
  const contentTransitionClass = getContentTransitionClass(layout, isContentVisible);

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-[18px] md:rounded-[22.5px]",
        isMobile ? "flex h-full min-h-[420px] flex-col" : "flex h-full",
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden bg-white",
          isMobile ? "aspect-3/2" : "w-[calc(50%-15px)] shrink-0",
          contentTransitionClass,
        )}
      >
        <Image
          src={item.image.src}
          alt={item.image.alt}
          fill
          sizes={item.image.sizes}
          className={cn("object-cover", item.image.imageClassName)}
        />
      </div>

      <div
        className={cn(
          "min-w-0 overflow-hidden bg-[var(--accent)] text-white",
          isMobile
            ? "flex flex-1 flex-col p-[18px]"
            : "flex flex-[0_0_calc(50%+15px)] flex-col py-[27px] px-[36px] pt-[36px]",
        )}
        style={{
          backgroundImage: `url("${item.backgroundImageSrc}")`,
          backgroundPosition: "right bottom",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <div className={cn("flex flex-1 flex-col", isMobile ? contentTransitionClass : "")}>
          <h3
            className={cn(
              "font-heading whitespace-pre-line leading-[0.94] tracking-[0.015em] uppercase",
              isMobile ? "text-3xl" : "text-4xl md:text-5xl",
            )}
          >
            {item.title}
          </h3>
          <p
            className={cn(
              "leading-[1.3] tracking-[-0.04em] text-white/80",
              isMobile ? "mt-[10px] max-w-[19rem] text-[14px] text-white/82" : "mt-4 text-[15px] md:text-[16px]",
            )}
          >
            {isMobile ? item.mobileDescription : item.description}
          </p>
          {!isMobile ? (
            <p className="mt-3 text-base leading-[1.3] tracking-[-0.04em] text-white/80 md:text-lg">
              {item.details}
            </p>
          ) : null}
        </div>

        <div className={cn(isMobile ? "pt-[22px]" : "mt-auto pt-6")}>
          <RequestDialog>
            <DigestRequestButton
              className={cn(
                "rounded-[7px] text-[16px] transition-colors duration-200 h-[47px] w-full",
              )}
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
