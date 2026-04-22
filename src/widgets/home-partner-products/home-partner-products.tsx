"use client";

import { cn } from "@/shared/lib/cn";
import { MobileSnapCarousel } from "@/shared/ui/mobile-snap-carousel";
import { PageSubheading } from "@/shared/ui/page-subheading";
import { PartnerProductCard } from "./partner-product-card";
import type { PartnerProductItem } from "./types";

type HomePartnerProductsProps = {
  showIntro?: boolean;
};

const PARTNER_PRODUCTS_TITLE = "Более 50 000 товаров\nдля брендирования";

const PARTNER_PRODUCTS_DESCRIPTION = "Комбинируем модели, ткани, фасоны и виды брендирования под конкретные задачи бизнеса";

const PARTNER_PRODUCTS = [
  {
    title: "Футболки \nи поло",
    description: "Для команды, мероприятий и повседневного использования",
    imageUrl: "/home/partner-products/01-futbolki-i-polo.png",
    href: "/catalog?category=futbolki",
  },
  {
    title: "ТОЛСТОВКИ",
    description: "Базовый элемент корпоративного мерча. Актуально вне сезона",
    imageUrl: "/home/partner-products/02-tolstovki.png",
    href: "/catalog?category=tolstovki",
  },
  {
    title: "РУБАШКИ",
    description: "Фирменный стиль для деловых задач. Ваш профессиональный имидж",
    imageUrl: "/home/partner-products/03-rubashki.png",
    href: "/partner-catalog",
  },
  {
    title: "безрукавки",
    description: "Когда важно, чтобы бренд сопровождал команду не только в офисе",
    imageUrl: "/home/partner-products/04-bezrukavki.png",
    href: "/catalog?category=verhnyaya-odezhda",
  },
  {
    title: "дождевики",
    description: "Для команды, мероприятий и повседневного использования",
    imageUrl: "/home/partner-products/05-dozhdeviki.png",
    href: "/catalog?category=verhnyaya-odezhda",
  },
  {
    title: "бомберы",
    description: "Базовый элемент корпоративного мерча. Актуально вне сезона",
    imageUrl: "/home/partner-products/06-bombery.png",
    href: "/catalog?category=verhnyaya-odezhda",
  },
  {
    title: "ГОЛОВНЫЕ\nУБОРЫ",
    description: "Легко носить. Легко масштабировать. Легко узнать бренд",
    imageUrl: "/home/partner-products/07-golovnye-ubory.png",
    href: "/catalog?category=headwear",
  },
  {
    title: "СУМКИ \nИ РЮКЗАКИ",
    description: "Чем чаще используют — тем сильнее работает бренд",
    imageUrl: "/home/partner-products/08-sumki-i-ryukzaki.png",
    href: "/catalog?category=bags",
  },
  {
    title: "ЭЛЕКТРОНИКА",
    description: "Работает на узнаваемость за счёт постоянного использования",
    imageUrl: "/home/partner-products/09-elektronika.png",
    href: "/partner-catalog",
  },
  {
    title: "Деловые\nаксессуары",
    description: "Детали, которые формируют образ компании",
    imageUrl: "/home/partner-products/10-delovye-aksessuary.png",
    href: "/catalog?category=business-accessories",
  },
  {
    title: "СУВЕНИРНАЯ ПРОДУКЦИЯ",
    description: "Подарок с идеей, который делает отношения теплее",
    imageUrl: "/home/partner-products/11-suvenirnaya-produkciya.png",
    href: "/catalog?category=souvenirs",
  },
  {
    title: "Пакеты",
    description: "Когда важно вовлечение и чувство принадлежности",
    imageUrl: "/home/partner-products/12-pakety.png",
    href: "/partner-catalog",
  },
] satisfies PartnerProductItem[];

export function HomePartnerProducts({ showIntro = true }: HomePartnerProductsProps) {
  return (
    <section className="my-[35px] md:my-[45px]">
      {showIntro ? (
        <PageSubheading
          title={PARTNER_PRODUCTS_TITLE}
          description={PARTNER_PRODUCTS_DESCRIPTION}
          descriptionPlacement="side"
          sideDescriptionLayout="two-columns"
          descriptionClassName="max-w-[35.0625rem]"
        />
      ) : null}

      <MobileSnapCarousel
        items={PARTNER_PRODUCTS}
        className={cn("md:hidden", showIntro ? "mt-8" : "mt-0")}
        getItemKey={(item) => `${item.title}-${item.imageUrl}`}
        renderItem={(item) => <PartnerProductCard item={item} />}
        slideWidth="100vw"
        slideInset="var(--layout-side-padding)"
        gap="0px"
        opts={{
          align: "center",
          loop: false,
          dragFree: false,
          skipSnaps: false,
          containScroll: false,
          slidesToScroll: 1,
        }}
        prevAriaLabel="Предыдущая карточка"
        nextAriaLabel="Следующая карточка"
      />

      <div className={cn("hidden gap-4 md:gap-5 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", showIntro ? "mt-10" : "mt-0")}>
        {PARTNER_PRODUCTS.map((item) => (
          <PartnerProductCard key={item.title} item={item} />
        ))}
      </div>
    </section>
  );
}
