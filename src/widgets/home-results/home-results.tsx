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

function getSlideContentItems(slide: HomeResultSlide) {
  return [
    { title: "Было", text: slide.before },
    { title: "Стало", text: slide.after },
    { title: "Результат", text: slide.result },
  ];
}

type HomeResultsContentProps = {
  slide: HomeResultSlide;
  onPrevClick: () => void;
  onNextClick: () => void;
  showDialogButton?: boolean;
};

function HomeResultsContent({
  slide,
  onPrevClick,
  onNextClick,
  showDialogButton = true,
}: HomeResultsContentProps) {
  const contentItems = getSlideContentItems(slide);
  const actionButtonClassName =
    "cursor-pointer order-2 inline-flex h-[47px] items-center justify-center rounded-[9px] bg-[var(--accent)] px-6 text-lg font-medium tracking-[-0.04em] text-white transition hover:bg-[var(--accent-hover)] md:order-1 lg:w-[239px]";

  return (
    <div className="flex h-full flex-col">
      <div className="grid auto-rows-max grid-cols-1 gap-[18px] xl:mb-0 xl:flex-1 xl:grid-cols-2 xl:gap-x-[18px] xl:gap-y-[18px]">
        {contentItems.map((item, index) => (
          <article key={item.title} className={["flex h-full flex-col", index === contentItems.length - 1 ? "xl:col-span-2" : ""].join(" ")}>
            <h3 className="font-heading text-3xl leading-none uppercase text-[var(--heading)] md:text-4xl">{item.title}</h3>
            <p className="mt-[15px] text-sm leading-[1.35] tracking-[-0.03em] text-[var(--text-muted)] md:text-base">{item.text}</p>
          </article>
        ))}
      </div>

      <div className="mt-[36px] flex flex-col gap-4 md:flex-row md:items-center md:justify-between xl:mt-[40px]">
        <SliderControl
          className="order-1 mx-auto md:order-2 md:mx-0"
          onPrevClick={onPrevClick}
          onNextClick={onNextClick}
          prevAriaLabel="Предыдущий слайд"
          nextAriaLabel="Следующий слайд"
        />
        {showDialogButton ? (
          <RequestDialog source="home-results" context={slide.image.alt}>
            <button type="button" className={actionButtonClassName}>
              Оставить заявку
            </button>
          </RequestDialog>
        ) : (
          <button type="button" className={actionButtonClassName} tabIndex={-1}>
            Оставить заявку
          </button>
        )}
      </div>
    </div>
  );
}

export function HomeResults() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const measureContentRefs = useRef<Array<HTMLDivElement | null>>([]);
  const activeSlide = RESULT_SLIDES[activeIndex];

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const measureHeights = () => {
      const nextHeight = measureContentRefs.current.reduce((maxHeight, contentNode) => {
        if (!contentNode) {
          return maxHeight;
        }

        return Math.max(maxHeight, contentNode.getBoundingClientRect().height);
      }, 0);

      setContentHeight((currentHeight) => (currentHeight === nextHeight ? currentHeight : nextHeight));
    };

    const frameId = window.requestAnimationFrame(measureHeights);
    const cleanupResizeObserver = observeElementResize(measureContentRefs.current, measureHeights);

    return () => {
      window.cancelAnimationFrame(frameId);
      cleanupResizeObserver();
    };
  }, []);

  return (
    <section className="my-[35px] md:my-[45px]">
      <PageSubheading title={RESULTS_TITLE} description={RESULTS_DESCRIPTION} descriptionPlacement="bottom" />

      <div
        className={cn(
          "mt-[36px] grid gap-4 [grid-template-areas:'image''content']",
          "xl:mt-[27px] xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:items-stretch xl:gap-x-[27px] xl:[grid-template-areas:'content_image']",
        )}
      >
        <div className="relative [grid-area:content]">
          <div className="flex flex-col" style={contentHeight > 0 ? { minHeight: `${contentHeight}px` } : undefined}>
            <HomeResultsContent
              slide={activeSlide}
              onPrevClick={() => setActiveIndex((currentIndex) => (currentIndex - 1 + RESULT_SLIDES.length) % RESULT_SLIDES.length)}
              onNextClick={() => setActiveIndex((currentIndex) => (currentIndex + 1) % RESULT_SLIDES.length)}
            />
          </div>

          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 invisible">
            {RESULT_SLIDES.map((slide, index) => (
              <div
                key={slide.image.src}
                ref={(node) => {
                  measureContentRefs.current[index] = node;
                }}
              >
                <HomeResultsContent slide={slide} onPrevClick={() => undefined} onNextClick={() => undefined} showDialogButton={false} />
              </div>
            ))}
          </div>
        </div>

        <div className="relative aspect-square overflow-hidden rounded-[18px] bg-white [grid-area:image] md:rounded-[22.5px] xl:h-full xl:aspect-auto">
          {RESULT_SLIDES.map((slide, index) => (
            <div
              key={slide.image.src}
              className={cn(
                "absolute inset-0 transition-opacity duration-500",
                index === activeIndex ? "opacity-100" : "pointer-events-none opacity-0",
              )}
            >
              <Image
                src={slide.image.src}
                alt={slide.image.alt}
                fill
                sizes="(max-width: 1279px) 100vw, 48vw"
                className="object-cover image-hover-scale"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
