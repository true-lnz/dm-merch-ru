"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckIcon } from "lucide-react";
import { toast } from "sonner";
import { RequestCta } from "@/features/request-cta";
import { cn } from "@/shared/lib/cn";
import { useWishlist } from "@/shared/lib/wishlist";
import { PageBreadcrumb } from "@/shared/ui/breadcrumb";
import { buttonVariants } from "@/shared/ui/button";
import { SliderControl } from "@/shared/ui/slider-control";
import type { PartnerCatalogProductDetail } from "../model/partner-catalog-data";

const rubFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 2,
});

function formatRubPrice(value: number) {
  return rubFormatter.format(value);
}

type PartnerCatalogProductPageProps = {
  detail: PartnerCatalogProductDetail;
  listingHref: string;
};

function useOutsideClick(ref: RefObject<HTMLElement | null>, onOutside: () => void, enabled: boolean) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    function handleClick(event: MouseEvent) {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }

      onOutside();
    }

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, [enabled, onOutside, ref]);
}

export function PartnerCatalogProductPage({ detail, listingHref }: PartnerCatalogProductPageProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const { isInWishlist, addItem, removeItem } = useWishlist();
  const [isWishlistPopoverOpen, setIsWishlistPopoverOpen] = useState(false);
  const [quantity, setQuantity] = useState("50");
  const wishlistPopoverRef = useRef<HTMLDivElement | null>(null);
  const hasMultipleImages = detail.imageUrls.length > 1;
  const addedToWishlist = isInWishlist(detail.article);

  useOutsideClick(wishlistPopoverRef, () => setIsWishlistPopoverOpen(false), isWishlistPopoverOpen);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsWishlistPopoverOpen(false);
      }
    }

    if (!isWishlistPopoverOpen) {
      return;
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isWishlistPopoverOpen]);

  function showPreviousImage() {
    setActiveImageIndex((currentIndex) => (currentIndex === 0 ? detail.imageUrls.length - 1 : currentIndex - 1));
  }

  function showNextImage() {
    setActiveImageIndex((currentIndex) => (currentIndex === detail.imageUrls.length - 1 ? 0 : currentIndex + 1));
  }

  function handleWishlistClick() {
    if (addedToWishlist) {
      removeItem(detail.article);
      toast.info("Убрано из вишлиста");
      return;
    }

    setIsWishlistPopoverOpen((open) => !open);
  }

  function handleWishlistConfirm() {
    const safeQuantity = Math.max(1, Number.parseInt(quantity.replace(/[^\d]/g, ""), 10) || 1);

    addItem(
      {
        id: detail.article,
        articleNumber: detail.article,
        title: detail.title,
        imageUrl: detail.imageUrls[0] ?? "",
        unitPriceRub: detail.priceRub,
      },
      safeQuantity,
    );
    toast.success("Товар добавлен в вишлист");
    setIsWishlistPopoverOpen(false);
  }

  return (
    <>
      <section className="mb-[43px] md:mb-[55px]">
        <PageBreadcrumb
          className="mb-4 mt-8 md:mb-5 md:mt-12 xl:mb-[42px] xl:mt-[39px]"
          items={[
            { label: "Главная", href: "/" },
            { label: "Каталог продукции", href: "/partner-catalog" },
            { label: detail.breadcrumb.rootName, href: listingHref },
          ]}
          currentLabel={detail.breadcrumb.childName}
        />

        <div className="grid gap-8 xl:grid-cols-[minmax(0,0.98fr)_minmax(0,0.88fr)] xl:gap-[62px]">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-6 md:items-stretch">
              {hasMultipleImages ? (
                <div className="order-2 md:order-1 md:col-span-1">
                  <div className="relative md:h-[min(78vh,720px)]">
                    <div className="flex gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:h-[min(78vh,720px)] md:flex-col md:gap-3 md:overflow-y-auto md:overflow-x-hidden">
                      {detail.imageUrls.map((imageUrl, index) => {
                        const isActive = index === activeImageIndex;

                        return (
                          <button
                            key={`${imageUrl}-${index}`}
                            type="button"
                            onClick={() => setActiveImageIndex(index)}
                            aria-label={`Открыть фото ${index + 1}`}
                            aria-pressed={isActive}
                            className={cn(
                              "relative h-24 w-24 shrink-0 cursor-pointer overflow-hidden rounded-[14px] border-2 bg-white transition-colors md:h-auto md:w-full md:aspect-square",
                              isActive ? "border-[var(--accent)]" : "border-[var(--card-bg)] hover:border-black/15",
                            )}
                          >
                            <Image src={imageUrl} alt="" fill sizes="(max-width: 767px) 96px, (max-width: 1279px) 16vw, 180px" className="object-cover" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : null}

              <div className={cn("order-1", hasMultipleImages ? "md:order-2 md:col-span-5" : "md:col-span-6")}>
                <div className="relative overflow-hidden rounded-[18px] bg-white md:rounded-[22.5px]">
                  <div className="relative aspect-square w-full min-h-[320px] md:h-[min(78vh,720px)] md:aspect-auto md:min-h-0">
                    {detail.imageUrls.map((imageUrl, index) => {
                      const isActive = index === activeImageIndex;

                      return (
                        <div
                          key={`${imageUrl}-${index}-slide`}
                          aria-hidden={!isActive}
                          className={cn(
                            "absolute inset-0 transition-all duration-400 ease-out",
                            isActive ? "pointer-events-auto scale-100 opacity-100" : "pointer-events-none scale-[1.02] opacity-0",
                          )}
                        >
                          <Image
                            src={imageUrl}
                            alt={detail.title}
                            fill
                            priority={index === 0}
                            sizes="(max-width: 767px) 100vw, (max-width: 1279px) calc(100vw - 160px), 700px"
                            className="object-cover"
                          />
                        </div>
                      );
                    })}
                  </div>

                  {hasMultipleImages ? (
                    <SliderControl
                      onPrevClick={showPreviousImage}
                      onNextClick={showNextImage}
                      prevAriaLabel="Предыдущее фото"
                      nextAriaLabel="Следующее фото"
                      className="absolute right-4 bottom-4 z-10"
                    />
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-7">
            <div className="space-y-4">
              <div className="space-y-3">
                <h1 className="m-0 font-heading text-4xl leading-[0.96] tracking-[0.01em] text-[var(--heading)] uppercase md:text-6xl xl:text-[72px]">
                  {detail.title}
                </h1>
              </div>

              <div className="grid gap-3 text-sm leading-[1.35] text-[var(--text-muted)] md:text-base">
                <p>Артикул: {detail.article}</p>
                <p className="text-2xl font-semibold leading-none text-[var(--heading)] md:text-[2rem]">
                  {formatRubPrice(detail.priceRub)}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--heading)]">Цвета</p>
              <div className="flex flex-wrap gap-3">
                {detail.variants.map((variant) => {
                  const isActive = variant.id === detail.productId;

                  return (
                    <Link
                      key={variant.id}
                      href={variant.href}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "flex min-w-[138px] items-center gap-3 rounded-[14px] border bg-white px-3 py-3 transition-colors",
                        isActive ? "border-[var(--accent)]" : "border-transparent hover:border-black/10",
                      )}
                    >
                      <span className="relative size-12 shrink-0 overflow-hidden rounded-[10px] bg-[var(--surface)]">
                        <Image src={variant.imageUrl} alt={variant.colorLabel} fill sizes="48px" className="object-cover" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-[var(--heading)]">{variant.colorLabel}</span>
                        <span className="block truncate text-xs text-[var(--text-muted)]">{variant.article}</span>
                      </span>
                    </Link>
                  );
                })}
              </div>
              <p className="text-sm leading-[1.35] text-[var(--text-muted)] md:text-base">Наличие: {detail.stock} шт.</p>
            </div>

            <div className="flex flex-row flex-wrap gap-3">
              <div className="relative flex-1" ref={wishlistPopoverRef}>
                <button
                  type="button"
                  onClick={handleWishlistClick}
                  className={cn(
                    buttonVariants({ variant: addedToWishlist ? "blue" : "white" }),
                    "flex-1",
                    addedToWishlist ? "gap-2 text-white" : null,
                  )}
                >
                  {addedToWishlist ? <CheckIcon className="size-4" strokeWidth={2.6} /> : null}
                  {addedToWishlist ? "Добавлено в вишлист" : "Добавить в вишлист"}
                </button>

                {isWishlistPopoverOpen ? (
                  <div className="absolute bottom-[calc(100%+8px)] left-0 z-40 min-w-[220px] max-w-[260px] rounded-[10px] border border-black/10 bg-white p-3 shadow-[0_18px_40px_rgba(42,42,42,0.22)]">
                    <label className="flex items-center gap-2 text-sm text-[var(--text)]">
                      <span className="shrink-0">Тираж:</span>
                      <input
                        type="number"
                        min={1}
                        value={quantity}
                        onChange={(event) => setQuantity(event.target.value)}
                        className="h-8 w-full rounded-[7px] px-2 text-sm outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleWishlistConfirm}
                        aria-label="Подтвердить тираж"
                        className="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-[7px] bg-[var(--accent)] text-white transition-colors hover:bg-[var(--accent-hover)]"
                      >
                        <CheckIcon className="size-4" strokeWidth={2.8} />
                      </button>
                    </label>
                  </div>
                ) : null}
              </div>
              {detail.layoutPdf ? (
                <Link href={detail.layoutPdf} target="_blank" rel="noreferrer" className={cn(buttonVariants({ variant: "blue" }), "flex-1")}>
                  Скачать шаблон
                </Link>
              ) : null}
              {detail.fileAboutBlock ? (
                <Link href={detail.fileAboutBlock} target="_blank" rel="noreferrer" className={cn(buttonVariants({ variant: "white" }), "flex-1")}>
                  Скачать описание блока
                </Link>
              ) : null}
            </div>

            {detail.attributes.length > 0 ? (
              <section className="rounded-[18px] bg-white p-5 md:rounded-[22.5px] md:p-7">
                <h2 className="mb-4 font-heading text-2xl leading-[0.98] tracking-[0.01em] text-[var(--heading)] uppercase md:text-3xl">
                  Характеристики
                </h2>
                <dl className="grid gap-x-6 gap-y-4 md:grid-cols-2">
                  {detail.attributes.map((attribute) => (
                    <div key={attribute.label} className="border-b border-black/8 pb-3">
                      <dt className="mb-1 text-xs uppercase tracking-[0.08em] text-[var(--text-muted)]">{attribute.label}</dt>
                      <dd className="m-0 text-sm leading-[1.35] text-[var(--text)] md:text-base">{attribute.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ) : null}

            {detail.tuning.length > 0 ? (
              <section className="rounded-[18px] bg-white p-5 md:rounded-[22.5px] md:p-7">
                <h2 className="mb-4 font-heading text-2xl leading-[0.98] tracking-[0.01em] text-[var(--heading)] uppercase md:text-3xl">
                  Варианты нанесения
                </h2>
                <div className="flex flex-wrap gap-2">
                  {detail.tuning.map((item) => (
                    <span key={item} className="inline-flex rounded-full bg-[var(--card-bg)] px-3 py-2 text-sm text-[var(--text)]">
                      {item}
                    </span>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </div>
      </section>

      <section className="mb-[43px] rounded-[18px] bg-white p-5 md:mb-[55px] md:rounded-[22.5px] md:p-8">
        <h2 className="mb-5 font-heading text-2xl leading-[0.98] tracking-[0.01em] text-[var(--heading)] uppercase md:text-4xl">
          Описание
        </h2>
        {detail.descriptionHtml ? (
          <div
            className="partner-catalog-description [&_li]:mb-2 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:list-outside text-sm leading-[1.55] text-[var(--text)] md:text-base"
            dangerouslySetInnerHTML={{ __html: detail.descriptionHtml }}
          />
        ) : (
          <p className="text-sm leading-[1.55] text-[var(--text-muted)] md:text-base">Описание для этого товара пока не добавлено.</p>
        )}
      </section>

      <RequestCta />
    </>
  );
}
