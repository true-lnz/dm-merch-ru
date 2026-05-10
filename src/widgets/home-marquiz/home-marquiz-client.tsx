"use client";

import type { HomeMarquizData } from "@/shared/lib/payload/home-marquiz";
import { PageSubheading } from "@/shared/ui/page-subheading";
import Image from "next/image";
import Script from "next/script";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    Marquiz?: {
      init: (options: HomeMarquizData["marquiz"]["init"]) => void;
      add: (
        payload: [
          type: "Inline",
          options: HomeMarquizData["marquiz"]["inline"] & {
            id: string;
          },
        ],
      ) => void;
    };
    __homeMarquizInitialized?: boolean;
    __homeMarquizInlineAdded?: boolean;
  }
}

function initializeMarquiz(data: HomeMarquizData) {
  if (typeof window === "undefined" || !window.Marquiz) {
    return;
  }

  if (!window.__homeMarquizInitialized) {
    window.Marquiz.init(data.marquiz.init);
    window.__homeMarquizInitialized = true;
  }

  if (!window.__homeMarquizInlineAdded) {
    window.Marquiz.add([
      "Inline",
      {
        id: data.marquiz.init.id,
        ...data.marquiz.inline,
      },
    ]);
    window.__homeMarquizInlineAdded = true;
  }
}

export function HomeMarquizClient({ data }: { data: HomeMarquizData }) {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (!scriptLoaded) {
      return;
    }

    initializeMarquiz(data);
  }, [data, scriptLoaded]);

  return (
    <section className="my-[35px] md:my-[45px]">
      <Script src={data.marquiz.scriptUrl} strategy="afterInteractive" onLoad={() => setScriptLoaded(true)} />

      <PageSubheading className="mb-8" title={data.title} />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[8.075fr_3.925fr] xl:grid-rows-1 xl:gap-5">
        <div className="overflow-hidden rounded-[18px] bg-[#ecebe7] md:rounded-[22.5px]">
          <div data-marquiz-id={data.marquiz.init.id} />
        </div>

        <div className="hidden rounded-[18px] bg-white xl:self-stretch md:rounded-[22.5px] xl:block">
          <div className="relative aspect-square overflow-hidden rounded-[18px] bg-white md:rounded-[22.5px] xl:h-full xl:aspect-auto">
            <Image
              src={data.coverImage.url}
              alt={data.coverImage.alt}
              fill
              sizes="(max-width: 1279px) 100vw, 60vw"
              className="object-cover image-hover-scale object-top"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
