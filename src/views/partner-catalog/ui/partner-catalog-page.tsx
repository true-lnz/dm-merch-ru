"use client";

import { RequestCta } from "@/features/request-cta";
import { cn } from "@/shared/lib/cn";
import { useWishlist } from "@/shared/lib/wishlist";
import { buttonVariants } from "@/shared/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/ui/collapsible";
import { PageHeading } from "@/shared/ui/page-heading";
import { SliderControl } from "@/shared/ui/slider-control";
import { WidowFix } from "@/shared/ui/widow-fix";
import { CheckIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { toast } from "sonner";
import type {
  PartnerCatalogChildSection,
  PartnerCatalogData,
  PartnerCatalogProduct,
  PartnerCatalogRootSection,
  PartnerCatalogVariant,
} from "../model/partner-catalog-data";

const ALL_FILTER_ID = "all";
const MOBILE_FADE_DURATION_MS = 180;
const PAGE_SIZE_OPTIONS = [50, 100, 200] as const;
const DESKTOP_CARD_CONTENT_HEIGHT_CLASS = "md:h-[19rem]";
const DESKTOP_CARD_CONTENT_MIN_HEIGHT_CLASS = "md:min-h-[19rem]";
const DESKTOP_CARD_TITLE_HEIGHT_CLASS = "md:h-[4.5rem]";
const DESKTOP_CARD_TITLE_MIN_HEIGHT_CLASS = "md:min-h-[4.5rem]";

const PRODUCT_CARD_LAYERS = [
  {
    key: "base",
    wrapperClassName: "",
    shellProps: { expandedTitle: false, shadow: false, ariaHidden: false },
  },
  {
    key: "overlay",
    wrapperClassName:
      "pointer-events-none absolute inset-x-0 top-0 z-20 hidden opacity-0 transition-opacity duration-200 md:block md:group-hover:opacity-100",
    innerClassName: "pointer-events-auto",
    shellProps: { expandedTitle: true, shadow: true, ariaHidden: true },
  },
] as const;

const rubFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 2,
});

function formatRubPrice(value: number) {
  return rubFormatter.format(value);
}

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

function WishlistActionButton({ variant }: { variant: PartnerCatalogVariant }) {
  const { isInWishlist, addItem, removeItem } = useWishlist();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [quantity, setQuantity] = useState("50");
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const added = isInWishlist(variant.article);

  useOutsideClick(popoverRef, () => setIsPopoverOpen(false), isPopoverOpen);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsPopoverOpen(false);
      }
    }

    if (!isPopoverOpen) {
      return;
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isPopoverOpen]);

  function handleConfirm() {
    const safeQuantity = Math.max(1, Number.parseInt(quantity.replace(/[^\d]/g, ""), 10) || 1);

    addItem(
      {
        id: variant.article,
        articleNumber: variant.article,
        title: variant.title,
        imageUrl: variant.imageUrl,
        unitPriceRub: variant.discountPriceRub ?? variant.priceRub,
      },
      safeQuantity,
    );
    toast.success("Товар добавлен в вишлист");
    setIsPopoverOpen(false);
  }

  function handleMainClick() {
    if (added) {
      removeItem(variant.article);
      toast.info("Убрано из вишлиста");
      return;
    }

    setIsPopoverOpen((open) => !open);
  }

  return (
    <div className="relative mt-auto" ref={popoverRef}>
      <button
        type="button"
        onClick={handleMainClick}
        className={cn(buttonVariants({ variant: added ? "blue" : "white" }), "w-full", added ? "gap-2 text-white" : "text-[var(--accent)]")}
      >
        {added ? <CheckIcon className="size-4" strokeWidth={2.6} /> : null}
        {added ? "Добавлено в вишлист" : "Добавить в вишлист"}
      </button>

      {isPopoverOpen ? (
        <div className="absolute bottom-[calc(100%+8px)] left-0 z-40 w-full rounded-[10px] bg-white p-3 shadow-[0_10px_24px_rgba(42,42,42,0.12)]">
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
              onClick={handleConfirm}
              aria-label="Подтвердить тираж"
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[7px] bg-[var(--accent)] text-white transition-colors hover:bg-[var(--accent-hover)]"
            >
              <CheckIcon className="size-4" strokeWidth={2.8} />
            </button>
          </label>
        </div>
      ) : null}
    </div>
  );
}

function ProductCardImage({ variant }: { variant: PartnerCatalogVariant }) {
  return (
    <div className="relative aspect-square w-full overflow-hidden bg-[var(--surface)]">
      <Image src={variant.imageUrl} alt={variant.title} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover" />
      {variant.discountPriceRub ? (
        <span className="font-heading absolute right-3 top-3 rounded-md bg-[#ff3333] px-[12px] pt-[2px] text-lg uppercase tracking-[0.04em] text-white">
          Скидка
        </span>
      ) : null}
    </div>
  );
}

