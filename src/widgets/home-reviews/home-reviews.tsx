"use client";

import { cn } from "@/shared/lib/cn";
import type { HomeReviewsData } from "@/shared/lib/payload/home-page";
import { SliderControl } from "@/shared/ui/slider-control";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { PageSubheading } from "../../shared/ui/page-subheading";

export function HomeReviews({ data }: { data: HomeReviewsData }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isQuoteExpanded, setIsQuoteExpanded] = useState(false);
  const [mobileContentWidth, setMobileContentWidth] = useState(0);
  const [mobileContentHeights, setMobileContentHeights] = useState({ collapsed: 170, expanded: 310 });
  const mobileContentRef = useRef<HTMLDivElement | null>(null);
  const mobileMeasureRef = useRef<HTMLDivElement | null>(null);
  const activeItem = data.items[activeIndex];
  const isFirstSlide = activeIndex === 0;
  const isLastSlide = activeIndex === data.items.length - 1;
  const mobileQuoteText = activeItem.quote.join(" ");
  const toggleLabel = isQuoteExpanded ? "Скрыть" : "Раскрыть больше";

  const showPreviousReview = () => {
    setActiveIndex((currentIndex) => currentIndex - 1);
  };

  const showNextReview = () => {
    setActiveIndex((currentIndex) => currentIndex + 1);
  };

  useEffect(() => {
    const element = mobileContentRef.current;

    if (!element || typeof ResizeObserver === "undefined") {
      return;
    }

    const updateWidth = () => {
      setMobileContentWidth(element.clientWidth);
    };

    updateWidth();

    const observer = new ResizeObserver(() => {
      updateWidth();
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const measureRoot = mobileMeasureRef.current;

    if (!measureRoot || mobileContentWidth === 0) {
      return;
    }

    const collapsedHeights = Array.from(measureRoot.querySelectorAll<HTMLElement>("[data-measure-state='collapsed']"));
    const expandedHeights = Array.from(measureRoot.querySelectorAll<HTMLElement>("[data-measure-state='expanded']"));
    const nextCollapsedHeight = Math.max(170, ...collapsedHeights.map((element) => element.offsetHeight));
    const nextExpandedHeight = Math.max(nextCollapsedHeight, ...expandedHeights.map((element) => element.offsetHeight));

    setMobileContentHeights((currentValue) => {
      if (currentValue.collapsed === nextCollapsedHeight && currentValue.expanded === nextExpandedHeight) {
        return currentValue;
      }

      return {
        collapsed: nextCollapsedHeight,
        expanded: nextExpandedHeight,
      };
    });
  }, [mobileContentWidth]);

  return (
    <section className="my-[35px] md:my-[45px]">
      <PageSubheading title={data.title} />

      <div className="mt-8 grid lg:grid-cols-12">
        <div className="relative aspect-3/2 overflow-hidden rounded-[18px] bg-white md:aspect-auto md:min-h-[320px] md:rounded-[22.5px] lg:col-span-7 lg:min-h-[616px]">
          {data.items.map((item, index) => (
            <div
              key={item.company}
              className={cn(
                "absolute inset-0 transition-opacity duration-500",
                index === activeIndex ? "opacity-100" : "pointer-events-none opacity-0",
              )}
            >
              <Image src={item.image.url} alt={item.image.alt} fill sizes="70vw" className="object-cover object-top image-hover-scale" />
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 rounded-[18px] bg-[var(--accent)] p-[18px] text-white md:gap-5 md:rounded-[22.5px] md:bg-[url('/home/img_card_cover_home_reviews.svg')] md:bg-cover md:bg-center md:p-[27px] lg:col-span-5">
          <div className="flex gap-[18px] md:gap-[22.5px]">
            <div className="relative size-[63px] md:size-[125px] overflow-hidden rounded-[9px] bg-white">
              {data.items.map((item, index) => (
                <div
                  key={`${item.company}-avatar`}
                  className={cn(
                    "absolute inset-0 transition-opacity duration-300",
                    index === activeIndex ? "opacity-100" : "pointer-events-none opacity-0",
                  )}
                >
                  <Image src={item.avatar.url} alt={item.avatar.alt} fill sizes="20vw" className="object-cover" />
                </div>
              ))}
            </div>
            <div>
              <p className="font-heading text-3xl leading-none uppercase md:text-4xl xl:text-5xl overflow-hidden [display:-webkit-box] [-webkit-line-clamp:1] [-webkit-box-orient:vertical]">
                {activeItem.name}
              </p>
              <p className="mt-0 md:mt-2 leading-[1.35] tracking-[-0.03em] text-white/80 text-sm md:text-base">{activeItem.role}</p>
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-[9px]">
            <h3 className="hidden font-heading text-3xl leading-none uppercase md:block md:text-4xl">{activeItem.company}</h3>

            <div
              ref={mobileContentRef}
              className="md:hidden flex flex-col"
              style={{
                minHeight: isQuoteExpanded ? mobileContentHeights.expanded : mobileContentHeights.collapsed,
                maxHeight: isQuoteExpanded ? mobileContentHeights.expanded : mobileContentHeights.collapsed,
              }}
            >
              <h3
                className={cn(
                  "mb-2 font-heading text-3xl leading-none uppercase",
                  isQuoteExpanded ? "overflow-visible" : "overflow-hidden [display:-webkit-box] [-webkit-line-clamp:1] [-webkit-box-orient:vertical]",
                )}
              >
                {activeItem.company}
              </h3>

              {isQuoteExpanded ? (
                <div className="space-y-4 text-sm leading-[1.35] tracking-[-0.03em] text-white/80">
                  {activeItem.quote.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              ) : (
                <p className="overflow-hidden [display:-webkit-box] [-webkit-line-clamp:6] [-webkit-box-orient:vertical] text-sm leading-[1.35] tracking-[-0.03em] text-white/80">
                  {mobileQuoteText}
                </p>
              )}

              <button
                type="button"
                onClick={() => setIsQuoteExpanded((value) => !value)}
                className="pt-3 w-fit cursor-pointer border-b border-current pb-0.5 text-sm font-semibold leading-none text-white transition-colors hover:text-white/80"
              >
                {toggleLabel}
              </button>
            </div>

            <div className="hidden space-y-4 text-sm leading-[1.35] tracking-[-0.03em] text-white/80 md:block md:text-base">
              {activeItem.quote.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <SliderControl
            className="mt-auto justify-center md:justify-start"
            onPrevClick={showPreviousReview}
            onNextClick={showNextReview}
            prevDisabled={isFirstSlide}
            nextDisabled={isLastSlide}
            prevAriaLabel={`Предыдущий отзыв (${activeIndex + 1} из ${data.items.length})`}
            nextAriaLabel={`Следующий отзыв (${activeIndex + 1} из ${data.items.length})`}
          />
        </div>
      </div>

      <div
        ref={mobileMeasureRef}
        className="pointer-events-none absolute -left-[9999px] top-0 invisible md:hidden"
        aria-hidden="true"
        style={{ width: mobileContentWidth || undefined }}
      >
        {data.items.map((item) => (
          <div key={`${item.company}-collapsed`} data-measure-state="collapsed" className="flex flex-col">
            <h3 className="mb-2 overflow-hidden [display:-webkit-box] [-webkit-line-clamp:1] [-webkit-box-orient:vertical] font-heading text-3xl leading-none uppercase">
              {item.company}
            </h3>
            <p className="overflow-hidden [display:-webkit-box] [-webkit-line-clamp:6] [-webkit-box-orient:vertical] text-sm leading-[1.35] tracking-[-0.03em]">
              {item.quote.join(" ")}
            </p>
            <button type="button" className="mt-auto pt-3 w-fit border-b border-current pb-0.5 text-sm font-semibold leading-none">
              Раскрыть больше
            </button>
          </div>
        ))}

        {data.items.map((item) => (
          <div key={`${item.company}-expanded`} data-measure-state="expanded" className="flex flex-col">
            <h3 className="mb-2 font-heading text-3xl leading-none uppercase">{item.company}</h3>
            <div className="space-y-4 text-sm leading-[1.35] tracking-[-0.03em]">
              {item.quote.map((paragraph) => (
                <p key={`${item.company}-${paragraph}`}>{paragraph}</p>
              ))}
            </div>
            <button type="button" className="mt-auto pt-3 w-fit border-b border-current pb-0.5 text-sm font-semibold leading-none">
              Скрыть
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
