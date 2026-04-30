"use client";

import { cn } from "@/shared/lib/cn";
import { Carousel, CarouselContent, CarouselItem, useCarousel } from "@/shared/ui/carousel";
import type { CatalogProductsLandingArticle } from "@/widgets/catalog-products/model/types";
import { ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type CatalogProductsArticlesProps = {
  items: CatalogProductsLandingArticle[];
};

function CatalogProductsArticlesNextButton() {
  const { api, scrollNext, canScrollNext } = useCarousel();

  const handleClick = () => {
    if (canScrollNext) {
      scrollNext();
      return;
    }

    api?.scrollTo(0);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!api}
      aria-label="Следующая статья"
      className={cn(
        "absolute right-4 top-1/2 z-20 inline-flex size-[44px] -translate-y-1/2 items-center justify-center rounded-[12px] border-[9px] border-white bg-white text-[var(--heading)] shadow-[0_10px_24px_rgba(42,42,42,0.12)] transition-opacity duration-200 md:right-5",
        api ? "cursor-pointer opacity-70 hover:opacity-100" : "cursor-default opacity-45",
      )}
    >
      <ChevronRightIcon className="size-4" strokeWidth={1.7} />
    </button>
  );
}

export function CatalogProductsArticles({ items }: CatalogProductsArticlesProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="mb-[35px] md:mb-[45px]">
      <div className="relative left-[calc(var(--layout-side-padding)*-1)] w-[calc(100%+var(--layout-side-padding)*2)] overflow-hidden bg-[var(--surface-header)] px-[var(--layout-side-padding)]">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-[var(--layout-side-padding)] bg-[rgba(236,235,230,0.9)] opacity-100 backdrop-blur-[8px] md:block"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-[var(--layout-side-padding)] bg-[rgba(236,235,230,0.9)] opacity-100 backdrop-blur-[8px] md:block"
          aria-hidden="true"
        />
        <Carousel
          className="relative -mx-[var(--layout-side-padding)]"
          opts={{
            align: "start",
            containScroll: "trimSnaps",
            loop: false,
          }}
        >
          <CarouselContent className="-ml-0 px-[var(--layout-side-padding)]">
            {items.map((item) => (
              <CarouselItem key={item.id} className="basis-[88%] pl-0 sm:basis-[78%] md:basis-[52%] xl:basis-[25%] 2xl:basis-[25%]">
                <Link
                  href={item.href}
                  className={cn(
                    "group flex flex-col h-full border-l border-[rgba(42,42,42,0.08)] px-4 py-3 transition-colors duration-200 hover:bg-white md:px-5 md:py-4",
                    item.variant === "all-articles" && "flex flex-col justify-between bg-[var(--accent)] hover:bg-[var(--accent-hover)] ",
                  )}
                >
                  <div className="pb-3 pt-1">
                    <h3
                      className={cn(
                        "font-heading md:whitespace-pre-line text-xl md:2xl uppercase leading-[0.95] tracking-[0.015em] text-[var(--heading)]",
                        item.variant === "all-articles" && "text-white",
                      )}
                    >
                      {item.title}
                    </h3>
                  </div>
                  {item.variant === "all-articles" ? null : (
                    <div className="relative aspect-[1740/340] mt-auto overflow-hidden rounded-[12px] border border-[rgba(42,42,42,0.08)] bg-[var(--surface)] md:rounded-[14px]">
                      <Image
                        src={item.image.src}
                        alt={item.image.alt}
                        fill
                        sizes="(max-width: 767px) 88vw, (max-width: 1279px) 52vw, 25vw"
                        className="object-cover object-center"
                      />
                    </div>
                  )}
                </Link>
              </CarouselItem>
            ))}
            <div className="shrink-0 grow-0 basis-[var(--layout-side-padding)]" aria-hidden="true" />
          </CarouselContent>
          <CatalogProductsArticlesNextButton />
        </Carousel>
      </div>
    </section>
  );
}
