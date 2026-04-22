"use client";

import { observeElementResize } from "@/shared/lib/browser-compat";
import { EmblaOptionsType } from "embla-carousel";
import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";

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
  equalizeSlideHeight?: boolean;
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
  equalizeSlideHeight = false,
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
  const [carouselState, setCarouselState] = useState({
    selectedIndex: 0,
    canScrollPrev: false,
    canScrollNext: items.length > 1,
  });
  const [slideHeight, setSlideHeight] = useState(0);
  const measureSlideRefs = useRef<Array<HTMLDivElement | null>>([]);

  const renderedSlides = useMemo(
    () =>
      items.map((item, index) => ({
        key: getItemKey ? getItemKey(item, index) : index.toString(),
        content: renderItem(item, index),
      })),
    [getItemKey, items, renderItem],
  );

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    const syncState = () => {
      const nextState = {
        selectedIndex: emblaApi.selectedScrollSnap(),
        canScrollPrev: emblaApi.canScrollPrev(),
        canScrollNext: emblaApi.canScrollNext(),
      };

      setCarouselState((currentState) =>
        currentState.selectedIndex === nextState.selectedIndex &&
        currentState.canScrollPrev === nextState.canScrollPrev &&
        currentState.canScrollNext === nextState.canScrollNext
          ? currentState
          : nextState,
      );
    };

    syncState();
    emblaApi.on("select", syncState);
    emblaApi.on("reInit", syncState);

    return () => {
      emblaApi.off("select", syncState);
      emblaApi.off("reInit", syncState);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi || !equalizeSlideHeight) {
      return;
    }

    emblaApi.reInit();
  }, [emblaApi, equalizeSlideHeight, slideHeight]);

  useEffect(() => {
    if (!equalizeSlideHeight || typeof window === "undefined") {
      return;
    }

    const measureHeights = () => {
      const nextHeight = measureSlideRefs.current.reduce((maxHeight, slideNode) => {
        if (!slideNode) {
          return maxHeight;
        }

        return Math.max(maxHeight, slideNode.getBoundingClientRect().height);
      }, 0);

      setSlideHeight((currentHeight) => (currentHeight === nextHeight ? currentHeight : nextHeight));
    };

    const frameId = window.requestAnimationFrame(measureHeights);
    const cleanupResizeObserver = observeElementResize(measureSlideRefs.current, measureHeights);

    return () => {
      window.cancelAnimationFrame(frameId);
      cleanupResizeObserver();
    };
  }, [equalizeSlideHeight, renderedSlides]);

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
    ...(equalizeSlideHeight && slideHeight > 0 ? { height: `${slideHeight}px` } : {}),
  };

  return (
    <div className={cn("relative flex flex-col", className)}>
      <div
        ref={viewportRef}
        className={cn("-mx-[var(--layout-side-padding)] overflow-hidden touch-pan-y select-none", viewportClassName)}
        role="region"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
      >
        <div className={cn("flex items-stretch will-change-transform", trackClassName)} style={trackStyle}>
          {renderedSlides.map((slide, index) => (
            <div
              key={slide.key}
              className={cn("min-w-0", slideClassName)}
              style={slideStyle}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} из ${items.length}`}
            >
              <div style={slideInnerStyle}>
                <div className="h-full">{slide.content}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {equalizeSlideHeight ? (
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 invisible">
          {renderedSlides.map((slide, index) => (
            <div key={`measure-${slide.key}`} style={{ paddingInline: slideInset }}>
              <div
                ref={(node) => {
                  measureSlideRefs.current[index] = node;
                }}
              >
                {slide.content}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {showControls ? (
        <SliderControl
          className={cn("mt-5 self-center", controlsClassName)}
          onPrevClick={() => emblaApi?.scrollPrev()}
          onNextClick={() => emblaApi?.scrollNext()}
          prevDisabled={!carouselState.canScrollPrev}
          nextDisabled={!carouselState.canScrollNext}
          prevAriaLabel={`${prevAriaLabel} (${carouselState.selectedIndex + 1} из ${items.length})`}
          nextAriaLabel={`${nextAriaLabel} (${carouselState.selectedIndex + 1} из ${items.length})`}
        />
      ) : null}
    </div>
  );
}
