"use client";

import { cn } from "@/shared/lib/cn";
import { Carousel, CarouselContent, CarouselItem } from "@/shared/ui/carousel";
import type { CatalogProductsLandingArticle } from "@/widgets/catalog-products/model/types";
import Image from "next/image";
import Link from "next/link";

type CatalogProductsArticlesProps = {
  items: CatalogProductsLandingArticle[];
};

export function CatalogProductsArticles({ items }: CatalogProductsArticlesProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="mb-[35px] md:mb-[45px]">
      <div className="relative left-[calc(var(--layout-side-padding)*-1)] w-[calc(100%+var(--layout-side-padding)*2)] overflow-hidden bg-[var(--surface-header)] px-[var(--layout-side-padding)]">
        <Carousel
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
                  )}
                >
                  <div className="pb-4 pt-2">
                    <h3 className="font-heading whitespace-pre-line text-xl uppercase leading-[0.95] tracking-[0.015em] text-[var(--heading)] md:text-2xl xl:text-3xl">
                      {item.title}
                    </h3>
                  </div>
                  <div className="relative aspect-[1740/400] overflow-hidden rounded-[12px] border border-[rgba(42,42,42,0.08)] bg-[var(--surface)] md:rounded-[14px]">
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
        </Carousel>
      </div>
    </section>
  );
}
