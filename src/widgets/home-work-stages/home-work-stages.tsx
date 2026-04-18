"use client";

import { WORK_STAGES } from "@/shared/config/work-stages";
import { cn } from "@/shared/lib/cn";
import { isLightWorkStageCard } from "@/shared/lib/work-stage-tone";
import { WorkStageCard } from "@/shared/ui/work-stage-card";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { PageSubheading } from "../../shared/ui/page-subheading";

export function HomeWorkStages() {
  const [tapeShiftX, setTapeShiftX] = useState(0);
  const lastScrollYRef = useRef(0);
  const shiftXRef = useRef(0);

  useEffect(() => {
    const desktopMedia = window.matchMedia("(min-width: 1280px)");
    const reducedMotionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
    const MAX_SHIFT = 160;
    const SHIFT_FACTOR = 0.2;

    const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

    const setShift = (nextShift: number) => {
      shiftXRef.current = nextShift;
      setTapeShiftX(nextShift);
    };

    const handleScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollYRef.current;
      lastScrollYRef.current = currentY;

      if (!desktopMedia.matches || reducedMotionMedia.matches) {
        if (shiftXRef.current !== 0) {
          setShift(0);
        }
        return;
      }

      const nextShift = clamp(shiftXRef.current + delta * SHIFT_FACTOR, -MAX_SHIFT, MAX_SHIFT);
      if (nextShift !== shiftXRef.current) {
        setShift(nextShift);
      }
    };

    const handleMediaChange = () => {
      lastScrollYRef.current = window.scrollY;
      if (!desktopMedia.matches || reducedMotionMedia.matches) {
        setShift(0);
      }
    };

    lastScrollYRef.current = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });
    desktopMedia.addEventListener("change", handleMediaChange);
    reducedMotionMedia.addEventListener("change", handleMediaChange);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      desktopMedia.removeEventListener("change", handleMediaChange);
      reducedMotionMedia.removeEventListener("change", handleMediaChange);
    };
  }, []);

  return (
    <section className="my-[43px] md:my-[55px]">
      <div className="relative -mx-[var(--layout-side-padding)] sm:-mx-0  overflow-hidden rounded-none sm:rounded-[18px] md:rounded-[22.5px] bg-[var(--accent)] p-[27px] md:p-[50px] xl:p-[72px] text-white">
        <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-between opacity-20">
          <Image src="/logo-dm-minimized.svg" alt="" width={220} height={40} aria-hidden="true" />
          <Image src="/logo-dm-minimized.svg" alt="" width={220} height={40} aria-hidden="true" />
          <Image src="/logo-dm-minimized.svg" alt="" width={220} height={40} aria-hidden="true" className="hidden xl:block" />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-between opacity-20">
          <Image src="/logo-dm-minimized.svg" alt="" width={220} height={40} aria-hidden="true" />
          <Image src="/logo-dm-minimized.svg" alt="" width={220} height={40} aria-hidden="true" />
          <Image src="/logo-dm-minimized.svg" alt="" width={220} height={40} aria-hidden="true" className="hidden xl:block" />
        </div>
        <div className="pointer-events-none absolute bottom-0 -left-200 z-20 rotate-45" aria-hidden="true">
          <div style={{ transform: `translate3d(${tapeShiftX * 1.2}px, 0, 0)` }}>
            <Image src="/img_tape.svg" alt="" width={2465} height={111} />
          </div>
        </div>
        <div className="pointer-events-none absolute top-28 -right-190 z-0 rotate-[25deg]" aria-hidden="true">
          <div style={{ transform: `translate3d(${-tapeShiftX * 1.2}px, 0, 0)` }}>
            <Image src="/img_tape.svg" alt="" width={2465} height={111} />
          </div>
        </div>
        <div className="pointer-events-none absolute top-18 -right-230 z-0 rotate-[65deg]" aria-hidden="true">
          <div style={{ transform: `translate3d(${-tapeShiftX * 1.6}px, 0, 0)` }}>
            <Image src="/img_tape.svg" alt="" width={2465} height={111} />
          </div>
        </div>

        <div className="relative z-10">
          <PageSubheading
            title="Этапы работ"
            description="Прозрачный процесс - от идеи до готового мерча."
            descriptionPlacement="bottom"
            descriptionClassName="text-white"
            titleClassName="text-white"
          />

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:mt-[36px] xl:grid-cols-3 xl:grid-rows-2 xl:gap-6">
            {WORK_STAGES.map((stage, index) => {
              const isLightOnMobile = isLightWorkStageCard(index, 1);
              const isLightOnDesktop = isLightWorkStageCard(index, 2);
              const layoutClassName =
                index === 0
                  ? "xl:col-start-1 xl:row-start-1"
                  : index === 1
                    ? "xl:col-start-2 xl:row-start-1"
                    : index === 2
                      ? "xl:col-start-2 xl:row-start-2"
                      : "xl:col-start-3 xl:row-start-2";

              return (
                <WorkStageCard
                  key={stage.number}
                  stage={stage}
                  className={cn(
                    "rounded-[18px] p-[18px] md:rounded-[22.5px] md:p-[27px]",
                    layoutClassName,
                    isLightOnMobile ? "bg-[#F8F6F0] text-[var(--heading)]" : "bg-[rgba(248,246,240,0.2)] text-white",
                    isLightOnDesktop ? "md:bg-[#F8F6F0] md:text-[var(--heading)]" : "md:bg-[rgba(248,246,240,0.2)] md:text-white",
                  )}
                  numberClassName={cn(
                    "text-[32px] md:text-[40px]",
                    isLightOnMobile ? "text-[var(--accent)]" : "text-white",
                    isLightOnDesktop ? "md:text-[var(--accent)]" : "md:text-white",
                  )}
                  titleClassName="mt-5 text-[28px] leading-[0.95] md:text-4xl"
                  descriptionClassName={cn(
                    "mt-4 text-[15px] leading-[1.35] tracking-[-0.03em]",
                    isLightOnMobile ? "text-[var(--text-muted)]" : "text-white",
                    isLightOnDesktop ? "md:text-[var(--text-muted)]" : "md:text-white",
                  )}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
