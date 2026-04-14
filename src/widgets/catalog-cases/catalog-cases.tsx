"use client";

import { cn } from "@/shared/lib/cn";
import { PageSubheading } from "@/shared/ui/page-subheading";
import { SliderControl } from "@/shared/ui/slider-control";
import Image from "next/image";
import { type TouchEvent, useEffect, useRef, useState } from "react";

type CatalogCaseImage = {
  src: string;
  alt: string;
};

type CatalogCaseItem = {
  id: string;
  company: string;
  description: string;
  result: string;
  images: [CatalogCaseImage, CatalogCaseImage];
};

const CATALOG_CASES_TITLE = "Примеры\nреализованных работ";
const MOBILE_FADE_DURATION_MS = 180;
const MOBILE_SWIPE_THRESHOLD_PX = 36;

const CATALOG_CASES = [
  {
    id: "kolchuga",
    company: "КОЛЬЧУГА",
    description: "Разработали и произвели худи и футболки с деликатным брендированием для сотрудников и корпоративного использования.",
    result: "Практичный мерч на каждый день, который поддерживает фирменный стиль компании и остаётся удобным в носке.",
    images: [
      { src: "/catalog/cases/kolchuga-square.jpg", alt: "Кольчуга — кейс, фото 1" },
      { src: "/catalog/cases/kolchuga-tall.jpg", alt: "Кольчуга — кейс, фото 2" },
    ],
  },
  {
    id: "tihii-dom",
    company: "ТИХИЙ ДОМ",
    description: "Создали корпоративный набор с цельной визуальной концепцией, в котором каждая деталь работает на образ бренда.",
    result: "Эстетичный фирменный подарок для клиентов и партнёров, который приятно дарить и легко ассоциировать с брендом.",
    images: [
      { src: "/catalog/cases/tihii-dom-square.jpg", alt: "Тихий дом — кейс, фото 1" },
      { src: "/catalog/cases/tihii-dom-tall.jpg", alt: "Тихий дом — кейс, фото 2" },
    ],
  },
] satisfies CatalogCaseItem[];

