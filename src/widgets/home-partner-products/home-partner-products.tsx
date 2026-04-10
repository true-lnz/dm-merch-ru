"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { PageSubheader } from "@/shared/ui/page-subheader";
import { Carousel, CarouselContent, CarouselItem } from "@/shared/ui/carousel";
import { buttonVariants } from "@/shared/ui/button";
import { cn } from "@/shared/lib/cn";

type HomeProductItem = {
  title: string;
  description: string;
  image: {
    src: string;
    alt: string;
  };
  href: string;
};

type HomePartnerProductsProps = {
  title: string;
  description: string;
  items: HomeProductItem[];
};

function ProductCard({ item }: { item: HomeProductItem }) {
  return (
    <article className="overflow-hidden rounded-[20px] bg-[var(--card-bg)] p-5 md:p-[20px]">
      <div className="relative aspect-square overflow-hidden rounded-[16px] bg-white">
        <Image
          src={item.image.src}
          alt={item.image.alt}
          fill
          sizes="(max-width: 1279px) 100vw, 22vw"
          className="object-cover"
        />
      </div>
      <h3 className="mt-5 font-heading text-[30px] leading-[0.95] tracking-[0.015em] text-[var(--heading)] uppercase md:text-[32px]">{item.title}</h3>
      <p className="mt-3 min-h-[2lh] text-[15px] leading-[1.35] tracking-[-0.03em] text-[var(--text-muted)] md:text-[17px]">{item.description}</p>
      <Link href={item.href} className={cn(buttonVariants(), "mt-6 h-[49px] rounded-[10px]")}>
        Узнать подробнее
      </Link>
    </article>
  );
}

export function HomePartnerProducts({
  title,
  description,
  items,
}: HomePartnerProductsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-14 md:py-20 xl:py-[110px]">
      <PageSubheader
        title={title}
        description={description}
        descriptionPlacement="bottom"
        descriptionClassName="max-w-[40rem]"
      />

      <div className="mt-8 xl:hidden">
        <Carousel
          opts={{ align: "start", loop: false }}
          setApi={(api) => {
            if (!api) {
              return;
            }
            api.on("select", () => {
              setActiveIndex(api.selectedScrollSnap());
            });
          }}
        >
          <CarouselContent className="-ml-0">
            {items.map((item) => (
              <CarouselItem key={item.title} className="pl-0">
                <ProductCard item={item} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="mt-5 flex justify-center gap-2">
          {items.map((item, index) => (
            <span
              key={item.title}
              className={cn("h-1.5 rounded-full bg-[var(--border)] transition-all", index === activeIndex ? "w-10 bg-[var(--accent)]" : "w-3")}
            />
          ))}
        </div>
      </div>

      <div className="mt-10 hidden gap-7 xl:grid xl:grid-cols-4">
        {items.map((item) => (
          <ProductCard key={item.title} item={item} />
        ))}
      </div>
    </section>
  );
}
