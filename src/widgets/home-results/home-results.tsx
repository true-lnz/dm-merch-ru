"use client";

import { RequestDialog } from "@/features/request-dialog";
import { observeElementResize } from "@/shared/lib/browser-compat";
import { cn } from "@/shared/lib/cn";
import { SliderControl } from "@/shared/ui/slider-control";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { PageSubheading } from "../../shared/ui/page-subheading";

type HomeResultSlide = {
  before: string;
  after: string;
  result: string;
  image: {
    src: string;
    alt: string;
  };
};

const RESULTS_TITLE = "Кейсы с результатом";
const RESULTS_DESCRIPTION = "Как мерч решает задачи бизнеса — на реальных проектах";

const RESULT_SLIDES = [
  {
    before:
      "Для ресторана «Магадан» нужно было полностью экипировать команду для уличного фестиваля. Важно было учесть разные погодные условия, чтобы сотрудники выглядели единообразно и чувствовали себя комфортно в жару, ветер и дождь.",
    after:
      "Подобрали и произвели комплект мерча под разные сценарии погоды: кепки и футболки — для жары, худи и дождевики — для прохладной и дождливой погоды. В итоге команда была полностью обеспечена одеждой под любые условия фестиваля.",
    result:
      "Команда «Магадана» выглядела собранно и узнаваемо на протяжении всего мероприятия, независимо от погоды. Мерч помог сохранить комфорт сотрудников, поддержать единый образ бренда и спокойно отработать фестиваль в любых условиях.",
    image: {
      src: "/home/results_1.png",
      alt: "Команда ресторана в фирменном мерче",
    },
  },
  {
    before:
      "Для компании Уфаойл нужно было подготовить 250 премиальных пледов для VIP-клиентов и партнёров. Важно было сделать авторский корпоративный подарок, который подчеркивает статус отношений и внимание к получателю.",
    after:
      "Разработали авторскую сувенирную продукцию: премиальные брендированные пледы в подарочной упаковке. Подобрали материалы, продумали дизайн и создали решение, которое выглядит как полноценный представительский подарок.",
    result:
      "250 пледов для Уфаойл стали частью имиджевой коммуникации с партнёрами. Подарок подчеркнул уровень компании, показал уважение к получателю и усилил ценность деловых отношений.",
    image: {
      src: "/home/results_2.png",
      alt: "Подарочный набор с пледом",
    },
  },
] satisfies HomeResultSlide[];

type ResultSection = {
  title: string;
  text: string;
};

function getSlideSections(slide: HomeResultSlide): ResultSection[] {
  return [
    { title: "Было", text: slide.before },
    { title: "Стало", text: slide.after },
    { title: "Результат", text: slide.result },
  ];
}

function ResultSectionCard({ section, className }: { section: ResultSection; className?: string }) {
  return (
    <article className={cn("flex min-h-0 flex-col", className)}>
      <h3 className="font-heading text-3xl leading-none uppercase text-[var(--heading)] md:text-4xl">{section.title}</h3>
      <p className="mt-3 text-sm leading-[1.35] tracking-[-0.03em] text-[var(--text-muted)] md:text-base">{section.text}</p>
    </article>
  );
}

function ResultSections({ slide }: { slide: HomeResultSlide }) {
  const sections = getSlideSections(slide);
  const primarySections = sections.slice(0, 2);
  const resultSection = sections[2];

  return (
    <div className="grid grid-cols-1 gap-y-6 xl:gap-y-7">
      <div className="grid grid-cols-1 gap-y-6 xl:grid-cols-2 xl:gap-x-[18px] xl:gap-y-7">
        {primarySections.map((section) => (
          <ResultSectionCard key={section.title} section={section} />
        ))}
      </div>

      {resultSection ? (
        <div className="grid grid-cols-1">
          <ResultSectionCard section={resultSection} />
        </div>
      ) : null}
    </div>
  );
}

type ResultActionsProps = {
  onPrevClick: () => void;
  onNextClick: () => void;
  dialogContext: string;
};

function ResultActions({ onPrevClick, onNextClick, dialogContext }: ResultActionsProps) {
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
          className="order-2 inline-flex h-[54px] w-full items-center justify-center rounded-[12px] bg-[var(--accent)] px-6 text-lg font-medium tracking-[-0.04em] text-white transition hover:bg-[var(--accent-hover)] md:h-[47px] xl:order-1 xl:w-[239px]"
        >
          Оставить заявку
        </button>
      </RequestDialog>
    </div>
  );
}