function ProductCardContent({
  variants,
  activeVariant,
  activeVariantId,
  expandedTitle = false,
  className,
  onVariantSelect,
}: {
  variants: PartnerCatalogVariant[];
  activeVariant: PartnerCatalogVariant;
  activeVariantId: string;
  expandedTitle?: boolean;
  className?: string;
  onVariantSelect: (variantId: string) => void;
}) {
  return (
    <div
      className={cn(
        "flex h-full flex-1 flex-col gap-2 bg-[var(--card-bg)] px-[18px] pt-[10px] pb-[18px] md:px-[22px] md:pt-[12px] md:pb-[22px]",
        expandedTitle ? DESKTOP_CARD_CONTENT_MIN_HEIGHT_CLASS : DESKTOP_CARD_CONTENT_HEIGHT_CLASS,
        className,
      )}
    >
      <div className="flex items-baseline gap-2 font-sans">
        {activeVariant.discountPriceRub ? (
          <span className="text-lg font-semibold text-black">{formatRubPrice(activeVariant.discountPriceRub)}</span>
        ) : null}
        <span className={cn("text-base", activeVariant.discountPriceRub ? "text-[#8f8f8f] line-through" : "font-semibold text-black")}>
          {formatRubPrice(activeVariant.priceRub)}
        </span>
      </div>

      <div className={cn("pt-[2px]", expandedTitle ? DESKTOP_CARD_TITLE_MIN_HEIGHT_CLASS : DESKTOP_CARD_TITLE_HEIGHT_CLASS)}>
        <h3
          className={cn(
            "font-heading text-3xl leading-[1.2] tracking-[0.01em] text-[var(--heading)]",
            expandedTitle ? "block" : "overflow-hidden [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]",
          )}
        >
          {activeVariant.title}
        </h3>
      </div>

      <div className="mt-auto flex flex-col gap-2">
        <div>
          <p className="text-sm text-[var(--text-muted)]">Артикул: {activeVariant.article}</p>
          <p className="text-sm text-[var(--text-muted)]">Наличие: {activeVariant.stock} шт.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {variants.map((variant) => {
            const isActive = variant.id === activeVariantId;

            return (
              <button
                key={variant.id}
                type="button"
                onClick={() => onVariantSelect(variant.id)}
                className={cn(
                  "relative h-10 w-10 cursor-pointer overflow-hidden rounded-[6px] bg-white transition-shadow",
                  isActive ? "ring-2 ring-[var(--accent)] ring-offset-1 ring-offset-[var(--card-bg)]" : "hover:shadow-[0_0_0_1px_rgba(64,64,64,0.2)]",
                )}
                aria-label={`Выбрать вариант ${variant.colorLabel}`}
                aria-pressed={isActive}
              >
                <Image src={variant.imageUrl} alt={variant.colorLabel} fill sizes="40px" className="object-cover" />
              </button>
            );
          })}
        </div>
      </div>

      <WishlistActionButton variant={activeVariant} />
    </div>
  );
}

function ProductCardShell({
  variants,
  activeVariant,
  activeVariantId,
  onVariantSelect,
  expandedTitle = false,
  shadow = false,
  ariaHidden = false,
}: {
  variants: PartnerCatalogVariant[];
  activeVariant: PartnerCatalogVariant;
  activeVariantId: string;
  onVariantSelect: (variantId: string) => void;
  expandedTitle?: boolean;
  shadow?: boolean;
  ariaHidden?: boolean;
}) {
  return (
    <article
      aria-hidden={ariaHidden || undefined}
      className={cn(
        "overflow-hidden rounded-[18px] border border-transparent bg-[var(--card-bg)] transition-colors md:rounded-[22.5px] md:hover:border",
        shadow ? "shadow-[0_16px_40px_rgba(42,42,42,0.16)]" : null,
      )}
    >
      <ProductCardImage variant={activeVariant} />
      <ProductCardContent
        variants={variants}
        activeVariant={activeVariant}
        activeVariantId={activeVariantId}
        onVariantSelect={onVariantSelect}
        expandedTitle={expandedTitle}
      />
    </article>
  );
}

