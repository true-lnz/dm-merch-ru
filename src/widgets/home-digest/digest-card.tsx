"use client";

import { cn } from "@/shared/lib/cn";
import Image from "next/image";
import { DigestRequestDialog } from "./digest-request-dialog";
import { DIGEST_CTA_LABEL, type HomeDigestCard, type HomeDigestDefaultCard, type HomeDigestWildCard } from "./home-digest.data";

export type DigestCardLayout = "mobile" | "grid";

type DigestCardProps = {
  item: HomeDigestCard;
  layout: DigestCardLayout;
  isContentVisible?: boolean;
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
        "flex h-full flex-col overflow-hidden rounded-[20px] bg-[var(--card-bg)]",
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

      <div className="flex flex-1 flex-col px-5 pb-5 pt-[18px] md:px-[30px] md:pb-[30px] md:pt-[30px]">
        <div className={cn("flex-1", contentTransitionClass)}>
          <h3 className="font-heading text-3xl md:text-5xl leading-[0.94] tracking-[0.015em] text-[var(--heading)] uppercase">
            {item.title}
          </h3>
          <p className="mt-[10px] max-w-[19rem] text-sm md:text-base leading-[1.3] tracking-[-0.04em] text-[#404040] md:mt-3 md:max-w-[17.5rem]">
            {item.description}
          </p>
        </div>

        <div className="pt-[22px] md:pt-6">
          <DigestRequestDialog
            className="h-[48px] rounded-[8px] text-lg transition-colors duration-200 md:h-[47px]"
            label={DIGEST_CTA_LABEL}
            variant="accent"
          />
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
        "relative overflow-hidden rounded-[20px]",
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
            ? "flex flex-1 flex-col px-5 pb-5 pt-[18px]"
            : "flex flex-[0_0_calc(50%+15px)] flex-col px-7 pb-7 pt-8 md:px-10 md:pb-[30px] md:pt-[34px] xl:px-[40px] xl:pt-[50px]",
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
              "font-heading leading-[0.94] tracking-[0.015em] uppercase",
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
          <DigestRequestDialog
            className={cn(
              "rounded-[8px] text-[16px] transition-colors duration-200 h-[47px] w-full",
            )}
            label={DIGEST_CTA_LABEL}
            variant="light"
          />
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