function CatalogCasesCard({ item }: { item: CatalogCaseItem }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isMobileImageVisible, setIsMobileImageVisible] = useState(true);
  const transitionTimeoutRef = useRef<number | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchDeltaXRef = useRef(0);
  const activeImage = item.images[activeImageIndex] ?? item.images[0];
  const squareImage = item.images[0];
  const tallImage = item.images[1];

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current !== null) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  function commitImageChange(nextIndex: number) {
    if (!item.images[nextIndex] || nextIndex === activeImageIndex) {
      return;
    }

    if (transitionTimeoutRef.current !== null) {
      window.clearTimeout(transitionTimeoutRef.current);
    }

    setIsMobileImageVisible(false);

    transitionTimeoutRef.current = window.setTimeout(() => {
      setActiveImageIndex(nextIndex);
      setIsMobileImageVisible(true);
      transitionTimeoutRef.current = null;
    }, MOBILE_FADE_DURATION_MS);
  }

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    touchStartXRef.current = event.touches[0]?.clientX ?? null;
    touchDeltaXRef.current = 0;
  }

  function handleTouchMove(event: TouchEvent<HTMLDivElement>) {
    if (touchStartXRef.current === null) {
      return;
    }

    touchDeltaXRef.current = (event.touches[0]?.clientX ?? 0) - touchStartXRef.current;
  }

  function handleTouchEnd() {
    if (touchStartXRef.current === null) {
      return;
    }

    if (touchDeltaXRef.current <= -MOBILE_SWIPE_THRESHOLD_PX && activeImageIndex < item.images.length - 1) {
      commitImageChange(activeImageIndex + 1);
    } else if (touchDeltaXRef.current >= MOBILE_SWIPE_THRESHOLD_PX && activeImageIndex > 0) {
      commitImageChange(activeImageIndex - 1);
    }

    touchStartXRef.current = null;
    touchDeltaXRef.current = 0;
  }

  return (
    <>
      <article className="flex flex-col py-6 first:pt-0 last:pb-0 md:hidden">
        <div
          className="relative aspect-square overflow-hidden rounded-[18px] bg-white select-none [touch-action:pan-y]"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className={cn("absolute inset-0 transition-opacity duration-200", isMobileImageVisible ? "opacity-100" : "opacity-0")}>
            <Image
              src={activeImage.src}
              alt={activeImage.alt}
              fill
              sizes="100vw"
              draggable={false}
              className="pointer-events-none select-none object-cover"
            />
          </div>
        </div>

        <SliderControl
          className="mx-auto mt-4"
          onPrevClick={() => commitImageChange(activeImageIndex - 1)}
          onNextClick={() => commitImageChange(activeImageIndex + 1)}
          prevDisabled={activeImageIndex === 0}
          nextDisabled={activeImageIndex === item.images.length - 1}
          prevAriaLabel={`Предыдущее изображение кейса ${item.company} (${activeImageIndex + 1} из ${item.images.length})`}
          nextAriaLabel={`Следующее изображение кейса ${item.company} (${activeImageIndex + 1} из ${item.images.length})`}
        />

        <div className="mt-5 space-y-4 text-[var(--heading)]">
          <h3 className="font-heading text-3xl leading-[0.95] tracking-[0.015em]">{item.company}</h3>
          <p className="text-sm leading-[1.3] tracking-[-0.03em] text-[var(--text-muted)]">{item.description}</p>
          <div className="space-y-2">
            <p className="font-heading text-3xl leading-[0.95] tracking-[0.015em]">Что получил клиент:</p>
            <p className="text-sm leading-[1.3] tracking-[-0.03em] text-[var(--text-muted)]">{item.result}</p>
          </div>
        </div>
      </article>

      <article className={cn("hidden md:grid md:grid-cols-[1fr_1fr] md:gap-x-7", "md:[grid-template-areas:'square_tall''text_tall']")}>
        <div className="relative aspect-square overflow-hidden rounded-[18px] bg-[var(--surface)] [grid-area:square]">
          <Image src={squareImage.src} alt={squareImage.alt} fill sizes="(max-width: 1279px) 46vw, 22vw" className="object-cover" />
        </div>

        <div className="relative h-full min-h-[540px] overflow-hidden rounded-[18px] bg-[var(--surface)] [grid-area:tall]">
          <Image src={tallImage.src} alt={tallImage.alt} fill sizes="(max-width: 1279px) 46vw, 22vw" className="object-cover" />
        </div>

        <div className="mt-5 space-y-5 text-[var(--heading)] [grid-area:text]">
          <h3 className="font-heading text-5xl leading-[0.95] tracking-[0.015em]">{item.company}</h3>
          <p className="text-xs sm:text-base xl:text-xl leading-[1.3] tracking-[-0.03em] text-[var(--text-muted)]">{item.description}</p>
          <div className="space-y-3">
            <p className="font-heading text-5xl leading-[0.95] tracking-[0.015em]">Что получил клиент:</p>
            <p className="text-xs sm:text-base xl:text-xl leading-[1.3] tracking-[-0.03em] text-[var(--text-muted)]">{item.result}</p>
          </div>
        </div>
      </article>
    </>
  );
}

export function CatalogCases() {
  return (
    <section className="my-[63px] md:my-[72px] xl:my-[90px]">
      <PageSubheading title={CATALOG_CASES_TITLE} />

      <div className="mt-8 grid md:gap-6 xl:grid-cols-2 xl:gap-9">
        {CATALOG_CASES.map((item, index) => (
          <div
            key={item.id}
            className={cn("pt-6 first:pt-0", index > 0 && "border-t border-border", "md:mx-4 lg:mx-6 xl:mx-0 xl:border-t-0 xl:pt-0")}
          >
            <CatalogCasesCard item={item} />
          </div>
        ))}
      </div>
    </section>
  );
}
