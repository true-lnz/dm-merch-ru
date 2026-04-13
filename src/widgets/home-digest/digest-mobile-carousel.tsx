"use client";

import { cn } from "@/shared/lib/cn";
import { SliderControl } from "@/shared/ui/slider-control";
import { useEffect, useRef, useState } from "react";
import { DigestCard } from "./digest-card";
import type { HomeDigestCard } from "./home-digest.data";

const MOBILE_FADE_DURATION_MS = 140;
const MOBILE_SWIPE_THRESHOLD_PX = 36;

type DigestMobileCarouselProps = {
  cards: HomeDigestCard[];
  className?: string;
};

export function DigestMobileCarousel({ cards, className }: DigestMobileCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [carouselHeight, setCarouselHeight] = useState(0);
  const [isContentVisible, setIsContentVisible] = useState(true);
  const touchStartXRef = useRef<number | null>(null);
  const touchDeltaXRef = useRef(0);
  const transitionTimeoutRef = useRef<number | null>(null);
  const measureCardRefs = useRef<Array<HTMLDivElement | null>>([]);

  const activeCard = cards[activeIndex] ?? cards[0];

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current !== null) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || cards.length === 0) {
      return;
    }

    const measureHeights = () => {
      const nextHeight = measureCardRefs.current.reduce((maxHeight, cardNode) => {
        if (!cardNode) {
          return maxHeight;
        }

        return Math.max(maxHeight, cardNode.getBoundingClientRect().height);
      }, 0);

      setCarouselHeight((currentHeight) => (currentHeight === nextHeight ? currentHeight : nextHeight));
    };

    const frameId = window.requestAnimationFrame(measureHeights);
    const resizeObserver = new ResizeObserver(measureHeights);

    measureCardRefs.current.forEach((cardNode) => {
      if (cardNode) {
        resizeObserver.observe(cardNode);
      }
    });

    window.addEventListener("resize", measureHeights);

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      window.removeEventListener("resize", measureHeights);
    };
  }, [cards]);

  function commitCardChange(nextIndex: number) {
    if (!cards[nextIndex] || nextIndex === activeIndex) {
      return;
    }

    if (transitionTimeoutRef.current !== null) {
      window.clearTimeout(transitionTimeoutRef.current);
    }

    setIsContentVisible(false);

    transitionTimeoutRef.current = window.setTimeout(() => {
      setActiveIndex(nextIndex);
      setIsContentVisible(true);
      transitionTimeoutRef.current = null;
    }, MOBILE_FADE_DURATION_MS);
  }

  function handleTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    touchStartXRef.current = event.touches[0]?.clientX ?? null;
    touchDeltaXRef.current = 0;
  }

  function handleTouchMove(event: React.TouchEvent<HTMLDivElement>) {
    if (touchStartXRef.current === null) {
      return;
    }

    touchDeltaXRef.current = (event.touches[0]?.clientX ?? 0) - touchStartXRef.current;
  }

  function handleTouchEnd() {
    if (touchStartXRef.current === null) {
      return;
    }

    if (touchDeltaXRef.current <= -MOBILE_SWIPE_THRESHOLD_PX && activeIndex < cards.length - 1) {
      commitCardChange(activeIndex + 1);
    } else if (touchDeltaXRef.current >= MOBILE_SWIPE_THRESHOLD_PX && activeIndex > 0) {
      commitCardChange(activeIndex - 1);
    }

    touchStartXRef.current = null;
    touchDeltaXRef.current = 0;
  }

  if (!activeCard) {
    return null;
  }

  return (
    <div className={cn("relative flex flex-col", className)}>
      <div
        className="relative"
        style={carouselHeight > 0 ? { height: `${carouselHeight}px` } : undefined}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <DigestCard item={activeCard} layout="mobile" isContentVisible={isContentVisible} />
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 invisible">
        {cards.map((card, index) => (
          <div
            key={card.id}
            ref={(node) => {
              measureCardRefs.current[index] = node;
            }}
          >
            <DigestCard item={card} layout="mobile" />
          </div>
        ))}
      </div>

      <SliderControl
        className="mt-5 self-center"
        onPrevClick={() => commitCardChange(activeIndex - 1)}
        onNextClick={() => commitCardChange(activeIndex + 1)}
        prevDisabled={activeIndex === 0}
        nextDisabled={activeIndex === cards.length - 1}
        prevAriaLabel="Предыдущая карточка"
        nextAriaLabel="Следующая карточка"
      />
    </div>
  );
}
