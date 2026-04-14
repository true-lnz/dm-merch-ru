"use client";

import { RequestDialog } from "@/features/request-dialog";
import { cn } from "@/shared/lib/cn";
import { buttonVariants } from "@/shared/ui/button";
import { ContentCard } from "@/shared/ui/content-card";
import { PageSubheading } from "@/shared/ui/page-subheading";
import { SliderControl } from "@/shared/ui/slider-control";
import { useEffect, useRef, useState } from "react";

type CatalogProductItem = {
  title: string;
  price: string;
  imageUrl: string;
};

const MOBILE_FADE_DURATION_MS = 180;

const CATALOG_PRODUCTS = [
  { title: "Футболки и поло", price: "От 450 ₽", imageUrl: "/catalog/1_futbolki.png" },
  { title: "толстовки", price: "От 870 ₽", imageUrl: "/catalog/2_tolstovki.png" },
  { title: "верхняя одежда", price: "От 870 ₽", imageUrl: "/catalog/3_verhnya_odezhda.png" },
  { title: "брюки", price: "От 900 ₽", imageUrl: "/catalog/4_bryki.png" },
  { title: "спортивная одежда", price: "От 900 ₽", imageUrl: "/catalog/5_sport_wear.png" },
  { title: "головные уборы", price: "От 450 ₽", imageUrl: "/catalog/6_hats.png" },
  { title: "сумки и рюкзаки", price: "От 150 ₽", imageUrl: "/catalog/7_sumki.png" },
  { title: "Сувенирная продукция", price: "От 300 ₽", imageUrl: "/catalog/8_souvenir.png" },
  { title: "Авторская сувенирная продукция", price: "От 550 ₽", imageUrl: "/catalog/9_author_souvenir.png" },
  { title: "Деловые аксессуары", price: "От 550 ₽", imageUrl: "/catalog/10_buz_accessories.png" },
  { title: "Униформа", price: "От 750 ₽", imageUrl: "/catalog/11_uniform.png" },
] satisfies CatalogProductItem[];

function CatalogCard({ item }: { item: CatalogProductItem }) {
  return (
    <ContentCard
      title={item.title}
      excerpt={item.price}
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

export function CatalogProducts() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobileContentVisible, setIsMobileContentVisible] = useState(true);
  const transitionTimeoutRef = useRef<number | null>(null);
  const activeItem = CATALOG_PRODUCTS[activeIndex] ?? CATALOG_PRODUCTS[0];

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current !== null) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  function commitCardChange(nextIndex: number) {
    if (!CATALOG_PRODUCTS[nextIndex] || nextIndex === activeIndex) {
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

  return (
    <section className="my-[63px] md:my-[72px] xl:my-[90px]">
      <PageSubheading title="НАШИ ТОВАРЫ" />

      <div className="mt-8 md:hidden flex flex-col">
        <div className={cn("transition-opacity duration-200", isMobileContentVisible ? "opacity-100" : "opacity-0")}>
          <CatalogCard item={activeItem} />
        </div>
        <SliderControl
          className="mt-5 self-center"
          onPrevClick={() => commitCardChange(activeIndex - 1)}
          onNextClick={() => commitCardChange(activeIndex + 1)}
          prevDisabled={activeIndex === 0}
          nextDisabled={activeIndex === CATALOG_PRODUCTS.length - 1}
          prevAriaLabel={`Предыдущая карточка (${activeIndex + 1} из ${CATALOG_PRODUCTS.length})`}
          nextAriaLabel={`Следующая карточка (${activeIndex + 1} из ${CATALOG_PRODUCTS.length})`}
        />
      </div>

      <div className="mt-10 hidden gap-7 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {CATALOG_PRODUCTS.map((item) => (
          <CatalogCard key={item.title} item={item} />
        ))}
      </div>
    </section>
  );
}
