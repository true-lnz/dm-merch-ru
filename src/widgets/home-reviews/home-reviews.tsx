"use client";

import { cn } from "@/shared/lib/cn";
import { SliderControl } from "@/shared/ui/slider-control";
import Image from "next/image";
import { useState } from "react";
import { PageSubheading } from "../../shared/ui/page-subheading";

type HomeReview = {
  company: string;
  name: string;
  role: string;
  quote: string[];
  image: {
    src: string;
    alt: string;
  };
  avatar: {
    src: string;
    alt: string;
  };
};

const TESTIMONIALS_TITLE = "Отзывы наших клиентов";

const TESTIMONIALS = [
  {
    company: "Ресторан «Магадан»",
    name: "Эльнора",
    role: "Управляющий ресторана",
    quote: [
      "Искали подрядчика для формы на фестиваль: важно было, чтобы команда выглядела стильно и премиально, а сотрудникам было удобно работать.",
      "В итоге получили форму, которая поддержала наш имидж и выглядела уместно на мероприятии, без ощущения промо-одежды.",
      "Гости фестиваля отдельно спрашивали, можно ли купить дождевики, и это был лучший индикатор, что мерч действительно получился сильным.",
    ],
    image: {
      src: "/contacts/img_contacts_cover.png",
      alt: "Команда ресторана в мерче",
    },
    avatar: {
      src: "/cases/mvk/coffee-shirt.jpg",
      alt: "Портрет клиента",
    },
  },
  {
    company: "Уфаойл",
    name: "Мария",
    role: "Руководитель маркетинга",
    quote: [
      "Нужно было собрать подарочный набор для партнеров и сделать его не шаблонным, а по-настоящему полезным.",
      "Команда помогла быстро собрать комплект, продумать упаковку и заранее показать образцы, поэтому запуск прошел спокойно.",
      "Набор оказался сильным инструментом в переговорах: его запомнили и внутри компании, и у партнеров.",
    ],
    image: {
      src: "/cases/ufaoil/blanket-gift.jpg",
      alt: "Подарочный набор бренда",
    },
    avatar: {
      src: "/cases/ufaoil/honey-pump.jpg",
      alt: "Портрет клиента",
    },
  },
] satisfies HomeReview[];

export function HomeReviews() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = TESTIMONIALS[activeIndex];
  const isFirstSlide = activeIndex === 0;
  const isLastSlide = activeIndex === TESTIMONIALS.length - 1;

  return (
    <section className="my-[63px] md:my-[72px] xl:my-[90px]">
      <PageSubheading title={TESTIMONIALS_TITLE} />

      <div className="mt-8 grid gap-6 lg:grid-cols-12 lg:gap-0">
        <div className="relative min-h-[320px] overflow-hidden rounded-[18px] bg-[var(--card-bg)] md:rounded-[22.5px] lg:col-span-7 lg:min-h-[616px]">
          {TESTIMONIALS.map((item, index) => (
            <div
              key={item.company}
              className={cn(
                "absolute inset-0 transition-opacity duration-500",
                index === activeIndex ? "opacity-100" : "pointer-events-none opacity-0",
              )}
            >
              <Image
                src={item.image.src}
                alt={item.image.alt}
                fill
                sizes="(max-width: 1023px) 100vw, 58vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col rounded-[18px] bg-[var(--accent)] p-5 text-white md:rounded-[22.5px] md:p-8 lg:col-span-5">
          <div className="flex items-center gap-4">
            <div className="relative size-[70px] overflow-hidden rounded-[18px] md:rounded-[22.5px] bg-white">
              <Image src={activeItem.avatar.src} alt={activeItem.avatar.alt} fill sizes="70px" className="object-cover" />
            </div>
            <div>
              <p className="font-heading text-[28px] leading-none uppercase md:text-4xl">{activeItem.name}</p>
              <p className="mt-1 text-[13px] leading-[1.35] tracking-[-0.03em] text-white/80 md:text-[15px]">{activeItem.role}</p>
            </div>
          </div>

          <h3 className="mt-5 font-heading text-3xl leading-none uppercase md:text-4xl">{activeItem.company}</h3>

          <div className="mt-5 space-y-4 text-xs leading-[1.35] tracking-[-0.03em] text-white/80 sm:text-sm lg:text-lg">
            {activeItem.quote.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <SliderControl
            className="mt-auto"
            onPrevClick={() => setActiveIndex((currentIndex) => currentIndex - 1)}
            onNextClick={() => setActiveIndex((currentIndex) => currentIndex + 1)}
            prevDisabled={isFirstSlide}
            nextDisabled={isLastSlide}
            prevAriaLabel={`Предыдущий отзыв (${activeIndex + 1} из ${TESTIMONIALS.length})`}
            nextAriaLabel={`Следующий отзыв (${activeIndex + 1} из ${TESTIMONIALS.length})`}
          />
        </div>
      </div>
    </section>
  );
}
