"use client";

import { cn } from "@/shared/lib/cn";
import { buttonVariants } from "@/shared/ui/button";
import { PageSubheading } from "@/shared/ui/page-subheading";
import { SliderControl } from "@/shared/ui/slider-control";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PartnerProductCard } from "./partner-product-card";
import type { PartnerProductItem } from "./types";

type HomePartnerProductsProps = {
  showIntro?: boolean;
};

const MOBILE_FADE_DURATION_MS = 180;

const PARTNER_PRODUCTS_TITLE = "Более 50 000 товаров\nдля брендирования";

const PARTNER_PRODUCTS_DESCRIPTION = "Комбинируем модели, ткани, фасоны и виды брендирования под конкретные задачи бизнеса";

const PARTNER_PRODUCTS = [
  {
    title: "Футболки \nи поло",
    description: "Для команды, мероприятий и повседневного использования",
    imageUrl: "/home/partner-products/01-futbolki-i-polo.png",
    href: "https://gifts.ru/",
  },
  {
    title: "ТОЛСТОВКИ",
    description: "Базовый элемент корпоративного мерча. Актуально вне сезона",
    imageUrl: "/home/partner-products/02-tolstovki.png",
    href: "https://gifts.ru/",
  },
  {
    title: "РУБАШКИ",
    description: "Фирменный стиль для деловых задач. Ваш профессиональный имидж",
    imageUrl: "/home/partner-products/03-rubashki.png",
    href: "https://gifts.ru/",
  },
  {
    title: "безрукавки",
    description: "Когда важно, чтобы бренд сопровождал команду не только в офисе",
    imageUrl: "/home/partner-products/04-bezrukavki.png",
    href: "https://gifts.ru/",
  },
  {
    title: "дождевики",
    description: "Для команды, мероприятий и повседневного использования",
    imageUrl: "/home/partner-products/05-dozhdeviki.png",
    href: "https://gifts.ru/",
  },
  {
    title: "бомберы",
    description: "Базовый элемент корпоративного мерча. Актуально вне сезона",
    imageUrl: "/home/partner-products/06-bombery.png",
    href: "https://gifts.ru/",
  },
  {
    title: "ГОЛОВНЫЕ\nУБОРЫ",
    description: "Легко носить. Легко масштабировать. Легко узнать бренд",
    imageUrl: "/home/partner-products/07-golovnye-ubory.png",
    href: "https://gifts.ru/",
  },
  {
    title: "СУМКИ \nИ РЮКЗАКИ",
    description: "Чем чаще используют — тем сильнее работает бренд",
    imageUrl: "/home/partner-products/08-sumki-i-ryukzaki.png",
    href: "https://gifts.ru/",
  },
  {
    title: "ЭЛЕКТРОНИКА",
    description: "Работает на узнаваемость за счёт постоянного использования",
    imageUrl: "/home/partner-products/09-elektronika.png",
    href: "https://gifts.ru/",
  },
  {
    title: "Деловые\nаксессуары",
    description: "Детали, которые формируют образ компании",
    imageUrl: "/home/partner-products/10-delovye-aksessuary.png",
    href: "https://gifts.ru/",
  },
  {
    title: "СУВЕНИРНАЯ ПРОДУКЦИЯ",
    description: "Подарок с идеей, который делает отношения теплее",
    imageUrl: "/home/partner-products/11-suvenirnaya-produkciya.png",
    href: "https://gifts.ru/",
  },
  {
    title: "Пакеты",
    description: "Когда важно вовлечение и чувство принадлежности",
    imageUrl: "/home/partner-products/12-pakety.png",
    href: "https://gifts.ru/",
  },
] satisfies PartnerProductItem[];

export function HomePartnerProducts({ showIntro = true }: HomePartnerProductsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobileContentVisible, setIsMobileContentVisible] = useState(true);
  const transitionTimeoutRef = useRef<number | null>(null);
  const activeItem = PARTNER_PRODUCTS[activeIndex] ?? PARTNER_PRODUCTS[0];

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current !== null) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  function commitCardChange(nextIndex: number) {
    if (!PARTNER_PRODUCTS[nextIndex] || nextIndex === activeIndex) {
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
      {showIntro ? (
        <PageSubheading
          title={PARTNER_PRODUCTS_TITLE}
          description={PARTNER_PRODUCTS_DESCRIPTION}
          descriptionPlacement="side"
          sideDescriptionLayout="two-columns"
          descriptionClassName="max-w-[35.0625rem]"
        />
      ) : null}

      <div className={cn("md:hidden flex flex-col", showIntro ? "mt-8" : "mt-0")}>
        <article className="flex h-full flex-col overflow-hidden rounded-[18px] md:rounded-[22.5px] bg-[var(--card-bg)]">
          <div className={cn("transition-opacity duration-200", isMobileContentVisible ? "opacity-100" : "opacity-0")}>
            <div className="relative aspect-square w-full overflow-hidden bg-[var(--surface)]">
              <Image src={activeItem.imageUrl} alt={activeItem.title} fill sizes="100vw" className="object-cover" />
            </div>
            <div className="space-y-2 p-5 md:p-7">
              <h3 className="font-heading text-3xl xl:text-5xl leading-[0.95] tracking-[0.01em] text-[var(--heading)]">{activeItem.title}</h3>
              <p className="text-sm text-[var(--text-muted)]">{activeItem.description}</p>
            </div>
          </div>
          <div className="mt-auto p-4 pt-0 md:p-5 md:pt-0">
            <Link href={activeItem.href} className={cn(buttonVariants(), "w-full")} target="_blank" rel="noreferrer">
              Узнать подробнее
            </Link>
          </div>
        </article>
        <SliderControl
          className="mt-5 self-center"
          onPrevClick={() => commitCardChange(activeIndex - 1)}
          onNextClick={() => commitCardChange(activeIndex + 1)}
          prevDisabled={activeIndex === 0}
          nextDisabled={activeIndex === PARTNER_PRODUCTS.length - 1}
          prevAriaLabel={`Предыдущая карточка (${activeIndex + 1} из ${PARTNER_PRODUCTS.length})`}
          nextAriaLabel={`Следующая карточка (${activeIndex + 1} из ${PARTNER_PRODUCTS.length})`}
        />
      </div>

      <div className={cn("hidden gap-7 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", showIntro ? "mt-10" : "mt-0")}>
        {PARTNER_PRODUCTS.map((item) => (
          <PartnerProductCard key={item.title} item={item} />
        ))}
      </div>
    </section>
  );
}
