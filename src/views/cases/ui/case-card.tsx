"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";

import { cn } from "@/shared/lib/cn";
import { AspectRatio } from "@/shared/ui/acpect-ratio";
import type { CaseItem } from "../model/cases-data";

type CaseCardProps = {
  item: CaseItem;
};

export function CaseCard({ item }: CaseCardProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    loop: true,
  });

  const sections = useMemo(
    () => [
      { heading: "Задача", text: item.task },
      { heading: "Решение", text: item.solution },
      { heading: "Результат", text: item.result },
    ],
    [item.result, item.solution, item.task]
  );

  const mobileThumbs = item.gallery.length > 4 ? item.gallery.slice(0, 4) : item.gallery;
  const imageRatio = toAspectRatio(item.desktopImageAspect);
  const toggleLabel = isExpanded ? "Скрыть" : "Читать больше";

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    const syncSelected = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    syncSelected();
    emblaApi.on("select", syncSelected);
    emblaApi.on("reInit", syncSelected);

    return () => {
      emblaApi.off("select", syncSelected);
      emblaApi.off("reInit", syncSelected);
    };
  }, [emblaApi]);

  const selectImage = (index: number) => {
    emblaApi?.scrollTo(index);
    setSelectedIndex(index);
  };

  return (
    <article className="md:rounded-[18px] md:bg-[var(--card-bg)] md:p-[27px]">
      <div className="grid gap-0 md:gap-6 xl:grid-cols-[minmax(0,1fr)_50.8%] xl:items-start">
        <div className="order-1 rounded-[18px] bg-[var(--card-bg)] px-[18px] pb-[18px] pt-[18px] md:rounded-none md:bg-transparent md:p-0">
          <div className="space-y-4 md:space-y-[11px]">
            <h2 className="font-heading text-[34px] leading-[0.95] uppercase text-[var(--heading)] md:text-[43.2px]">
              {item.company}
            </h2>
            <p className="text-[14.4px] leading-[1.3] text-[#404040]">{item.teaser}</p>
            <p className="text-[14.4px] leading-[1.3] text-[#404040]">{item.intro}</p>
          </div>

          <div className="mt-4 md:hidden">
            <button
              type="button"
              onClick={() => setIsExpanded((value) => !value)}
              className="mb-6 cursor-pointer border-b border-current pb-0.5 text-[15px] font-semibold leading-none text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)]"
            >
              {toggleLabel}
            </button>
          </div>

          <div className="hidden mt-[25px] h-px bg-[rgba(42,42,42,0.12)] md:block" />

          <div className="hidden space-y-[22px] pt-[24px] md:block">
            {sections.map((section) => (
              <CaseSection key={section.heading} {...section} />
            ))}
          </div>

          <div
            className={cn(
              "grid md:hidden transition-[grid-template-rows] duration-300 ease-out",
              isExpanded ? "mt-4 grid-rows-[1fr]" : "grid-rows-[0fr]"
            )}
          >
            <div className="overflow-hidden">
              <div className="mb-4 h-px bg-[rgba(42,42,42,0.12)]" />
              <div className="space-y-5">
                {sections.map((section) => (
                  <CaseSection key={section.heading} {...section} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          className="order-2 pb-[18px] md:w-auto md:px-0 md:pb-0"
          style={{ width: "calc(100vw - var(--layout-side-padding) * 2)" }}
        >
          <div
            className="cursor-grab overflow-hidden rounded-[18px] bg-white active:cursor-grabbing md:rounded-[9px]"
            ref={emblaRef}
          >
            <div className="flex">
              {item.gallery.map((image) => (
                <div key={`${item.id}-${image.alt}`} className="min-w-0 shrink-0 grow-0 basis-full">
                  <AspectRatio ratio={imageRatio} className="w-full overflow-hidden bg-white">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(max-width: 767px) 100vw, (max-width: 1280px) 100vw, 42vw"
                      className="object-cover"
                      style={{ objectPosition: image.objectPosition ?? "center" }}
                    />
                  </AspectRatio>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-[14px] hidden gap-[9px] md:flex">
            {item.gallery.map((image, index) => (
              <ThumbnailButton
                key={`${item.id}-thumb-${index}`}
                image={image}
                isActive={selectedIndex === index}
                onClick={() => selectImage(index)}
              />
            ))}
          </div>

          <div className="mt-[14px] grid grid-cols-4 gap-[9px] md:hidden">
            {mobileThumbs.map((image, index) => (
              <ThumbnailButton
                key={`${item.id}-mobile-thumb-${index}`}
                image={image}
                isActive={item.gallery.length > 4 && index === 3 ? selectedIndex >= index : selectedIndex === index}
                onClick={() => selectImage(index)}
                overlay={item.gallery.length > 4 && index === 3 ? `+${item.gallery.length - 3}` : null}
              />
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}

function CaseSection({ heading, text }: { heading: string; text: string }) {
  return (
    <section>
      <h3 className="font-heading text-[28.8px] leading-none uppercase text-[#404040]">
        {heading}
      </h3>
      <p className="mt-[9px] text-[14.4px] leading-[1.35] text-[#404040]">{text}</p>
    </section>
  );
}

function ThumbnailButton({
  image,
  isActive,
  onClick,
  overlay,
}: {
  image: CaseItem["gallery"][number];
  isActive: boolean;
  onClick: () => void;
  overlay?: string | null;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex-1 cursor-pointer overflow-hidden rounded-[9px] border-2 border-[var(--card-bg)] bg-white transition-colors",
        isActive && "border-[var(--accent)]"
      )}
      aria-pressed={isActive}
    >
      <div className="relative w-full" style={{ aspectRatio: "4 / 3" }}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="90px"
          className="object-cover"
          style={{ objectPosition: image.objectPosition ?? "center" }}
        />
      </div>
      {overlay ? (
        <span className="absolute inset-0 flex items-center justify-center bg-[rgba(42,42,42,0.68)] font-heading text-[22px] uppercase text-white">
          {overlay}
        </span>
      ) : null}
    </button>
  );
}

function toAspectRatio(value: `${number}/${number}`) {
  const [width, height] = value.split("/").map(Number);
  return width / height;
}
