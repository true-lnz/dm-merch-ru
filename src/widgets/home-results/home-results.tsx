"use client";

import { RequestDialog } from "@/features/request-dialog";
import { cn } from "@/shared/lib/cn";
import { SliderControl } from "@/shared/ui/slider-control";
import Image from "next/image";
import { useState } from "react";
import { PageSubheading } from "../../shared/ui/page-subheading";

type HomeResultSlide = {
  title: string;
  description: string;
  before: string;
  after: string;
  result: string;
  image: {
    src: string;
    alt: string;
  };
};

const RESULT_SLIDES = [
  {
    title: "Кейсы с результатом",
    description:
      "Как мерч решает задачи бизнеса — на реальных проектах",
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
    title: "Кейсы с результатом",
    description:
      "Как мерч решает задачи бизнеса — на реальных проектах",
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

  return (
    <section className="mb-[63px] md:mb-[72px] xl:mb-[90px] mt-[28.8px]">
      <div className="mt-8 grid gap-6 xl:grid-cols-2 xl:gap-10">
        <div className="space-y-6">
					<PageSubheading
						title={activeSlide.title}
						description={activeSlide.description}
						descriptionPlacement="bottom"
					/>
					<div className="relative aspect-square overflow-hidden rounded-[24px] bg-white xl:hidden">
						{RESULT_SLIDES.map((slide, index) => (
							<div
								key={`${slide.image.src}-mobile`}
								className={cn(
									"absolute inset-0 flex transition-opacity duration-500",
									index === activeIndex ? "opacity-100" : "pointer-events-none opacity-0",
								)}
							>
								<Image
									src={slide.image.src}
									alt={slide.image.alt}
									sizes="100vw"
									width={1200}
									height={1200}
									className="h-auto w-full object-cover"
								/>
							</div>
						))}
					</div>
					<div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
						<article>
							<h3 className="font-heading text-3xl md:text-5xl leading-none uppercase text-[var(--heading)]">Было</h3>
							<p className="mt-3 text-xs md:text-base leading-[1.35] tracking-[-0.03em] text-[var(--text-muted)]">
								{activeSlide.before}
							</p>
						</article>
						<article>
							<h3 className="font-heading text-3xl md:text-5xl leading-none uppercase text-[var(--heading)]">Стало</h3>
							<p className="mt-3 text-xs md:text-base leading-[1.35] tracking-[-0.03em] text-[var(--text-muted)]">
								{activeSlide.after}
							</p>
						</article>
						<article>
            <h3 className="font-heading text-3xl md:text-5xl leading-none uppercase text-[var(--heading)]">Результат</h3>
            <p className="mt-3 text-xs md:text-base leading-[1.35] tracking-[-0.03em] text-[var(--text-muted)]">
              {activeSlide.result}
            </p>
          </article>
				</div>
				
				<div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between xl:mt-8">
					<SliderControl
						className="order-1 mx-auto md:order-2 md:mx-0"
						onPrevClick={() =>
							setActiveIndex((activeIndex - 1 + RESULT_SLIDES.length) % RESULT_SLIDES.length)
						}
						onNextClick={() => setActiveIndex((activeIndex + 1) % RESULT_SLIDES.length)}
						prevAriaLabel="Предыдущий слайд"
						nextAriaLabel="Следующий слайд"
					/>
					<RequestDialog
						className="order-2 md:order-1 lg:w-[239px]"
						label="Обсудить задачу"
						showCaption={false}
					/>
				</div>

      </div>

				<div className="relative hidden overflow-hidden rounded-[24px] bg-white xl:block">
          {RESULT_SLIDES.map((slide, index) => (
            <div
              key={slide.image.src}
              className={cn(
                "absolute inset-0 flex transition-opacity duration-500",
                index === activeIndex ? "opacity-100" : "pointer-events-none opacity-0",
              )}
            >
              <Image
                src={slide.image.src}
                alt={slide.image.alt}
                sizes="(max-width: 1279px) 100vw, 48vw"
                width={1200}
                height={1500}
                className="h-auto w-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
