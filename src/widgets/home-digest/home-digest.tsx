"use client";

import { cn } from "@/shared/lib/cn";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { PageSubheading } from "../../shared/ui/page-subheading";
import { DigestRequestDialog } from "./digest-request-dialog";
import {
	DIGEST_CARDS,
	DIGEST_CTA_LABEL,
	DIGEST_DESCRIPTION,
	DIGEST_TITLE,
	type HomeDigestCard,
	type HomeDigestDefaultCard,
	type HomeDigestWildCard,
} from "./home-digest.data";

const MOBILE_DIGEST_ORDER = ["team", "souvenirs", "partners", "events", "uniform", "workwear"] as const;

const digestCardsById = new Map(DIGEST_CARDS.map((card) => [card.id, card]));

function getDigestCard(cardId: string) {
  return digestCardsById.get(cardId) ?? null;
}

const MOBILE_DIGEST_CARDS = MOBILE_DIGEST_ORDER
  .map((cardId) => getDigestCard(cardId))
  .filter((card): card is HomeDigestCard => card !== null);

function renderTitleLines(title: string) {
  return title.split("\n").map((line) => (
    <span key={line} className="block">
      {line}
    </span>
  ));
}

function DigestDefaultCard({ item }: { item: HomeDigestDefaultCard }) {
  return (
    <article className="flex h-full min-h-[447px] flex-col overflow-hidden rounded-[20px] bg-[var(--card-bg)] md:min-h-[540px]">
      <div className="relative h-[228px] overflow-hidden bg-white md:h-[250px]">
        <Image
          src={item.image.src}
          alt={item.image.alt}
          fill
          sizes={item.image.sizes}
          className={cn("object-contain object-center", item.image.imageClassName)}
        />
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-[18px] md:px-[30px] md:pb-[30px] md:pt-[30px]">
        <h3 className="font-heading text-[32px] leading-[0.94] tracking-[0.015em] text-[var(--heading)] uppercase md:text-[48px]">
          {renderTitleLines(item.title)}
        </h3>
        <p className="mt-[10px] max-w-[19rem] text-[14px] leading-[1.3] tracking-[-0.04em] text-[#404040] md:mt-3 md:max-w-[17.5rem] md:text-[16px]">
          {item.description}
        </p>

        <div className="mt-auto pt-[22px] md:pt-6">
          <DigestRequestDialog className="h-[48px] rounded-[8px] md:h-[52px]" label={DIGEST_CTA_LABEL} />
        </div>
      </div>
    </article>
  );
}