type ResultSlideLayoutProps = {
  slide: HomeResultSlide;
  activeIndex: number;
  onPrevClick: () => void;
  onNextClick: () => void;
};

function ResultSlideLayout({ slide, activeIndex, onPrevClick, onNextClick }: ResultSlideLayoutProps) {
  return (
    <div
      className={cn(
        "grid gap-6",
        "xl:grid-cols-12 xl:gap-[27px]",
        "xl:[grid-template-areas:'header_header_header_header_header_header_media_media_media_media_media_media''content_content_content_content_content_content_media_media_media_media_media_media''content_content_content_content_content_content_media_media_media_media_media_media''actions_actions_actions_actions_actions_actions_media_media_media_media_media_media']",
      )}
    >
      <div className="order-1 xl:order-none xl:col-span-6 xl:[grid-area:header]">
        <PageSubheading title={RESULTS_TITLE} description={RESULTS_DESCRIPTION} descriptionPlacement="bottom" />
      </div>

      <div className="order-2 xl:order-none xl:col-span-6 xl:[grid-area:media]">
        <div className="relative aspect-square overflow-hidden rounded-[18px] bg-white md:rounded-[22.5px] min-h xl:h-full xl:min-h-[550px] xl:aspect-auto">
          {RESULT_SLIDES.map((item, index) => (
            <div
              key={item.image.src}
              className={cn(
                "absolute inset-0 transition-opacity duration-500",
                index === activeIndex ? "opacity-100" : "pointer-events-none opacity-0",
              )}
            >
              <Image
                src={item.image.src}
                alt={item.image.alt}
                fill
                sizes="(max-width: 1279px) 100vw, 447px"
                className="object-cover object-top image-hover-scale"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="order-3 xl:order-none xl:col-span-6 xl:[grid-area:content]">
        <ResultSections slide={slide} />
      </div>

      <div className="order-4 xl:order-none xl:col-span-6 xl:[grid-area:actions] xl:self-end">
        <ResultActions onPrevClick={onPrevClick} onNextClick={onNextClick} dialogContext={slide.image.alt} />
      </div>
    </div>
  );
}

export function HomeResults() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const measureRootRef = useRef<HTMLDivElement | null>(null);
  const activeSlide = RESULT_SLIDES[activeIndex];

  const showPreviousSlide = () => {
    setActiveIndex((currentIndex) => (currentIndex - 1 + RESULT_SLIDES.length) % RESULT_SLIDES.length);
  };

  const showNextSlide = () => {
    setActiveIndex((currentIndex) => (currentIndex + 1) % RESULT_SLIDES.length);
  };

  useEffect(() => {
    const element = contentRef.current;

    if (!element || typeof ResizeObserver === "undefined") {
      return;
    }

    const updateWidth = () => {
      setContentWidth(element.clientWidth);
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
    const measureRoot = measureRootRef.current;

    if (!measureRoot || contentWidth === 0) {
      return;
    }

    const measureHeights = () => {
      const measuredSlides = Array.from(measureRoot.querySelectorAll<HTMLElement>("[data-measure-slide='true']"));
      const nextHeight = measuredSlides.reduce((maxHeight, slideNode) => Math.max(maxHeight, slideNode.offsetHeight), 0);
      setContentHeight((currentHeight) => (currentHeight === nextHeight ? currentHeight : nextHeight));
    };

    const frameId = window.requestAnimationFrame(measureHeights);
    const cleanupResizeObserver = observeElementResize([measureRoot], measureHeights);

    return () => {
      window.cancelAnimationFrame(frameId);
      cleanupResizeObserver();
    };
  }, [activeIndex, contentWidth]);

  return (
    <section className="my-[35px] md:my-[45px]">
      <div className="mt-8 xl:mt-[27px]">
        <div ref={contentRef} style={contentHeight > 0 ? { height: `${contentHeight}px` } : undefined}>
          <ResultSlideLayout slide={activeSlide} activeIndex={activeIndex} onPrevClick={showPreviousSlide} onNextClick={showNextSlide} />
        </div>
      </div>

      <div
        ref={measureRootRef}
        className="pointer-events-none absolute -left-[9999px] top-0 invisible"
        aria-hidden="true"
        style={{ width: contentWidth || undefined }}
      >
        {RESULT_SLIDES.map((slide) => (
          <div key={`measure-${slide.image.src}`} data-measure-slide="true">
            <ResultSlideLayout slide={slide} activeIndex={activeIndex} onPrevClick={() => undefined} onNextClick={() => undefined} />
          </div>
        ))}
      </div>
    </section>
  );
}
