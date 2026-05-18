"use client";

import { RequestDialog } from "@/features/request-dialog";
import { cn } from "@/shared/lib/cn";
import type { HomeResultSlide, HomeResultsData } from "@/shared/lib/payload/home-page";
import { SliderControl } from "@/shared/ui/slider-control";
import Image from "next/image";
import { useState } from "react";
import { PageSubheading } from "../../shared/ui/page-subheading";

type ResultSectionCardProps = {
  title: string;
  text: string;
  className?: string;
};

function ResultSectionCard({ title, text, className }: ResultSectionCardProps) {
  return (
    <article className={cn("flex min-h-0 flex-col", className)}>
      <h3 className="font-heading text-3xl leading-none uppercase text-[var(--heading)] md:text-4xl">{title}</h3>
      <p className="mt-3 h-[6.75em] overflow-hidden text-sm leading-[1.35] tracking-[-0.03em] text-[var(--text-muted)] [display:-webkit-box] [-webkit-line-clamp:5] [-webkit-box-orient:vertical] md:h-auto md:overflow-visible md:[display:block] md:[-webkit-line-clamp:unset] md:[-webkit-box-orient:initial] md:text-base">
        {text}
      </p>
    </article>
  );
}

function ResultSections({ slide }: { slide: HomeResultSlide }) {
  return (
    <div className="grid grid-cols-1 gap-y-6 xl:gap-y-7">
      <div className="grid grid-cols-1 gap-y-6 xl:grid-cols-2 xl:gap-x-[18px] xl:gap-y-7">
        <ResultSectionCard title="Было" text={slide.before} />
        <ResultSectionCard title="Стало" text={slide.after} />
      </div>
      <ResultSectionCard title="Результат" text={slide.result} />
    </div>
  );
}

type ResultActionsProps = {
  onPrevClick: () => void;
  onNextClick: () => void;
  dialogContext: string;
  ctaLabel: string;
};

function ResultActions({ onPrevClick, onNextClick, dialogContext, ctaLabel }: ResultActionsProps) {
  return (
    <div className="mt-auto grid grid-cols-1 gap-6 pt-8 xl:grid-cols-[auto_auto] xl:items-end xl:justify-between xl:pt-10">
      <SliderControl
        className="order-1 mx-auto xl:order-2 xl:mx-0"
        onPrevClick={onPrevClick}
        onNextClick={onNextClick}
        prevAriaLabel="Предыдущий слайд"
        nextAriaLabel="Следующий слайд"
      />

      <RequestDialog source="home-results" context={dialogContext}>
        <button
          type="button"
          className="cursor-pointer order-2 inline-flex h-[54px] w-full items-center justify-center rounded-[12px] bg-[var(--accent)] px-6 text-lg font-medium tracking-[-0.04em] text-white transition hover:bg-[var(--accent-hover)] md:h-[47px] xl:order-1 xl:w-[239px]"
        >
          {ctaLabel}
        </button>
      </RequestDialog>
    </div>
  );
}

function ResultMedia({ activeIndex, slides }: { activeIndex: number; slides: HomeResultSlide[] }) {
  return (
    <div className="relative aspect-square min-h overflow-hidden rounded-[18px] bg-white sm:aspect-[16/9] md:rounded-[22.5px] xl:h-full xl:min-h-[550px] xl:aspect-square 2xl:aspect-auto">
      {slides.map((slide, index) => (
        <div
          key={slide.image.url}
          className={cn(
            "absolute inset-0 transition-opacity duration-500 bg-white",
            index === activeIndex ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          <Image
            src={slide.image.url}
            alt={slide.image.alt}
            fill
            sizes="60vw"
            className="image-hover-scale object-cover object-top sm:object-contain md:object-cover 3xl:object-contain"
          />
        </div>
      ))}
    </div>
  );
}

type ResultSlideLayoutProps = {
  slide: HomeResultSlide;
  activeIndex: number;
  onPrevClick: () => void;
  onNextClick: () => void;
  sectionTitle: string;
  sectionDescription: string;
  slides: HomeResultSlide[];
  ctaLabel: string;
};

function ResultSlideLayout({ slide, activeIndex, onPrevClick, onNextClick, sectionTitle, sectionDescription, slides, ctaLabel }: ResultSlideLayoutProps) {
  return (
    <div className={cn("grid gap-4", "xl:grid-cols-2 xl:gap-[27px]", "xl:[grid-template-areas:'header_media''content_media''actions_media']")}>
      <div className="order-1 xl:order-none xl:[grid-area:header]">
        <PageSubheading title={sectionTitle} description={sectionDescription} descriptionPlacement="bottom" />
      </div>

      <div className="order-2 xl:order-none xl:[grid-area:media]">
        <ResultMedia activeIndex={activeIndex} slides={slides} />
      </div>

      <div className="order-3 xl:order-none xl:[grid-area:content]">
        <ResultSections slide={slide} />
      </div>

      <div className="order-4 xl:order-none xl:self-end xl:[grid-area:actions]">
        <ResultActions onPrevClick={onPrevClick} onNextClick={onNextClick} dialogContext={slide.image.alt} ctaLabel={ctaLabel} />
      </div>
    </div>
  );
}

export function HomeResults({ data }: { data: HomeResultsData }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = data.slides[activeIndex];

  const showPreviousSlide = () => {
    setActiveIndex((currentIndex) => (currentIndex - 1 + data.slides.length) % data.slides.length);
  };

  const showNextSlide = () => {
    setActiveIndex((currentIndex) => (currentIndex + 1) % data.slides.length);
  };

  return (
    <section className="my-[35px] md:my-[45px]">
      <div>
        <ResultSlideLayout
          slide={activeSlide}
          activeIndex={activeIndex}
          onPrevClick={showPreviousSlide}
          onNextClick={showNextSlide}
          sectionTitle={data.title}
          sectionDescription={data.description}
          slides={data.slides}
          ctaLabel={data.ctaLabel}
        />
      </div>
    </section>
  );
}
