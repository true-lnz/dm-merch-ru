"use client";

import { cn } from "@/shared/lib/cn";
import { Carousel, CarouselContent, CarouselItem } from "@/shared/ui/carousel";
import { ContentCard } from "@/shared/ui/content-card";
import Image from "next/image";
import { useState } from "react";
import { PageSubheading } from "../../shared/ui/page-subheading";
import { DigestRequestDialog } from "./digest-request-dialog";
import {
	DIGEST_CARDS,
	DIGEST_CTA_LABEL,
	DIGEST_DESCRIPTION,
	DIGEST_TITLE,
	type HomeDigestCard,
	type HomeDigestSmallCard,
	type HomeDigestWideCard,
} from "./home-digest.data";

const DIGEST_ROWS = [
  ["partners", "events", "team"],
  ["souvenirs", "uniform", "workwear"],
] as const;

const digestCardsById = new Map(DIGEST_CARDS.map((card) => [card.id, card]));

function getDigestCard(cardId: string) {
  return digestCardsById.get(cardId) ?? null;
}

function renderTitleLines(title: string) {
  return title.split("\n").map((line) => (
    <span key={line} className="block">
      {line}
    </span>
  ));
}

function DigestSmallCard({ item }: { item: HomeDigestSmallCard }) {
  return (
    <ContentCard
      title={renderTitleLines(item.title)}
      excerpt={item.lead}
      image={{
        url: item.image.src,
        alt: item.image.alt,
        width: 412,
        height: 250,
        sizes: item.image.sizes,
        className: cn("object-contain object-center", item.image.imageClassName),
      }}
      renderCta={true}
    />
  );
}

function DigestWideCard({ item }: { item: HomeDigestWideCard }) {
  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-[20px] bg-[var(--accent)] md:min-h-[540px] xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="relative h-[320px] overflow-hidden bg-white md:h-[420px] xl:h-full">
        <Image
          src={item.image.src}
          alt={item.image.alt}
          fill
          sizes={item.image.sizes}
          className={cn("object-contain object-center", item.image.imageClassName)}
        />
      </div>

      <div className="relative flex flex-1 flex-col overflow-hidden px-5 pb-5 pt-6 text-white md:px-[30px] md:pb-[30px] md:pt-7 xl:px-[40px] xl:pb-[30px] xl:pt-[50px]">
        <div className="pointer-events-none absolute -bottom-[34%] -right-[15%] size-[75%] rounded-full border-[28px] border-white/12" />
        <div className="pointer-events-none absolute -bottom-[52%] -right-[2%] size-[86%] rounded-full border-[28px] border-white/10" />

        <div className="relative z-10 flex h-full flex-col">
          <h3 className="max-w-[14rem] font-heading text-[34px] leading-[0.94] tracking-[0.015em] uppercase md:text-[40px] xl:text-[48px]">
            {renderTitleLines(item.title)}
          </h3>
          <p className="mt-4 max-w-[22rem] text-[15px] leading-[1.3] tracking-[-0.04em] text-white/80 md:text-base">
            {item.lead}
          </p>
          <p className="mt-3 max-w-[22rem] text-[15px] leading-[1.3] tracking-[-0.04em] text-white/80 md:text-base">
            {item.details}
          </p>

          <div className="mt-auto pt-6">
            <DigestRequestDialog
              className="h-[52px] rounded-[8px] lg:w-full"
              label={DIGEST_CTA_LABEL}
              variant="light"
            />
          </div>
        </div>
      </div>
    </article>
  );
}

function DigestCard({ item }: { item: HomeDigestCard }) {
  return item.variant === "wide" ? <DigestWideCard item={item} /> : <DigestSmallCard item={item} />;
}

export function HomeDigest() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="my-[63px] rounded-t-[40px] px-0 pt-[52px] md:my-[72px] md:pt-16 xl:my-[90px] xl:pt-[76px]">
      <PageSubheading
        title={renderTitleLines(DIGEST_TITLE)}
        description={DIGEST_DESCRIPTION}
        descriptionPlacement="side"
        className=""
        titleClassName="text-[56px] leading-[0.97] md:text-[72px] xl:text-[96px] xl:leading-[0.97]"
        descriptionClassName="text-[18px] leading-[1.3] tracking-[-0.04em] text-[#404040] xl:pb-5"
      />

      <div className="mt-8 pb-[30px] md:hidden">
        <Carousel
          opts={{ align: "start", loop: false }}
          setApi={(api) => {
            if (!api) {
              return;
            }

            setActiveIndex(api.selectedScrollSnap());
            api.on("select", () => {
              setActiveIndex(api.selectedScrollSnap());
            });
          }}
        >
          <CarouselContent className="-ml-0">
            {DIGEST_CARDS.map((item) => (
              <CarouselItem key={item.id} className="basis-full pl-0">
                <DigestCard item={item} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="mt-5 flex justify-center gap-2">
          {DIGEST_CARDS.map((item, index) => (
            <span
              key={item.id}
              className={cn(
                "h-1.5 rounded-full bg-[var(--border)] transition-all",
                index === activeIndex ? "w-10 bg-[var(--accent)]" : "w-3",
              )}
            />
          ))}
        </div>
      </div>

      <div className="mt-10 hidden pb-[45px] md:flex md:flex-col md:gap-[30px] xl:hidden">
        {DIGEST_ROWS.map((row, rowIndex) => {
          const firstCard = getDigestCard(row[0]);
          const secondCard = getDigestCard(row[1]);
          const wideCard = getDigestCard(row[2]);

          return (
            <div key={rowIndex} className="flex flex-col gap-[30px]">
              <div className="flex gap-[30px]">
                {firstCard ? (
                  <div className="min-w-0 flex-1">
                    <DigestCard item={firstCard} />
                  </div>
                ) : null}
                {secondCard ? (
                  <div className="min-w-0 flex-1">
                    <DigestCard item={secondCard} />
                  </div>
                ) : null}
              </div>

              {wideCard ? <DigestCard item={wideCard} /> : null}
            </div>
          );
        })}
      </div>

      <div className="mt-[49px] hidden pb-[100px] xl:flex xl:flex-col xl:gap-[100px]">
        {DIGEST_ROWS.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={cn(
              "grid min-h-[540px] gap-[30px]",
              rowIndex === 0
                ? "grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,2fr)]"
                : "grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]",
            )}
          >
            {row.map((cardId) => {
              const card = getDigestCard(cardId);

              if (!card) {
                return null;
              }

              return <DigestCard key={card.id} item={card} />;
            })}
          </div>
        ))}
      </div>
    </section>
  );
}
