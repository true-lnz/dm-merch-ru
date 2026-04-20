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

export function HomeResults() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = RESULT_SLIDES[activeIndex];
  const contentItems = [
    { title: "Было", text: activeSlide.before },
    { title: "Стало", text: activeSlide.after },
    { title: "Результат", text: activeSlide.result },
  ];

  return (
    <section className="my-[45px]">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] xl:items-stretch xl:gap-x-[16px]">
        <div className="order-1 flex flex-col xl:min-h-[600px]">
          <PageSubheading title={RESULTS_TITLE} description={RESULTS_DESCRIPTION} descriptionPlacement="bottom" />

          <div className="order-3 my-[36px] grid auto-rows-fr grid-cols-1 gap-[20px] xl:mt-[55px] xl:mb-0 xl:flex-1 xl:grid-cols-2 xl:gap-x-[20px] xl:gap-y-[20px]">
            {contentItems.map((item, index) => (
              <article key={item.title} className={["flex h-full flex-col", index === contentItems.length - 1 ? "xl:col-span-2" : ""].join(" ")}>
                <h3 className="font-heading text-3xl leading-none uppercase text-[var(--heading)] md:text-4xl">{item.title}</h3>
                <p className="mt-[15px] text-sm leading-[1.35] tracking-[-0.03em] text-[var(--text-muted)] md:text-base">{item.text}</p>
              </article>
            ))}
          </div>

          <div className="order-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between xl:mt-[40px]">
            <SliderControl
              className="order-1 mx-auto md:order-2 md:mx-0"
              onPrevClick={() => setActiveIndex((currentIndex) => (currentIndex - 1 + RESULT_SLIDES.length) % RESULT_SLIDES.length)}
              onNextClick={() => setActiveIndex((currentIndex) => (currentIndex + 1) % RESULT_SLIDES.length)}
              prevAriaLabel="Предыдущий слайд"
              nextAriaLabel="Следующий слайд"
            />
            <RequestDialog>
              <button
                type="button"
                className="cursor-pointer order-2 inline-flex h-[47px] items-center justify-center rounded-[9px] bg-[var(--accent)] px-6 text-lg font-medium tracking-[-0.04em] text-white transition hover:bg-[var(--accent-hover)] md:order-1 lg:w-[239px]"
              >
                Оставить заявку
              </button>
            </RequestDialog>
          </div>
        </div>

        <div className="order-2 relative aspect-square overflow-hidden rounded-[18px] bg-white md:rounded-[22.5px] xl:h-full xl:min-h-[600px] xl:aspect-auto">
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
