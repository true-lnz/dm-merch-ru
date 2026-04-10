"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/shared/lib/cn";
import { PageSubheading } from "../../shared/ui/page-subheading";

type HomeTestimonial = {
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

const TESTIMONIALS_TITLE = "Отзывы, которые закрывают ваши задачи";

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
] satisfies HomeTestimonial[];

export function HomeTestimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = TESTIMONIALS[activeIndex];

  return (
    <section className="py-14 md:py-20 xl:py-[110px]">
      <PageSubheading title={TESTIMONIALS_TITLE} />

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)] xl:gap-[40px]">
        <div className="rounded-[24px] bg-[var(--card-bg)] p-5 md:p-8">
          <div className="flex items-center gap-4">
            <div className="relative size-[70px] overflow-hidden rounded-[20px] bg-white">
              <Image src={activeItem.avatar.src} alt={activeItem.avatar.alt} fill sizes="70px" className="object-cover" />
            </div>
            <div>
              <p className="font-heading text-[28px] leading-none uppercase text-[var(--heading)] md:text-[40px]">{activeItem.name}</p>
              <p className="mt-1 text-[13px] leading-[1.35] tracking-[-0.03em] text-[var(--text-muted)] md:text-[15px]">{activeItem.role}</p>
            </div>
          </div>

          <h3 className="mt-5 font-heading text-[28px] leading-none uppercase text-[var(--heading)] md:text-[40px]">{activeItem.company}</h3>

          <div className="mt-5 space-y-4 text-[15px] leading-[1.35] tracking-[-0.03em] text-[var(--text-muted)] md:text-[18px]">
            {activeItem.quote.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="relative min-h-[320px] overflow-hidden rounded-[24px] bg-[var(--card-bg)] xl:min-h-[616px]">
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
                sizes="(max-width: 1279px) 100vw, 54vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-[18px]">
        {TESTIMONIALS.map((item, index) => (
          <button
            key={item.company}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={cn(
              "h-1.5 rounded-full bg-[var(--border)] transition-all",
              index === activeIndex ? "w-10 bg-[var(--accent)]" : "w-3",
            )}
            aria-label={`Показать отзыв: ${item.company}`}
          />
        ))}
      </div>
    </section>
  );
}
