"use client";

import { PageSubheading } from "@/shared/ui/page-subheading";
import Image from "next/image";
import Script from "next/script";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    Marquiz?: {
      init: (options: {
        host: string;
        region: string;
        id: string;
        autoOpen: boolean;
        autoOpenFreq: string;
        openOnExit: boolean;
        disableOnMobile: boolean;
      }) => void;
      add: (
        payload: [
          type: "Inline",
          options: {
            id: string;
            buttonText: string;
            bgColor: string;
            textColor: string;
            rounded: boolean;
            shadow: string;
            blicked: boolean;
            fixed: boolean;
            buttonOnMobile: boolean;
            disableOnMobile: boolean;
            fullWidth: boolean;
          },
        ],
      ) => void;
    };
    __homeMarquizInitialized?: boolean;
    __homeMarquizInlineAdded?: boolean;
  }
}

const MARQUIZ_ID = "69ef0bea8ae1ec001990bdb0";
const MARQUIZ_IMAGE = {
  src: "/home/img_lead_cta_cover2.webp",
  alt: "Коробка с брендированным мерчем",
} as const;

const MARQUIZ_INIT_OPTIONS = {
  host: "//quiz.marquiz.ru",
  region: "ru",
  id: MARQUIZ_ID,
  autoOpen: false,
  autoOpenFreq: "once",
  openOnExit: false,
  disableOnMobile: false,
} as const;

const MARQUIZ_INLINE_OPTIONS = {
  id: MARQUIZ_ID,
  buttonText: "«Старт»",
  bgColor: "#ecebe7",
  textColor: "#0144a3",
  rounded: true,
  shadow: "rgba(236, 235, 231, 0.5)",
  blicked: true,
  fixed: false,
  buttonOnMobile: true,
  disableOnMobile: false,
  fullWidth: true,
} as const;

function initializeMarquiz() {
  if (typeof window === "undefined" || !window.Marquiz) {
    return;
  }

  if (!window.__homeMarquizInitialized) {
    window.Marquiz.init(MARQUIZ_INIT_OPTIONS);
    window.__homeMarquizInitialized = true;
  }

  if (!window.__homeMarquizInlineAdded) {
    window.Marquiz.add(["Inline", MARQUIZ_INLINE_OPTIONS]);
    window.__homeMarquizInlineAdded = true;
  }
}

export function HomeMarquiz() {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (!scriptLoaded) {
      return;
    }

    initializeMarquiz();
  }, [scriptLoaded]);

  return (
    <section className="my-[35px] md:my-[45px]">
      <Script src="https://script.marquiz.ru/v2.js" strategy="afterInteractive" onLoad={() => setScriptLoaded(true)} />

      <PageSubheading className="mb-8" title="Ответьте на 5 простых вопросов и получите точный расчет стоимости вашего мерча" />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[8.075fr_3.925fr] xl:grid-rows-1 xl:gap-5">
        <div className="overflow-hidden rounded-[18px] bg-[#ecebe7] md:rounded-[22.5px]">
          <div data-marquiz-id={MARQUIZ_ID} />
        </div>

        <div className="hidden rounded-[18px] bg-white xl:self-stretch md:rounded-[22.5px] xl:block">
          <div className="relative aspect-square overflow-hidden rounded-[18px] bg-white md:rounded-[22.5px] xl:h-full xl:aspect-auto">
            <Image
              src={MARQUIZ_IMAGE.src}
              alt={MARQUIZ_IMAGE.alt}
              fill
              sizes="(max-width: 1279px) 100vw, 34vw"
              className="object-cover image-hover-scale object-top"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
