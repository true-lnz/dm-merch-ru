"use client";

import Image from "next/image";
import { useState } from "react";
import { PageSubheader } from "@/shared/ui/page-subheader";
import { cn } from "@/shared/lib/cn";

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

type HomeTestimonialsProps = {
  title: string;
  items: HomeTestimonial[];
};

export function HomeTestimonials({
  title,
  items,
}: HomeTestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = items[activeIndex];

  return (
    <section className="py-14 md:py-20 xl:py-[110px]">
      <PageSubheader title={title} />

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
          {items.map((item, index) => (
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
        {items.map((item, index) => (
          <button
            key={item.company}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={cn("h-1.5 rounded-full bg-[var(--border)] transition-all", index === activeIndex ? "w-10 bg-[var(--accent)]" : "w-3")}
            aria-label={`Показать отзыв: ${item.company}`}
          />
        ))}
      </div>
    </section>
  );
}
