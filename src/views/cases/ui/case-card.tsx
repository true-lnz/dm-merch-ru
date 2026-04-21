"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { cn } from "@/shared/lib/cn";
import type { CaseGalleryImage, CaseImageFit, CaseItem } from "../model/cases-data";

type CaseCardProps = {
  item: CaseItem;
};

const CASE_IMAGE_FIT_STYLES: Record<CaseImageFit, string> = {
  cover: "object-cover",
  contain: "object-contain",
};

function clampImagePosition(value: number | undefined) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 50;
  }

  return Math.min(100, Math.max(0, value));
}

function resolveCaseImagePosition(image: CaseGalleryImage) {
  return `${clampImagePosition(image.x)}% ${clampImagePosition(image.y)}%`;
}

function resolveCaseImageFit(fit?: CaseImageFit) {
  return fit ? CASE_IMAGE_FIT_STYLES[fit] : CASE_IMAGE_FIT_STYLES.cover;
}

export function CaseCard({ item }: CaseCardProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    loop: true,
  });

  const sections = useMemo(
    () => [
      { heading: "Задача", text: item.task },
      { heading: "Решение", text: item.solution },
      { heading: "Результат", text: item.result },
    ],
    [item.result, item.solution, item.task],
  );

  const desktopPreviewThumbs = item.gallery.length > 5 ? item.gallery.slice(0, 5) : item.gallery;
  const mobilePreviewThumbs = item.gallery.length > 4 ? item.gallery.slice(0, 4) : item.gallery;
  const toggleLabel = isExpanded ? "Скрыть" : "Читать больше";

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    const syncSelected = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    syncSelected();
    emblaApi.on("select", syncSelected);
    emblaApi.on("reInit", syncSelected);

    return () => {
      emblaApi.off("select", syncSelected);
      emblaApi.off("reInit", syncSelected);
    };
  }, [emblaApi]);

  const selectImage = (index: number) => {
    emblaApi?.scrollTo(index);
    setSelectedIndex(index);
  };

  return (
    <article className="rounded-[18px] md:rounded-[22.5px] lg:bg-[var(--card-bg)] lg:p-[30px]">
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(320px,50.7%)] lg:items-stretch lg:gap-[22.5px] 2xl:items-start">
        <CaseTextBlock
          item={item}
          sections={sections}
          isExpanded={isExpanded}
          toggleLabel={toggleLabel}
          onToggle={() => setIsExpanded((value) => !value)}
        />

        <div className="lg:flex h-full lg:flex-col">
          <div
            ref={emblaRef}
            className="mb-[14px] cursor-grab overflow-hidden rounded-[18px] bg-white active:cursor-grabbing lg:flex-1 lg:rounded-[9px]"
            style={{ aspectRatio: item.desktopImageAspect }}
          >
            <div className="flex h-full">
              {item.gallery.map((image) => (
                <div key={`${item.id}-${image.alt}`} className="min-w-0 shrink-0 grow-0 basis-full h-full">
                  <div className="relative h-full w-full overflow-hidden bg-white">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(max-width: 1023px) calc(100vw - var(--layout-side-padding) * 2), (max-width: 1440px) 42vw, 680px"
                      className={resolveCaseImageFit(image.fit)}
                      style={{ objectPosition: resolveCaseImagePosition(image) }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden gap-[9px] lg:grid lg:grid-cols-5">
            {desktopPreviewThumbs.map((image, index) => (
              <ThumbnailButton
                key={`${item.id}-thumb-${index}`}
                image={image}
                isActive={item.gallery.length > 5 && index === 4 ? selectedIndex >= index : selectedIndex === index}
                onClick={() => selectImage(index)}
                overlay={item.gallery.length > 5 && index === 4 ? `+${item.gallery.length - 4}` : null}
              />
            ))}
          </div>

          <div className="grid grid-cols-4 gap-[9px] lg:hidden">
            {mobilePreviewThumbs.map((image, index) => (
              <ThumbnailButton
                key={`${item.id}-mobile-thumb-${index}`}
                image={image}
                isActive={item.gallery.length > 4 && index === 3 ? selectedIndex >= index : selectedIndex === index}
                onClick={() => selectImage(index)}
                overlay={item.gallery.length > 4 && index === 3 ? `+${item.gallery.length - 3}` : null}
              />
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

function CaseTextBlock({
  item,
  sections,
  isExpanded,
  toggleLabel,
  onToggle,
}: {
  item: CaseItem;
  sections: Array<{ heading: string; text: string }>;
  isExpanded: boolean;
  toggleLabel: string;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-[18px] bg-[var(--card-bg)] px-5 pb-5 pt-5 lg:rounded-none lg:bg-transparent lg:px-0 lg:pb-0 lg:pt-0">
      <div className="space-y-3 lg:space-y-[9px]">
        <h2 className="font-heading whitespace-pre-line text-3xl md:text-5xl leading-[0.95] uppercase text-[var(--heading)]">{item.company}</h2>
        <p className="text-sm md:text-base leading-[1.3] text-[#404040]">{item.teaser}</p>
        <p className="text-sm md:text-base leading-[1.3] text-[#404040]">{item.intro}</p>
      </div>

      <div className="mt-4 lg:hidden">
        <button
          type="button"
          onClick={onToggle}
          className="text-sm md:text-base cursor-pointer border-b border-current pb-0.5 font-semibold leading-none text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]"
        >
          {toggleLabel}
        </button>
      </div>

      <div className="hidden lg:block">
        <div className="mt-[25px] h-px bg-[rgba(42,42,42,0.12)]" />
        <div className="space-y-[22px] pt-[24px]">
          {sections.map((section) => (
            <CaseSection key={section.heading} {...section} />
          ))}
        </div>
      </div>

      <div
        className={cn(
          "grid transition-[grid-template-rows,margin-top] duration-300 ease-out lg:hidden",
          isExpanded ? "mt-4 grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <div className="mb-4 h-px bg-[rgba(42,42,42,0.12)]" />
          <div className="space-y-5">
            {sections.map((section) => (
              <CaseSection key={section.heading} {...section} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CaseSection({ heading, text }: { heading: string; text: string }) {
  return (
    <section>
      <h3 className="font-heading text-2xl md:text-3xl leading-none uppercase text-[#404040]">{heading}</h3>
      <p className="mt-[6px] text-sm md:text-base leading-[1.35] text-[#404040]">{text}</p>
    </section>
  );
}

function ThumbnailButton({
  image,
  isActive,
  onClick,
  overlay,
}: {
  image: CaseGalleryImage;
  isActive: boolean;
  onClick: () => void;
  overlay?: string | null;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative w-full cursor-pointer overflow-hidden rounded-[7px] border-[3px] border-[var(--card-bg)] bg-white transition-[border-color,border-width]",
        isActive && "border-[3px] border-[var(--accent)]",
      )}
      aria-pressed={isActive}
    >
      <div className="relative w-full" style={{ aspectRatio: "4 / 3" }}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="90px"
          className={resolveCaseImageFit(image.fit)}
          style={{ objectPosition: resolveCaseImagePosition(image) }}
        />
      </div>
      {overlay ? (
        <span className="absolute inset-0 flex items-center justify-center bg-[rgba(42,42,42,0.68)] font-heading text-xl uppercase text-white">
          {overlay}
        </span>
      ) : null}
    </button>
  );
}
