"use client";

import { RequestDialog } from "@/features/request-dialog";
import { cn } from "@/shared/lib/cn";
import { buttonVariants } from "@/shared/ui/button";
import { ContentCard } from "@/shared/ui/content-card";
import { MobileSnapCarousel } from "@/shared/ui/mobile-snap-carousel";
import { PageSubheading } from "@/shared/ui/page-subheading";
import Link from "next/link";

type CatalogProductItem = {
  title: string;
  description: string;
  imageUrl: string;
  buttonLabel?: string;
  customLink?: string;
  ctaHref?: string;
};

function CatalogCard({ item }: { item: CatalogProductItem }) {
  const href = item.customLink || item.ctaHref;
  const buttonLabel = item.buttonLabel || (href ? "Перейти в каталог" : "Отправить заявку");
  const ctaNode = href ? (
    <Link href={href} className={cn(buttonVariants(), "w-full")} aria-label={`${buttonLabel}: ${item.title}`}>
      {buttonLabel}
    </Link>
  ) : (
    <RequestDialog source="catalog-product-card" context={item.title}>
      <button type="button" className={cn(buttonVariants(), "w-full")} aria-label={`${buttonLabel}: ${item.title}`}>
        {buttonLabel}
      </button>
    </RequestDialog>
  );

  return (
    <ContentCard
      title={item.title}
      excerpt={item.description}
      image={{ url: item.imageUrl, alt: item.title, width: 413, height: 291 }}
      imageContainerClassName="aspect-[413/291]"
      ctaNode={ctaNode}
    />
  );
}

export function CatalogProducts({ items, showHeading = false }: { items: CatalogProductItem[]; showHeading?: boolean }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="my-[35px] md:my-[45px]">
      {showHeading ? <PageSubheading title="НАШИ ТОВАРЫ" /> : null}

      <MobileSnapCarousel
        items={items}
        className={cn("md:hidden", showHeading ? "mt-8" : "mt-0")}
        getItemKey={(item) => `${item.title}-${item.imageUrl}`}
        renderItem={(item) => <CatalogCard item={item} />}
        prevAriaLabel="Предыдущая карточка"
        nextAriaLabel="Следующая карточка"
      />

      <div className={cn("hidden gap-4 md:gap-5 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4", showHeading ? "mt-10" : "mt-0")}>
        {items.map((item) => (
          <CatalogCard key={`${item.title}-${item.imageUrl}`} item={item} />
        ))}
      </div>
    </section>
  );
}
