"use client";

import { RequestDialog } from "@/features/request-dialog";
import { cn } from "@/shared/lib/cn";
import { SliderControl } from "@/shared/ui/slider-control";
import Image from "next/image";
import { useState } from "react";
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
      src: "/home/results_1.webp",
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
      src: "/home/results5.webp",
      alt: "Подарочный набор с пледом",
    },
  },
] satisfies HomeResultSlide[];

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
          className="cursor-pointer order-2 inline-flex h-[54px] w-full items-center justify-center rounded-[12px] bg-[var(--accent)] px-6 text-lg font-medium tracking-[-0.04em] text-white transition hover:bg-[var(--accent-hover)] md:h-[47px] xl:order-1 xl:w-[239px]"
        >
          Оставить заявку
        </button>
      </RequestDialog>
    </div>
  );
}

function ResultMedia({ activeIndex }: { activeIndex: number }) {
  return (
    <div className="relative aspect-square min-h overflow-hidden rounded-[18px] bg-white sm:aspect-[16/9] md:rounded-[22.5px] xl:h-full xl:min-h-[550px] xl:aspect-square 2xl:aspect-auto">
      {RESULT_SLIDES.map((slide, index) => (
        <div
          key={slide.image.src}
          className={cn(
            "absolute inset-0 transition-opacity duration-500 bg-white",
            index === activeIndex ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          <Image
            src={slide.image.src}
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
};

function ResultSlideLayout({ slide, activeIndex, onPrevClick, onNextClick }: ResultSlideLayoutProps) {
  return (
    <div className={cn("grid gap-4", "xl:grid-cols-2 xl:gap-[27px]", "xl:[grid-template-areas:'header_media''content_media''actions_media']")}>
      <div className="order-1 xl:order-none xl:[grid-area:header]">
        <PageSubheading title={RESULTS_TITLE} description={RESULTS_DESCRIPTION} descriptionPlacement="bottom" />
      </div>

      <div className="order-2 xl:order-none xl:[grid-area:media]">
        <ResultMedia activeIndex={activeIndex} />
      </div>

      <div className="order-3 xl:order-none xl:[grid-area:content]">
        <ResultSections slide={slide} />
      </div>

      <div className="order-4 xl:order-none xl:self-end xl:[grid-area:actions]">
        <ResultActions onPrevClick={onPrevClick} onNextClick={onNextClick} dialogContext={slide.image.alt} />
      </div>
    </div>
  );
}

export function HomeResults() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = RESULT_SLIDES[activeIndex];

  const showPreviousSlide = () => {
    setActiveIndex((currentIndex) => (currentIndex - 1 + RESULT_SLIDES.length) % RESULT_SLIDES.length);
  };

  const showNextSlide = () => {
    setActiveIndex((currentIndex) => (currentIndex + 1) % RESULT_SLIDES.length);
  };

  return (
    <section className="my-[35px] md:my-[45px]">
      <div>
        <ResultSlideLayout slide={activeSlide} activeIndex={activeIndex} onPrevClick={showPreviousSlide} onNextClick={showNextSlide} />
      </div>
    </section>
  );
}
