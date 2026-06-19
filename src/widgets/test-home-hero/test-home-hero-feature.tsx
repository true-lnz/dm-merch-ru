"use client";

import { useEffect, useRef, useState } from "react";

const HERO_FEATURES = [
  {
    value: "-25%",
    text: "к рынку за счет собственного производства и прямой логистики из Турции",
  },
  {
    value: "14 дней",
    text: "от идеи и дизайна до готового мерча у вас в офисе",
  },
  {
    value: "по всей России",
    text: "отправляем образцы: покажем материалы, посадку и качество",
  },
] as const;

const FEATURE_CHANGE_INTERVAL_MS = 5000;
const FEATURE_FADE_DURATION_MS = 260;

export function TestHomeHeroFeature() {
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const fadeTimeoutId = useRef<number | null>(null);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setIsVisible(false);

      fadeTimeoutId.current = window.setTimeout(() => {
        setActiveFeatureIndex((currentIndex) => (currentIndex + 1) % HERO_FEATURES.length);
        setIsVisible(true);
      }, FEATURE_FADE_DURATION_MS);
    }, FEATURE_CHANGE_INTERVAL_MS);

    return () => {
      window.clearInterval(intervalId);

      if (fadeTimeoutId.current !== null) {
        window.clearTimeout(fadeTimeoutId.current);
      }
    };
  }, []);

  const activeFeature = HERO_FEATURES[activeFeatureIndex];

  return (
    <div
      className={`w-full max-w-[240px] rounded-[18px] bg-white p-5 mb-[72px] text-left shadow-[0_18px_60px_rgba(0,0,0,0.16)] transition duration-300 ease-out ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
      aria-live="polite"
    >
      <div className="flex flex-col gap-3">
        <span className="font-heading text-[32px] leading-none tracking-normal text-[var(--accent)] uppercase">{activeFeature.value}</span>
        <p className="text-sm leading-[1.3] tracking-[-0.03em] text-[var(--heading)]">{activeFeature.text}</p>
      </div>
    </div>
  );
}