function PartnerProductCard({ item }: { item: PartnerCatalogProduct }) {
  const [activeVariantId, setActiveVariantId] = useState(item.variants[0]?.id ?? "");

  const activeVariant = item.variants.find((variant) => variant.id === activeVariantId) ?? item.variants[0];

  if (!activeVariant) {
    return null;
  }

  return (
    <div className="group relative z-0 overflow-visible md:hover:z-20">
      {PRODUCT_CARD_LAYERS.map((layer) => (
        <div key={layer.key} className={layer.wrapperClassName}>
          <div className={layer.innerClassName}>
            <ProductCardShell
              variants={item.variants}
              activeVariant={activeVariant}
              activeVariantId={activeVariant.id}
              onVariantSelect={setActiveVariantId}
              {...layer.shellProps}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function MobileCategorySummary({
  rootCategory,
  childCategory,
}: {
  rootCategory?: PartnerCatalogRootSection;
  childCategory?: PartnerCatalogChildSection;
}) {
  if (!rootCategory && !childCategory) {
    return (
      <div className="mb-5 md:hidden">
        <p className="font-heading text-2xl uppercase leading-[0.95] text-[var(--heading)]">Все товары</p>
      </div>
    );
  }

  return (
    <div className="mb-5 flex flex-col gap-1 md:hidden">
      {rootCategory ? <p className="font-heading text-2xl uppercase leading-[0.95] text-[var(--heading)]">{rootCategory.name}</p> : null}
      {childCategory ? <p className="text-sm text-[var(--text-muted)]">{childCategory.name}</p> : null}
    </div>
  );
}

export function PartnerCatalogPage({ data }: { data: PartnerCatalogData }) {
  const [activeFilterId, setActiveFilterId] = useState(ALL_FILTER_ID);
  const [expandedRootId, setExpandedRootId] = useState<string | null>(null);
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZE_OPTIONS)[number]>(50);
  const [loadedCount, setLoadedCount] = useState(50);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobileContentVisible, setIsMobileContentVisible] = useState(true);
  const transitionTimeoutRef = useRef<number | null>(null);
  const listStartRef = useRef<HTMLDivElement | null>(null);

  const activeRootCategory = useMemo(
    () =>
      activeFilterId === ALL_FILTER_ID
        ? undefined
        : data.categories.find((category) => category.children.some((childCategory) => childCategory.id === activeFilterId)),
    [activeFilterId, data.categories],
  );
  const activeChildCategory = useMemo(
    () => activeRootCategory?.children.find((childCategory) => childCategory.id === activeFilterId),
    [activeFilterId, activeRootCategory],
  );
  const visibleProducts = useMemo(() => {
    if (activeFilterId === ALL_FILTER_ID) {
      return data.products;
    }

    return data.products.filter((product) => product.sectionId === activeFilterId);
  }, [activeFilterId, data.products]);
  const displayedProducts = useMemo(() => visibleProducts.slice(0, Math.min(loadedCount, visibleProducts.length)), [loadedCount, visibleProducts]);
  const nextCursor = displayedProducts.length < visibleProducts.length ? displayedProducts.length : null;
  const safeActiveIndex = activeIndex < displayedProducts.length ? activeIndex : 0;
  const activeItem = displayedProducts[safeActiveIndex] ?? displayedProducts[0];

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current !== null) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  function handleFilterChange(nextFilterId: string) {
    if (nextFilterId === activeFilterId) {
      return;
    }

    if (transitionTimeoutRef.current !== null) {
      window.clearTimeout(transitionTimeoutRef.current);
      transitionTimeoutRef.current = null;
    }

    setActiveIndex(0);
    setIsMobileContentVisible(true);
    setLoadedCount(pageSize);
    setActiveFilterId(nextFilterId);
    listStartRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleChildCategoryClick(rootCategoryId: string, childCategoryId: string) {
    setExpandedRootId(rootCategoryId);
    handleFilterChange(childCategoryId);
  }

  function handlePageSizeChange(nextPageSize: (typeof PAGE_SIZE_OPTIONS)[number]) {
    if (nextPageSize === pageSize) {
      return;
    }

    setPageSize(nextPageSize);
    setLoadedCount(nextPageSize);
    setActiveIndex(0);
    setIsMobileContentVisible(true);
  }

  function handleLoadMore() {
    if (nextCursor === null) {
      return;
    }

    setLoadedCount((currentCount) => Math.min(currentCount + pageSize, visibleProducts.length));
  }

  function commitCardChange(nextIndex: number) {
    if (!displayedProducts[nextIndex] || nextIndex === safeActiveIndex) {
      return;
    }

    if (transitionTimeoutRef.current !== null) {
      window.clearTimeout(transitionTimeoutRef.current);
    }

    setIsMobileContentVisible(false);

    transitionTimeoutRef.current = window.setTimeout(() => {
      setActiveIndex(nextIndex);
      setIsMobileContentVisible(true);
      transitionTimeoutRef.current = null;
    }, MOBILE_FADE_DURATION_MS);
  }

  return (
    <>
      <WidowFix />
      <PageHeading
        title="Каталог партнерских товаров"
        breadcrumb={{
          labelFrom: "Главная",
          labelTo: "Каталог партнерских товаров",
          href: "/",
        }}
      />

      <section className="mt-[28.8px] mb-[43px] md:mb-[52px] xl:mb-[70px]">
        <div className="mb-5 md:mb-4 md:grid md:grid-cols-[245px_minmax(0,1fr)] md:items-center md:gap-8 xl:gap-[63px]">
          <p className="text-base font-bold uppercase  tracking-[0.08em] text-[var(--heading)]">Список</p>

          <div className="mt-3 flex flex-col gap-3 md:mt-0 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-[var(--text-muted)]">
              Показано {displayedProducts.length} из {visibleProducts.length}
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-[var(--text-muted)]">Отображать по:</span>
              {PAGE_SIZE_OPTIONS.map((option) => {
                const isActive = option === pageSize;

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handlePageSizeChange(option)}
                    className={cn(
                      "min-w-14 cursor-pointer rounded-full px-4 py-2 text-sm transition-colors",
                      isActive ? "bg-[var(--accent)] text-white" : "bg-[var(--card-bg)] text-[var(--heading)] hover:bg-[#e1e0db]",
                    )}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="md:grid md:grid-cols-[245px_minmax(0,1fr)] md:items-start md:gap-8 xl:gap-[63px]">
          <aside className="hidden md:block">
            <div className="rounded-[18px] bg-white p-4 md:rounded-[22.5px] md:p-5">
              <button
                type="button"
                onClick={() => {
                  setExpandedRootId(null);
                  handleFilterChange(ALL_FILTER_ID);
                }}
                className={cn(
                  "w-full cursor-pointer border-b border-black/10 py-3 text-left text-sm transition-colors",
                  activeFilterId === ALL_FILTER_ID ? "font-semibold text-black" : "text-[#5f5f5f] hover:text-black",
                )}
              >
                Все товары
              </button>

              <div className="pt-1">
                {data.categories.map((category) => (
                  <div key={category.id} className="border-b border-black/10 py-1">
                    <Collapsible open={expandedRootId === category.id} onOpenChange={(open) => setExpandedRootId(open ? category.id : null)}>
                      <CollapsibleTrigger className="py-2 text-sm font-medium text-[#404040]">{category.name}</CollapsibleTrigger>
                      <CollapsibleContent className="pb-2">
                        <div className="mt-1 space-y-1 pl-3">
                          {category.children.map((childCategory) => {
                            const isActive = activeFilterId === childCategory.id;

                            return (
                              <button
                                key={childCategory.id}
                                type="button"
                                onClick={() => handleChildCategoryClick(category.id, childCategory.id)}
                                className={cn(
                                  "w-full cursor-pointer py-1.5 text-left text-sm leading-[1.3] transition-colors",
                                  isActive ? "text-[var(--accent)]" : "text-[#6f6f6f] hover:text-black",
                                )}
                              >
                                {childCategory.name}
                              </button>
                            );
                          })}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          <div ref={listStartRef} className="scroll-mt-[88px] md:scroll-mt-[112px]">
            <MobileCategorySummary rootCategory={activeRootCategory} childCategory={activeChildCategory} />

            {visibleProducts.length > 0 ? (
              <>
                <div className="flex flex-col md:hidden">
                  {activeItem ? (
                    <>
                      <article className="flex h-full flex-col overflow-hidden rounded-[18px] bg-white md:rounded-[22.5px]">
                        <div className={cn("transition-opacity duration-200", isMobileContentVisible ? "opacity-100" : "opacity-0")}>
                          <PartnerProductCard item={activeItem} />
                        </div>
                      </article>
                      <SliderControl
                        className="mt-5 self-center"
                        onPrevClick={() => commitCardChange(safeActiveIndex - 1)}
                        onNextClick={() => commitCardChange(safeActiveIndex + 1)}
                        prevDisabled={safeActiveIndex === 0}
                        nextDisabled={safeActiveIndex === displayedProducts.length - 1}
                        prevAriaLabel={`Предыдущая карточка (${safeActiveIndex + 1} из ${displayedProducts.length})`}
                        nextAriaLabel={`Следующая карточка (${safeActiveIndex + 1} из ${displayedProducts.length})`}
                      />
                    </>
                  ) : null}
                </div>

                <div className="hidden overflow-visible items-start gap-7 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {displayedProducts.map((item) => (
                    <PartnerProductCard key={item.id} item={item} />
                  ))}
                </div>

                {nextCursor !== null ? (
                  <div className="mt-10 flex justify-center md:mt-12">
                    <button
                      type="button"
                      onClick={handleLoadMore}
                      className={cn(buttonVariants({ variant: "white" }), "min-w-44 text-[var(--accent)]")}
                    >
                      Загрузить еще
                    </button>
                  </div>
                ) : null}
              </>
            ) : (
              <div className="rounded-[18px] bg-[var(--card-bg)] p-4 text-sm leading-[1.4] text-[var(--text-muted)] md:p-6">
                Для выбранной категории пока нет товаров.
              </div>
            )}
          </div>
        </div>
      </section>

      <RequestCta />
    </>
  );
}
