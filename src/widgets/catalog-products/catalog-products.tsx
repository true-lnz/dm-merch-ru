"use client";

import { RequestDialog } from "@/features/request-dialog";
import { cn } from "@/shared/lib/cn";
import { buttonVariants } from "@/shared/ui/button";
import { ContentCard } from "@/shared/ui/content-card";
import { PageSubheading } from "@/shared/ui/page-subheading";
import { SliderControl } from "@/shared/ui/slider-control";
import { useEffect, useRef, useState } from "react";

const MOBILE_FADE_DURATION_MS = 180;

type CatalogProductItem = {
  title: string;
  description: string;
  imageUrl: string;
};

function CatalogCard({ item }: { item: CatalogProductItem }) {
  return (
    <ContentCard
      title={item.title}
      excerpt={item.description}
      image={{ url: item.imageUrl, alt: item.title, width: 413, height: 291 }}
      imageContainerClassName="aspect-[413/291]"
      ctaNode={
        <RequestDialog>
          <button type="button" className={cn(buttonVariants(), "w-full")} aria-label={`Отправить заявку: ${item.title}`}>
            Отправить заявку
          </button>
        </RequestDialog>
      }
    />
  );
}

export function CatalogProducts({ items, showHeading = false }: { items: CatalogProductItem[]; showHeading?: boolean }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobileContentVisible, setIsMobileContentVisible] = useState(true);
  const transitionTimeoutRef = useRef<number | null>(null);
  const activeItem = items[activeIndex] ?? items[0];

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current !== null) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  function commitCardChange(nextIndex: number) {
    if (!items[nextIndex] || nextIndex === activeIndex) {
      return;
    }

    if (transitionTimeoutRef.current !== null) {
      window.clearTimeout(transitionTimeoutRef.current);
    }

    setIsMobileContentVisible(false);

    transitionTimeoutRef.current = window.setTimeout(() => {
      setActiveIndex(nextIndex);
      setIsMobileContentVisible(true);
      transitionTimeoutRef.current = null;
    }, MOBILE_FADE_DURATION_MS);
  }

  if (!activeItem) {
    return null;
  }

  return (
    <section className="my-[63px] md:my-[72px] xl:my-[90px]">
      {showHeading ? <PageSubheading title="НАШИ ТОВАРЫ" /> : null}

      <div className={cn("md:hidden flex flex-col", showHeading ? "mt-8" : "mt-0")}>
        <div className={cn("transition-opacity duration-200", isMobileContentVisible ? "opacity-100" : "opacity-0")}>
          <CatalogCard item={activeItem} />
        </div>
        <SliderControl
          className="mt-5 self-center"
          onPrevClick={() => commitCardChange(activeIndex - 1)}
          onNextClick={() => commitCardChange(activeIndex + 1)}
          prevDisabled={activeIndex === 0}
          nextDisabled={activeIndex === items.length - 1}
          prevAriaLabel={`Предыдущая карточка (${activeIndex + 1} из ${items.length})`}
          nextAriaLabel={`Следующая карточка (${activeIndex + 1} из ${items.length})`}
        />
      </div>

      <div className={cn("hidden gap-7 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", showHeading ? "mt-10" : "mt-0")}>
        {items.map((item) => (
          <CatalogCard key={`${item.title}-${item.imageUrl}`} item={item} />
        ))}
      </div>
    </section>
  );
}
