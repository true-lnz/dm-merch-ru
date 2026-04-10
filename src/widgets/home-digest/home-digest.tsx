"use client";

import Image from "next/image";
import { useState } from "react";
import { RequestDialog } from "@/features/request-dialog";
import { Carousel, CarouselContent, CarouselItem } from "@/shared/ui/carousel";
import { PageSubheader } from "@/shared/ui/page-subheader";
import { cn } from "@/shared/lib/cn";

type HomeDigestItem = {
  title: string;
  description: string;
  image: {
    src: string;
    alt: string;
  };
  accent?: boolean;
};

type HomeDigestProps = {
  title: string;
  description: string;
  items: HomeDigestItem[];
};

function DigestCard({ item }: { item: HomeDigestItem }) {
  return (
    <article
      className={cn(
        "overflow-hidden rounded-[20px] bg-[var(--card-bg)]",
        item.accent && "lg:grid lg:grid-cols-[minmax(280px,0.95fr)_minmax(0,1fr)]",
      )}
    >
      <div className={cn("relative bg-white", item.accent ? "aspect-[413/540]" : "aspect-[412/250]")}>
        <Image
          src={item.image.src}
          alt={item.image.alt}
          fill
          sizes="(max-width: 1023px) 100vw, (max-width: 1279px) 50vw, 30vw"
          className="object-cover"
        />
      </div>
      <div className="flex h-full flex-col px-5 py-5 md:px-[30px] md:py-7">
        <h3 className="font-heading text-[32px] leading-[0.95] tracking-[0.015em] text-[var(--heading)] uppercase md:text-[40px]">
          {item.title}
        </h3>
        <p className="mt-3 text-[15px] leading-[1.35] tracking-[-0.03em] text-[var(--text-muted)] md:text-[18px]">
          {item.description}
        </p>
        <div className="mt-auto pt-6">
          <RequestDialog
            className="lg:w-full"
            label="Отправить заявку"
            showCaption={false}
          />
        </div>
      </div>
    </article>
  );
}

export function HomeDigest({
  title,
  description,
  items,
}: HomeDigestProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-14 md:py-20 xl:py-[110px]">
      <PageSubheader
        title={title}
        description={description}
        descriptionPlacement="side"
        descriptionClassName="xl:max-w-[718px]"
      />

      <div className="mt-8 md:mt-10 xl:hidden">
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
              <CarouselItem key={item.title} className="basis-full pl-0">
                <DigestCard item={item} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="mt-5 flex justify-center gap-2">
          {items.map((item, index) => (
            <span
              key={item.title}
              className={cn(
                "h-1.5 rounded-full bg-[var(--border)] transition-all",
                index === activeIndex ? "w-10 bg-[var(--accent)]" : "w-3",
              )}
            />
          ))}
        </div>
      </div>

      <div className="mt-10 hidden gap-7 xl:grid xl:grid-cols-4">
        <div className="contents">
          {items.slice(0, 3).map((item) => (
            <DigestCard key={item.title} item={item} />
          ))}
        </div>
        <div className="contents">
          {items.slice(3).map((item) => (
            <DigestCard key={item.title} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
