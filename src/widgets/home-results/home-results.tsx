"use client";

import { RequestDialog } from "@/features/request-dialog";
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
      "Подобрали и произвели комплект мерча под разные сценарии погоды: кепки и футболки - для жары, худи и дождевики - для прохладной и дождливой погоды. В итоге команда была полностью обеспечена одеждой под любые условия фестиваля.",
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
    <section className="my-[63px] md:my-[72px] xl:my-[90px]">
      <div className="grid gap-6 xl:grid-cols-2 xl:gap-x-[16px] xl:gap-y-0">
        <div className="order-1 xl:order-1">
          <PageSubheading
            title={RESULTS_TITLE}
            description={RESULTS_DESCRIPTION}
            descriptionPlacement="bottom"
          />
        </div>

        <div className="order-2 relative aspect-square xl:aspect-auto overflow-hidden rounded-[18px] md:rounded-[22.5px] bg-white xl:order-4 xl:col-start-2 xl:row-start-1 xl:row-span-3">
          <Image
            key={activeSlide.image.src}
            src={activeSlide.image.src}
            alt={activeSlide.image.alt}
            fill
            sizes="(max-width: 1279px) 100vw, 48vw"
            className="object-cover"
          />
        </div>

        <div className="order-3 my-[36px] grid grid-cols-1 gap-[20px] xl:order-2 xl:my-[55px] xl:grid-cols-2 xl:gap-x-[55px] xl:gap-y-[40px]">
          {contentItems.map((item) => (
            <article key={item.title}>
              <h3 className="font-heading text-3xl leading-none uppercase text-[var(--heading)] md:text-5xl">
                {item.title}
              </h3>
              <p className="mt-[15px] text-xs leading-[1.35] tracking-[-0.03em] text-[var(--text-muted)] md:text-base">
                {item.text}
              </p>
            </article>
          ))}
        </div>

        <div className="order-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between xl:order-3">
          <SliderControl
            className="order-1 mx-auto md:order-2 md:mx-0"
            onPrevClick={() =>
              setActiveIndex((currentIndex) => (currentIndex - 1 + RESULT_SLIDES.length) % RESULT_SLIDES.length)
            }
            onNextClick={() =>
              setActiveIndex((currentIndex) => (currentIndex + 1) % RESULT_SLIDES.length)
            }
            prevAriaLabel="Предыдущий слайд"
            nextAriaLabel="Следующий слайд"
          />
          <RequestDialog>
            <button
              type="button"
              className="cursor-pointer order-2 inline-flex h-[47px] items-center justify-center rounded-[9px] bg-[var(--accent)] px-6 text-[16px] font-medium tracking-[-0.04em] text-white transition hover:bg-[var(--accent-hover)] md:order-1 lg:w-[239px]"
            >
              Оставить заявку
            </button>
          </RequestDialog>
        </div>
      </div>
    </section>
  );
}