function DigestWildCard({ item, mobile = false }: { item: HomeDigestWildCard; mobile?: boolean }) {
  if (mobile) {
    return (
      <article
        className="relative flex min-h-[447px] flex-col overflow-hidden rounded-[20px]"
        style={{
          backgroundImage: `url("${item.backgroundImageSrc}")`,
          backgroundPosition: "right bottom",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <div className="relative h-[228px] overflow-hidden bg-white">
          <Image
            src={item.image.src}
            alt={item.image.alt}
            fill
            sizes={item.image.sizes}
            className={cn("object-contain object-center", item.image.imageClassName)}
          />
        </div>

        <div className="relative z-10 flex flex-1 flex-col px-5 pb-5 pt-[18px] bg-[var(--accent)] text-white">
          <div className="flex-1">
            <h3 className="font-heading text-[32px] leading-[0.94] tracking-[0.015em] uppercase">
              {renderTitleLines(item.title)}
            </h3>
            <p className="mt-[10px] max-w-[19rem] text-[14px] leading-[1.3] tracking-[-0.04em] text-white/82">
              {item.mobileDescription}
            </p>
          </div>

          <div className="pt-[22px]">
            <DigestRequestDialog
              className="h-[48px] rounded-[8px] text-[16px] transition-colors duration-200"
              label={DIGEST_CTA_LABEL}
              variant="light"
            />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="relative flex min-h-[500px] overflow-hidden rounded-[20px] xl:min-h-[540px]">
      <div className="relative w-[calc(50%-15px)] shrink-0 overflow-hidden bg-white">
        <Image
          src={item.image.src}
          alt={item.image.alt}
          fill
          sizes={item.image.sizes}
          className={cn("object-contain object-center", item.image.imageClassName)}
        />
      </div>

      <div
        className="relative bg-[var(--accent)] flex min-w-0 flex-[0_0_calc(50%+15px)] flex-col overflow-hidden px-7 pb-7 pt-8 text-white md:px-10 md:pb-[30px] md:pt-[34px] xl:px-[40px] xl:pt-[50px]"
        style={{
          backgroundImage: `url("${item.backgroundImageSrc}")`,
          backgroundPosition: "right bottom",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        <div className="relative z-10 flex h-full flex-col">
          <h3 className="font-heading text-[40px] leading-[0.94] tracking-[0.015em] uppercase md:text-[44px] xl:text-[48px]">
            {renderTitleLines(item.title)}
          </h3>
          <p className="mt-4 text-[15px] leading-[1.3] tracking-[-0.04em] text-white/80 md:text-[16px]">
            {item.description}
          </p>
          <p className="mt-3 text-[15px] leading-[1.3] tracking-[-0.04em] text-white/80 md:text-[16px]">
            {item.details}
          </p>

          <div className="mt-auto pt-6">
            <DigestRequestDialog
              className="h-[52px] rounded-[8px] w-full"
              label={DIGEST_CTA_LABEL}
              variant="light"
            />
          </div>
        </div>
      </div>
    </article>
  );
}

function DigestCard({ item, mobile = false }: { item: HomeDigestCard; mobile?: boolean }) {
  return item.variant === "wild" ? (
    <DigestWildCard item={item} mobile={mobile} />
  ) : (
    <DigestDefaultCard item={item} />
  );
}

export function HomeDigest() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobileContentVisible, setIsMobileContentVisible] = useState(true);
  const touchStartXRef = useRef<number | null>(null);
  const touchDeltaXRef = useRef(0);

  const activeMobileCard = MOBILE_DIGEST_CARDS[activeIndex] ?? MOBILE_DIGEST_CARDS[0];

  function updateMobileCard(nextIndex: number) {
    if (nextIndex === activeIndex || !MOBILE_DIGEST_CARDS[nextIndex]) {
      return;
    }

    setIsMobileContentVisible(false);
    window.setTimeout(() => {
      setActiveIndex(nextIndex);
      setIsMobileContentVisible(true);
    }, 140);
  }

  function handleMobileTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    touchStartXRef.current = event.touches[0]?.clientX ?? null;
    touchDeltaXRef.current = 0;
  }

  function handleMobileTouchMove(event: React.TouchEvent<HTMLDivElement>) {
    if (touchStartXRef.current === null) {
      return;
    }

    touchDeltaXRef.current = (event.touches[0]?.clientX ?? 0) - touchStartXRef.current;
  }

  function handleMobileTouchEnd() {
    if (touchStartXRef.current === null) {
      return;
    }

    if (touchDeltaXRef.current <= -36 && activeIndex < MOBILE_DIGEST_CARDS.length - 1) {
      updateMobileCard(activeIndex + 1);
    } else if (touchDeltaXRef.current >= 36 && activeIndex > 0) {
      updateMobileCard(activeIndex - 1);
    }

    touchStartXRef.current = null;
    touchDeltaXRef.current = 0;
  }

  return (
    <section className="my-[63px] rounded-t-[40px] px-0 pt-[52px] md:my-[72px] md:pt-16 xl:my-[90px] xl:pt-[76px]">
      <PageSubheading
        title={renderTitleLines(DIGEST_TITLE)}
        description={DIGEST_DESCRIPTION}
        descriptionPlacement="side"
        titleClassName="text-[56px] leading-[0.97] md:text-[72px] xl:text-[96px] xl:leading-[0.97]"
        descriptionClassName="max-w-[45rem] text-[18px] leading-[1.3] tracking-[-0.04em] text-[#404040] xl:max-w-[44.875rem] xl:pb-5"
      />

      <div className="mt-8 pb-[30px] md:hidden">
        {activeMobileCard ? (
          <article
            className={cn(
              "relative flex min-h-[447px] flex-col overflow-hidden rounded-[20px]",
              activeMobileCard.variant === "wild" ? "text-white" : "bg-[var(--card-bg)] text-[var(--heading)]",
            )}
            style={
              activeMobileCard.variant === "wild"
                ? {
                    backgroundImage: `url("${activeMobileCard.backgroundImageSrc}")`,
                    backgroundPosition: "right bottom",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                  }
                : undefined
            }
            onTouchStart={handleMobileTouchStart}
            onTouchMove={handleMobileTouchMove}
            onTouchEnd={handleMobileTouchEnd}
          >
            <div
              className={cn(
                "relative h-[228px] overflow-hidden",
                activeMobileCard.variant === "wild" ? "bg-white" : "bg-white",
                "transition-opacity duration-200 ease-out",
                isMobileContentVisible ? "opacity-100" : "opacity-0",
              )}
            >
              <Image
                src={activeMobileCard.image.src}
                alt={activeMobileCard.image.alt}
                fill
                sizes={activeMobileCard.image.sizes}
                className={cn("object-contain object-center", activeMobileCard.image.imageClassName)}
              />
            </div>

            <div className={cn(
							"relative z-10 flex flex-1 flex-col px-5 pb-5 pt-[18px]", activeMobileCard.variant === "wild" ? "bg-[var(--accent)]" : "bg-[var(--card-bg)]" )}>
              <div
                className={cn(
                  "flex-1 transition-opacity duration-200 ease-out",
                  isMobileContentVisible ? "opacity-100" : "opacity-0",
                )}
              >
                <h3
                  className={cn(
                    "font-heading text-[32px] leading-[0.94] tracking-[0.015em] uppercase",
                    activeMobileCard.variant === "wild" ? "text-white" : "text-[var(--heading)]",
                  )}
                >
                  {renderTitleLines(activeMobileCard.title)}
                </h3>
                <p
                  className={cn(
                    "mt-[10px] max-w-[19rem] text-[14px] leading-[1.3] tracking-[-0.04em]",
                    activeMobileCard.variant === "wild" ? "text-white/82" : "text-[#404040]",
                  )}
                >
                  {activeMobileCard.variant === "wild"
                    ? activeMobileCard.mobileDescription
                    : activeMobileCard.description}
                </p>
              </div>

              <div className="pt-[22px]">
                <DigestRequestDialog
                  className="h-[48px] rounded-[8px] text-[16px] transition-colors duration-200"
                  label={DIGEST_CTA_LABEL}
                  variant={activeMobileCard.variant === "wild" ? "light" : "accent"}
                />
              </div>
            </div>
          </article>
        ) : null}
        <div className="mt-5 flex justify-center gap-[18px]">
          <button
            type="button"
            aria-label="Предыдущая карточка"
            onClick={() => updateMobileCard(activeIndex - 1)}
            disabled={activeIndex === 0}
            className={cn(
              "inline-flex size-[58.8px] items-center justify-center rounded-[8px] bg-[#ecebe6] text-[#2a2a2a] transition-colors",
              activeIndex === 0 ? "opacity-45" : "hover:bg-[#e3e1db]",
            )}
          >
            <ChevronLeftIcon className="size-[24px]" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            aria-label="Следующая карточка"
            onClick={() => updateMobileCard(activeIndex + 1)}
            disabled={activeIndex === MOBILE_DIGEST_CARDS.length - 1}
            className={cn(
              "inline-flex size-[58.8px] items-center justify-center rounded-[8px] bg-[#ecebe6] text-[#2a2a2a] transition-colors",
              activeIndex === MOBILE_DIGEST_CARDS.length - 1 ? "opacity-45" : "hover:bg-[#e3e1db]",
            )}
          >
            <ChevronRightIcon className="size-[24px]" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className="mt-10 hidden pb-[45px] md:block xl:hidden">
        <div
          className="grid min-h-[2250px] gap-[30px]"
          style={{
            gridTemplateColumns: "repeat(6, minmax(0, 1fr))",
            gridTemplateAreas: `
              "a a a b b b"
              "c c c c c c"
              "d d d d d d"
              "e e e f f f"
            `,
          }}
        >
          {[
            { area: "a", cardId: "partners" },
            { area: "b", cardId: "events" },
            { area: "c", cardId: "team" },
            { area: "d", cardId: "souvenirs" },
            { area: "e", cardId: "uniform" },
            { area: "f", cardId: "workwear" },
          ].map(({ area, cardId }) => {
            const card = getDigestCard(cardId);

            if (!card) {
              return null;
            }

            return (
              <div key={card.id} style={{ gridArea: area }}>
                <DigestCard item={card} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-[49px] hidden pb-[100px] xl:flex xl:flex-col xl:gap-[100px]">
        <div
          className="grid min-h-[1110px] gap-[30px]"
          style={{
            gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
            gridTemplateAreas: `
              "a a a b b b c c c c c c"
              "d d d d d d e e e f f f"
            `,
          }}
        >
          {[
            { area: "a", cardId: "partners" },
            { area: "b", cardId: "events" },
            { area: "c", cardId: "team" },
            { area: "d", cardId: "souvenirs" },
            { area: "e", cardId: "uniform" },
            { area: "f", cardId: "workwear" },
          ].map(({ area, cardId }) => {
            const card = getDigestCard(cardId);

            if (!card) {
              return null;
            }

            return (
              <div key={card.id} style={{ gridArea: area }}>
                <DigestCard item={card} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
