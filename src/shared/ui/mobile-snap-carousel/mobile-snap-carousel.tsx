"use client";

import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";

import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";

import { cn } from "@/shared/lib/cn";
import { SliderControl } from "@/shared/ui/slider-control";

type MobileSnapCarouselProps<T> = {
  items: readonly T[];
  renderItem: (item: T, index: number) => ReactNode;
  getItemKey?: (item: T, index: number) => string;
  ariaLabel?: string;
  className?: string;
  viewportClassName?: string;
  trackClassName?: string;
  slideClassName?: string;
  controlsClassName?: string;
  showControls?: boolean;
  prevAriaLabel: string;
  nextAriaLabel: string;
  slideWidth?: string;
  slideInset?: string;
  gap?: string;
  opts?: EmblaOptionsType;
};

const DEFAULT_SLIDE_WIDTH = "100vw";
const DEFAULT_SLIDE_INSET = "var(--layout-side-padding)";
const DEFAULT_GAP = "0px";

export function MobileSnapCarousel<T>({
  items,
  renderItem,
  getItemKey,
  ariaLabel = "Карусель",
  className,
  viewportClassName,
  trackClassName,
  slideClassName,
  controlsClassName,
  showControls = true,
  prevAriaLabel,
  nextAriaLabel,
  slideWidth = DEFAULT_SLIDE_WIDTH,
  slideInset = DEFAULT_SLIDE_INSET,
  gap = DEFAULT_GAP,
  opts,
}: MobileSnapCarouselProps<T>) {
  const emblaOptions = useMemo<EmblaOptionsType>(
    () => ({
      align: "center",
      loop: false,
      dragFree: false,
      skipSnaps: false,
      containScroll: false,
      slidesToScroll: 1,
      ...opts,
    }),
    [opts],
  );

  const [viewportRef, emblaApi] = useEmblaCarousel(emblaOptions);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(items.length > 1);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    const syncState = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    syncState();
    emblaApi.on("select", syncState);
    emblaApi.on("reInit", syncState);

    return () => {
      emblaApi.off("select", syncState);
      emblaApi.off("reInit", syncState);
    };
  }, [emblaApi]);

  if (items.length === 0) {
    return null;
  }

  const slideStyle: CSSProperties = {
    flex: `0 0 ${slideWidth}`,
  };

  const trackStyle: CSSProperties = {
    gap,
  };

  const slideInnerStyle: CSSProperties = {
    paddingInline: slideInset,
  };

  return (
    <div className={cn("flex flex-col", className)}>
      <div
        ref={viewportRef}
        className={cn("-mx-[var(--layout-side-padding)] overflow-hidden touch-pan-y select-none", viewportClassName)}
        role="region"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
      >
        <div className={cn("flex items-stretch will-change-transform", trackClassName)} style={trackStyle}>
          {items.map((item, index) => (
            <div
              key={getItemKey ? getItemKey(item, index) : index.toString()}
              className={cn("min-w-0", slideClassName)}
              style={slideStyle}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} из ${items.length}`}
            >
              <div style={slideInnerStyle}>{renderItem(item, index)}</div>
            </div>
          ))}
        </div>
      </div>

      {showControls ? (
        <SliderControl
          className={cn("mt-5 self-center", controlsClassName)}
          onPrevClick={() => emblaApi?.scrollPrev()}
          onNextClick={() => emblaApi?.scrollNext()}
          prevDisabled={!canScrollPrev}
          nextDisabled={!canScrollNext}
          prevAriaLabel={`${prevAriaLabel} (${selectedIndex + 1} из ${items.length})`}
          nextAriaLabel={`${nextAriaLabel} (${selectedIndex + 1} из ${items.length})`}
        />
      ) : null}
    </div>
  );
}
