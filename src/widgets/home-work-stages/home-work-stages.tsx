"use client";

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
    <section className="my-[63px] md:my-[72px] xl:my-[90px]">
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
          <div style={{ transform: `translate3d(${tapeShiftX}px, 0, 0)` }}>
            <Image src="/img_tape.svg" alt="" width={2465} height={111} />
          </div>
        </div>
        <div className="pointer-events-none absolute top-20 -right-160 z-0 rotate-[25deg]" aria-hidden="true">
          <div style={{ transform: `translate3d(${-tapeShiftX * 0.6}px, 0, 0)` }}>
            <Image src="/img_tape.svg" alt="" width={2465} height={111} />
          </div>
        </div>
        <div className="pointer-events-none absolute -top-10 -right-180 z-0 rotate-[65deg]" aria-hidden="true">
          <div style={{ transform: `translate3d(${-tapeShiftX * 0.8}px, 0, 0)` }}>
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

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:mt-[82px] xl:grid-cols-3 xl:grid-rows-2 xl:gap-6">
            <article className="rounded-[18px] md:rounded-[22.5px] bg-[rgba(248,246,240,0.2)] p-[18px] text-white md:p-[27px] xl:col-start-1 xl:row-start-1">
              <p className="font-heading text-[32px] leading-none uppercase text-white md:text-[40px]">01</p>
              <h3 className="mt-5 font-heading text-[28px] leading-[0.95] uppercase md:text-[34px]">Заявка и бриф 1 день</h3>
              <p className="mt-4 text-[15px] leading-[1.35] tracking-[-0.03em] text-white">
                Перед запуском тиража вы видите и трогаете реальный продукт: ткань, посадку, нанесение, детали. Отправляем образцы в любой город РФ, чтобы
                решение было осознанным, а не «по картинке».
              </p>
            </article>

            <article className="rounded-[18px] md:rounded-[22.5px] bg-[#F8F6F0] p-[18px] text-[var(--heading)] md:p-[27px] xl:col-start-2 xl:row-start-1">
              <p className="font-heading text-[32px] leading-none uppercase text-[var(--accent)] md:text-[40px]">02</p>
              <h3 className="mt-5 font-heading text-[28px] leading-[0.95] uppercase md:text-[34px]">Дизайн-макет и согласование – 3-5 дней</h3>
              <p className="mt-4 text-[15px] leading-[1.35] tracking-[-0.03em] text-[var(--text-muted)]">
                Разрабатываем 3 дизайн-концепций под ваш запрос. Подбираем ткани, фасоны и способы нанесения. Вносим все  правки бесплатно и при необходимости
                отправляем образцы, чтобы вы были уверены в результате до запуска в производство.
              </p>
            </article>

            <article className="rounded-[18px] md:rounded-[22.5px] bg-[rgba(248,246,240,0.2)] p-[18px] text-white md:p-[27px] xl:col-start-2 xl:row-start-2">
              <p className="font-heading text-[32px] leading-none uppercase text-white md:text-[40px]">03</p>
              <h3 className="mt-5 font-heading text-[28px] leading-[0.95] uppercase md:text-[34px]">Производство 10-14 дней</h3>
              <p className="mt-4 text-[15px] leading-[1.35] tracking-[-0.03em] text-white">
                После согласования концепций и утверждения позиций производство изделий мы запускаем заказ в работу. Контролируем каждый этап: раскрой, пошив,
                нанесение, финальную сборку.
              </p>
            </article>

            <article className="rounded-[18px] md:rounded-[22.5px] bg-[#F8F6F0] p-[18px] text-[var(--heading)] md:p-[27px] xl:col-start-3 xl:row-start-2">
              <p className="font-heading text-[32px] leading-none uppercase text-[var(--accent)] md:text-[40px]">04</p>
              <h3 className="mt-5 font-heading text-[28px] leading-[0.95] uppercase md:text-[34px]">доставка 2-4 дня</h3>
              <p className="mt-4 text-[15px] leading-[1.35] tracking-[-0.03em] text-[var(--text-muted)]">
                Перед отправкой проводим финальную проверку качества и упаковку. Доставляем мерч в согласованные сроки в любой город России. При необходимости
                организуем частный трансфер для срочных проектов.
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
