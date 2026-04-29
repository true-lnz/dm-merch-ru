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
  const { scrollNext, canScrollNext } = useCarousel();

  return (
    <button
      type="button"
      onClick={scrollNext}
      disabled={!canScrollNext}
      aria-label="Следующая статья"
      className={cn(
        "absolute right-[max(12px,calc(var(--layout-side-padding)-10px))] top-1/2 z-20 inline-flex size-[52px] -translate-y-1/2 items-center justify-center rounded-full bg-white text-[var(--heading)] shadow-[0_10px_24px_rgba(42,42,42,0.12)] transition-opacity duration-200",
        canScrollNext ? "cursor-pointer opacity-100" : "cursor-default opacity-45",
      )}
    >
      <ChevronRightIcon className="size-5" strokeWidth={1.7} />
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
        <Carousel
          className="relative"
          opts={{
            align: "start",
            loop: false,
          }}
        >
          <CarouselContent className="-ml-0">
            {items.map((item) => (
              <CarouselItem key={item.id} className="basis-[88%] pl-0 sm:basis-[78%] md:basis-[52%] xl:basis-[38%] 2xl:basis-[32%]">
                <Link
                  href={item.href}
                  className={cn(
                    "group block h-full border border-[rgba(42,42,42,0.08)] px-4 py-4 transition-colors duration-200 hover:bg-white md:px-5 md:py-5",
                    item.variant === "all-articles" && "flex flex-col justify-between bg-white",
                  )}
                >
                  <div className="pb-4 pt-2">
                    <h3 className="font-heading whitespace-pre-line text-xl uppercase leading-[0.95] tracking-[0.015em] text-[var(--heading)] md:text-2xl xl:text-3xl">
                      {item.title}
                    </h3>
                  </div>
                  <div
                    className={cn(
                      "relative aspect-[1740/400] overflow-hidden rounded-[12px] border border-[rgba(42,42,42,0.08)] bg-[var(--surface)] md:rounded-[14px]",
                      item.variant === "all-articles" && "bg-[var(--card-bg)]",
                    )}
                  >
                    <Image
                      src={item.image.src}
                      alt={item.image.alt}
                      fill
                      sizes="(max-width: 767px) 88vw, (max-width: 1279px) 52vw, 38vw"
                      className="object-cover object-center"
                    />
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-[linear-gradient(270deg,var(--surface-header)_18%,rgba(236,235,230,0.84)_48%,rgba(236,235,230,0)_100%)] backdrop-blur-[8px] md:w-32"
            aria-hidden="true"
          />
          <CatalogProductsArticlesNextButton />
        </Carousel>
      </div>
    </section>
  );
}
