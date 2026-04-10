"use client";

import Image from "next/image";
import { useState } from "react";
import { RequestDialog } from "@/features/request-dialog";
import { PageSubheader } from "@/shared/ui/page-subheader";
import { cn } from "@/shared/lib/cn";

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

type HomeResultsSliderProps = {
  slides: HomeResultSlide[];
};

function SliderControl({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex size-[60px] items-center justify-center rounded-full border border-[var(--border)] bg-white transition-colors hover:border-[var(--accent)] hover:bg-[var(--accent)]"
      aria-label={direction === "prev" ? "Предыдущий слайд" : "Следующий слайд"}
    >
      <Image
        src="/home/slider-arrow.svg"
        alt=""
        width={10}
        height={17}
        aria-hidden="true"
        className={cn("transition-[filter,transform]", direction === "next" && "rotate-180")}
      />
    </button>
  );
}

export function HomeResultsSlider({ slides }: HomeResultsSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex];

  return (
    <section className="py-14 md:py-20 xl:py-[118px]">
      <PageSubheader
        title={activeSlide.title}
        description={activeSlide.description}
        descriptionPlacement="side"
        descriptionClassName="xl:max-w-[674px]"
      />

      <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,400px)_minmax(0,400px)_minmax(0,1fr)] xl:gap-10">
        <div className="space-y-6">
          <article>
            <h3 className="font-heading text-[28px] leading-none uppercase text-[var(--heading)] md:text-[43px]">Было</h3>
            <p className="mt-3 text-[15px] leading-[1.35] tracking-[-0.03em] text-[var(--text-muted)] md:text-[18px]">{activeSlide.before}</p>
          </article>
          <article>
            <h3 className="font-heading text-[28px] leading-none uppercase text-[var(--heading)] md:text-[43px]">Стало</h3>
            <p className="mt-3 text-[15px] leading-[1.35] tracking-[-0.03em] text-[var(--text-muted)] md:text-[18px]">{activeSlide.after}</p>
          </article>
          <article>
            <h3 className="font-heading text-[28px] leading-none uppercase text-[var(--heading)] md:text-[43px]">Результат</h3>
            <p className="mt-3 text-[15px] leading-[1.35] tracking-[-0.03em] text-[var(--text-muted)] md:text-[18px]">{activeSlide.result}</p>
          </article>
        </div>

        <div className="relative min-h-[320px] overflow-hidden rounded-[24px] bg-[var(--card-bg)] xl:col-span-2 xl:min-h-[705px]">
          {slides.map((slide, index) => (
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
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between xl:mt-8">
        <RequestDialog className="lg:w-[239px]" label="Оставить заявку" showCaption={false} />
        <div className="flex items-center justify-center gap-[18px]">
          <SliderControl direction="prev" onClick={() => setActiveIndex((activeIndex - 1 + slides.length) % slides.length)} />
          <SliderControl direction="next" onClick={() => setActiveIndex((activeIndex + 1) % slides.length)} />
        </div>
      </div>
    </section>
  );
}
