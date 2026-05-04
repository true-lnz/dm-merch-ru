"use client";

import { RequestCta } from "@/features/request-cta";
import { getCatalogRootIconId } from "@/shared/config/catalog-root-icons";
import { subscribeToMediaQuery } from "@/shared/lib/browser-compat";
import { cn } from "@/shared/lib/cn";
import { showWishlistAddedToast, useWishlist } from "@/shared/lib/wishlist";
import { buttonVariants } from "@/shared/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/ui/collapsible";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/shared/ui/dialog";
import { PageHeading } from "@/shared/ui/page-heading";
import { Skeleton } from "@/shared/ui/skeleton";
import { Spinner } from "@/shared/ui/spinner";
import { WidowFix } from "@/shared/ui/widow-fix";
import { CatalogCategoryIcon } from "@/widgets/catalog-products-categories";
import { CheckIcon, ChevronDownIcon, FunnelIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { memo, useEffect, useMemo, useRef, useState, type ComponentProps, type RefObject } from "react";
import { toast } from "sonner";
import {
  type PartnerCatalogInitialData,
  type PartnerCatalogPageSlice,
  type PartnerCatalogProduct,
  type PartnerCatalogRootSection,
  type PartnerCatalogVariant,
} from "../model/partner-catalog-data";
import {
  getPartnerCatalogFilterInputValues,
  getPartnerCatalogPathForFilter,
  getPartnerCatalogProductPath,
  hasActivePartnerCatalogFilters,
  normalizePartnerCatalogFilters,
  normalizePartnerCatalogSort,
  PARTNER_CATALOG_DEFAULT_SORT,
  PARTNER_CATALOG_QUERY_CATEGORY_KEY,
  PARTNER_CATALOG_QUERY_PRICE_FROM_KEY,
  PARTNER_CATALOG_QUERY_PRICE_TO_KEY,
  PARTNER_CATALOG_QUERY_SORT_KEY,
  PARTNER_CATALOG_QUERY_STOCK_FROM_KEY,
  PARTNER_CATALOG_QUERY_SUBCATEGORY_KEY,
  resolvePartnerCatalogSelection,
  type PartnerCatalogFilterInputValues,
  type PartnerCatalogFilters,
  type PartnerCatalogSortKey,
} from "../model/partner-catalog-query";

const ALL_FILTER_ID = "all";
const MOBILE_PAGE_SIZE = 16;
const PAGE_SIZE_OPTIONS = [24, 50, 80] as const;
const CATALOG_API_ROUTE = "/api/partner-catalog";
const loadedCatalogImageKeys = new Set<string>();
const SORT_OPTIONS: { value: PartnerCatalogSortKey; label: string }[] = [
  { value: "price-asc", label: "По возрастанию цены" },
  { value: "price-desc", label: "По убыванию цены" },
  { value: "stock-asc", label: "По возрастанию количества" },
  { value: "stock-desc", label: "По убыванию количества" },
];
const rubFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 2,
});

function formatRubPrice(value: number) {
  return rubFormatter.format(value);
}

function getCatalogImageCacheKey(src: ComponentProps<typeof Image>["src"]) {
  if (typeof src === "string") {
    return src;
  }

  return "src" in src ? src.src : src.default.src;
}

function shouldBypassNextImageOptimizer(src: ComponentProps<typeof Image>["src"]) {
  const imageSrc = getCatalogImageCacheKey(src);

  return imageSrc.startsWith("/images/");
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

function areFilterInputValuesEqual(left: PartnerCatalogFilterInputValues, right: PartnerCatalogFilterInputValues) {
  return left.priceFrom === right.priceFrom && left.priceTo === right.priceTo && left.stockFrom === right.stockFrom;
}

function sanitizeNumericInput(value: string, integer = false) {
  if (!value) {
    return "";
  }

  const normalizedValue = value.replace(",", ".").replace(/[^\d.]/g, "");
  const [integerPart = "", ...fractionParts] = normalizedValue.split(".");

  if (integer) {
    return integerPart;
  }

  return fractionParts.length > 0 ? `${integerPart}.${fractionParts.join("")}` : integerPart;
}

function matchesVariantFilters(variant: PartnerCatalogVariant, filters: PartnerCatalogFilters) {
  if (filters.priceFrom !== undefined && variant.priceRub < filters.priceFrom) {
    return false;
  }

  if (filters.priceTo !== undefined && variant.priceRub > filters.priceTo) {
    return false;
  }

  if (filters.stockFrom !== undefined && variant.stock < filters.stockFrom) {
    return false;
  }

  return true;
}

function getRepresentativeVariantForSort(product: PartnerCatalogProduct, filters: PartnerCatalogFilters) {
  return product.variants.find((variant) => matchesVariantFilters(variant, filters)) ?? product.variants[0];
}

function sortPartnerCatalogProductsForClient(products: PartnerCatalogProduct[], filters: PartnerCatalogFilters, sort: PartnerCatalogSortKey) {
  return [...products].sort((left, right) => {
    const leftVariant = getRepresentativeVariantForSort(left, filters);
    const rightVariant = getRepresentativeVariantForSort(right, filters);

    if (!leftVariant || !rightVariant) {
      return left.id.localeCompare(right.id, "ru");
    }

    const metric =
      sort === "price-asc" || sort === "price-desc" ? leftVariant.priceRub - rightVariant.priceRub : leftVariant.stock - rightVariant.stock;

    if (metric !== 0) {
      return sort === "price-desc" || sort === "stock-desc" ? -metric : metric;
    }

    return leftVariant.article.localeCompare(rightVariant.article, "ru");
  });
}

async function fetchCatalogPageSlice(
  filterId: string,
  filters: PartnerCatalogFilterInputValues,
  sort: PartnerCatalogSortKey,
  offset: number,
  limit: number,
) {
  const params = new URLSearchParams({
    filterId,
    offset: String(offset),
    limit: String(limit),
  });

  if (filters.priceFrom) {
    params.set(PARTNER_CATALOG_QUERY_PRICE_FROM_KEY, filters.priceFrom);
  }

  if (filters.priceTo) {
    params.set(PARTNER_CATALOG_QUERY_PRICE_TO_KEY, filters.priceTo);
  }

  if (filters.stockFrom) {
    params.set(PARTNER_CATALOG_QUERY_STOCK_FROM_KEY, filters.stockFrom);
  }

  if (sort !== PARTNER_CATALOG_DEFAULT_SORT) {
    params.set(PARTNER_CATALOG_QUERY_SORT_KEY, sort);
  }

  const response = await fetch(`${CATALOG_API_ROUTE}?${params.toString()}`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Failed to load partner catalog page slice");
  }

  return (await response.json()) as PartnerCatalogPageSlice;
}

function WishlistActionButton({ variant, productHref }: { variant: PartnerCatalogVariant; productHref: string }) {
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
        productUrl: productHref,
        unitPriceRub: variant.priceRub,
      },
      safeQuantity,
    );
    showWishlistAddedToast();
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
              onClick={handleConfirm}
              aria-label="Подтвердить тираж"
              className="inline-flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-[7px] bg-[var(--accent)] text-white transition-colors hover:bg-[var(--accent-hover)]"
            >
              <CheckIcon className="size-4" strokeWidth={2.8} />
            </button>
          </label>
        </div>
      ) : null}
    </div>
  );
}

function CatalogImageWithSkeleton({
  alt,
  className,
  skeletonClassName,
  onLoad,
  ...props
}: ComponentProps<typeof Image> & { skeletonClassName?: string }) {
  const imageCacheKey = getCatalogImageCacheKey(props.src);
  const [isLoaded, setIsLoaded] = useState(() => loadedCatalogImageKeys.has(imageCacheKey));

  useEffect(() => {
    setIsLoaded(loadedCatalogImageKeys.has(imageCacheKey));
  }, [imageCacheKey]);

  return (
    <>
      {!isLoaded ? (
        <div className={cn("absolute inset-0 overflow-hidden rounded-none", skeletonClassName)}>
          <Skeleton className="absolute inset-0 rounded-none bg-[#e7f0ff]" />
          <div
            aria-hidden="true"
            className="absolute inset-y-0 -left-1/2 w-1/2 animate-pulse bg-gradient-to-r from-transparent via-[#ffffff] to-transparent"
            style={{ transform: "skewX(-18deg)" }}
          />
        </div>
      ) : null}
      <Image
        {...props}
        alt={alt}
        // unoptimized={props.unoptimized ?? shouldBypassNextImageOptimizer(props.src)}
        onLoad={(event) => {
          loadedCatalogImageKeys.add(imageCacheKey);
          setIsLoaded(true);
          onLoad?.(event);
        }}
        className={cn("transition-opacity duration-300", isLoaded ? "opacity-100" : "opacity-0", className)}
      />
    </>
  );
}

function ProductCardImage({ variant, href }: { variant: PartnerCatalogVariant; href: string }) {
  return (
    <Link href={href} target="_blank" rel="noreferrer" aria-label={`Открыть товар ${variant.title}`} className="block">
      <div className="relative aspect-square w-full overflow-hidden rounded-t-[18px] md:rounded-t-[22.5px]  bg-[var(--surface)]">
        <CatalogImageWithSkeleton src={variant.imageUrl} alt={variant.title} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-contain" />
      </div>
    </Link>
  );
}

function VariantSelectorStrip({
  variants,
  activeVariantId,
  onVariantSelect,
}: {
  variants: PartnerCatalogVariant[];
  activeVariantId: string;
  onVariantSelect: (variantId: string) => void;
}) {
  const stripRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartScrollLeftRef = useRef(0);
  const suppressClickRef = useRef(false);

  function handleMouseDown(event: React.MouseEvent<HTMLDivElement>) {
    if (event.button !== 0) {
      return;
    }

    const strip = stripRef.current;

    if (!strip) {
      return;
    }

    isDraggingRef.current = true;
    dragStartXRef.current = event.clientX;
    dragStartScrollLeftRef.current = strip.scrollLeft;
    suppressClickRef.current = false;
  }

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const strip = stripRef.current;

    if (!strip || !isDraggingRef.current) {
      return;
    }

    const deltaX = event.clientX - dragStartXRef.current;

    if (Math.abs(deltaX) > 4) {
      suppressClickRef.current = true;
    }

    strip.scrollLeft = dragStartScrollLeftRef.current - deltaX;
  }

  function handleMouseUp() {
    isDraggingRef.current = false;
  }

  function handleMouseLeave() {
    isDraggingRef.current = false;
  }

  function handleVariantClick(event: React.MouseEvent<HTMLButtonElement>, variantId: string) {
    if (suppressClickRef.current) {
      event.preventDefault();
      event.stopPropagation();
      suppressClickRef.current = false;
      return;
    }

    onVariantSelect(variantId);
  }

  return (
    <div
      ref={stripRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      className="flex snap-x snap-mandatory items-center gap-2 overflow-x-auto select-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:cursor-grab md:active:cursor-grabbing"
    >
      {variants.map((variant) => {
        const isActive = variant.id === activeVariantId;

        return (
          <button
            key={variant.id}
            type="button"
            onClick={(event) => handleVariantClick(event, variant.id)}
            className={cn(
              "relative h-10 w-10 shrink-0 snap-start cursor-pointer overflow-hidden rounded-[6px] border-2 bg-white transition-colors",
              isActive ? "border-[var(--accent)]" : "border-transparent hover:border-[rgba(64,64,64,0.2)]",
            )}
            aria-label={`Выбрать вариант ${variant.colorLabel}`}
            aria-pressed={isActive}
          >
            <CatalogImageWithSkeleton
              src={variant.imageUrl}
              alt={variant.colorLabel}
              fill
              sizes="40px"
              draggable={false}
              skeletonClassName="rounded-[4px]"
              className="pointer-events-none select-none object-cover"
            />
          </button>
        );
      })}
    </div>
  );
}

function ProductCardContent({
  variants,
  activeVariant,
  activeVariantId,
  productHref,
  onVariantSelect,
}: {
  variants: PartnerCatalogVariant[];
  activeVariant: PartnerCatalogVariant;
  activeVariantId: string;
  productHref: string;
  onVariantSelect: (variantId: string) => void;
}) {
  return (
    <div className="flex flex-1 flex-col gap-2 bg-[var(--card-bg)] rounded-b-[18px] md:rounded-b-[22.5px] px-[18px] pt-[10px] pb-[18px] md:px-[22px] md:pt-[12px] md:pb-[22px]">
      <div className="flex items-baseline gap-2 font-sans">
        <span className="text-base font-semibold text-black">{formatRubPrice(activeVariant.priceRub)}</span>
      </div>

      <div className="min-h-[2.4em] pt-[2px]">
        <h3 className="font-heading text-2xl leading-[1.2] tracking-[0.01em] text-[var(--heading)] overflow-hidden [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] md:group-hover:block md:group-hover:overflow-visible md:group-hover:[-webkit-line-clamp:unset]">
          <Link href={productHref} target="_blank" rel="noreferrer" className="transition-colors hover:text-[var(--accent)]">
            {activeVariant.title}
          </Link>
        </h3>
      </div>

      <div className="mt-auto flex flex-col gap-2">
        <div>
          <p className="text-sm text-[var(--text-muted)]">Артикул: {activeVariant.article}</p>
          <p className="text-sm text-[var(--text-muted)]">Наличие: {activeVariant.stock} шт.</p>
        </div>
        <VariantSelectorStrip variants={variants} activeVariantId={activeVariantId} onVariantSelect={onVariantSelect} />
      </div>

      <WishlistActionButton variant={activeVariant} productHref={productHref} />
    </div>
  );
}

function ProductCardShell({
  variants,
  activeVariant,
  activeVariantId,
  productHref,
  className,
  onVariantSelect,
}: {
  variants: PartnerCatalogVariant[];
  activeVariant: PartnerCatalogVariant;
  activeVariantId: string;
  productHref: string;
  className?: string;
  onVariantSelect: (variantId: string) => void;
}) {
  return (
    <article
      className={cn(
        "absolute inset-x-0 top-0 h-full overflow-visible rounded-[18px] bg-transparent md:rounded-[22.5px] md:group-hover:z-20",
        className,
      )}
    >
      <div className="flex h-full flex-col overflow-hidden rounded-[18px] md:rounded-[22.5px] border border-transparent bg-[var(--card-bg)] transition-[border-color,box-shadow,height] md:group-hover:h-auto md:group-hover:min-h-full md:group-hover:overflow-visible md:group-hover:border-[rgba(42,42,42,0.12)] md:group-hover:shadow-[0_16px_40px_rgba(42,42,42,0.16)]">
        <ProductCardImage variant={activeVariant} href={productHref} />
        <ProductCardContent
          variants={variants}
          activeVariant={activeVariant}
          activeVariantId={activeVariantId}
          productHref={productHref}
          onVariantSelect={onVariantSelect}
        />
      </div>
    </article>
  );
}

function ProductCardPlaceholder() {
  return (
    <div aria-hidden="true" className="pointer-events-none invisible">
      <div className="aspect-square w-full" />
      <div className="bg-[var(--card-bg)] px-[18px] pt-[10px] pb-[18px] md:px-[22px] md:pt-[12px] md:pb-[22px]">
        <div className="flex flex-col gap-2">
          <div className="h-6" />
          <div className="min-h-[2.4em] pt-[2px]" />
          <div className="h-[88px]" />
          <div className="h-[47px]" />
        </div>
      </div>
    </div>
  );
}

const PartnerProductCard = memo(function PartnerProductCard({
  item,
  categories,
  filterInputs,
}: {
  item: PartnerCatalogProduct;
  categories: PartnerCatalogRootSection[];
  filterInputs: PartnerCatalogFilterInputValues;
}) {
  const [activeVariantId, setActiveVariantId] = useState(item.variants[0]?.id ?? "");
  const normalizedFilters = useMemo(() => normalizePartnerCatalogFilters(filterInputs), [filterInputs]);
  const visibleVariants = useMemo(() => {
    if (!hasActivePartnerCatalogFilters(normalizedFilters)) {
      return item.variants;
    }

    const matchingVariants = item.variants.filter((variant) => matchesVariantFilters(variant, normalizedFilters));
    return matchingVariants.length > 0 ? matchingVariants : item.variants;
  }, [item.variants, normalizedFilters]);
  const activeVariant = visibleVariants.find((variant) => variant.id === activeVariantId) ?? visibleVariants[0];
  const productHref = useMemo(
    () => (activeVariant ? getPartnerCatalogProductPath(categories, item.sectionId, activeVariant.id) : "/partner-catalog"),
    [activeVariant, categories, item.sectionId],
  );

  if (!activeVariant) {
    return null;
  }

  return (
    <div className="group relative z-0 h-full overflow-visible md:hover:z-20">
      <ProductCardPlaceholder />
      <ProductCardShell
        variants={visibleVariants}
        activeVariant={activeVariant}
        activeVariantId={activeVariant.id}
        productHref={productHref}
        onVariantSelect={setActiveVariantId}
      />
    </div>
  );
});

function CatalogFilterFields({
  values,
  onChange,
}: {
  values: PartnerCatalogFilterInputValues;
  onChange: (key: keyof PartnerCatalogFilterInputValues, value: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-medium text-[#404040]">Цена, ₽</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <input
            type="text"
            inputMode="decimal"
            placeholder="От"
            value={values.priceFrom}
            onChange={(event) => onChange("priceFrom", event.target.value)}
            className="h-10 rounded-[10px] border border-transparent bg-[#f2f1eb] px-3 text-sm text-[var(--heading)] outline-none transition-colors placeholder:text-[#9b9b9b] focus:border-[var(--accent)]"
          />
          <input
            type="text"
            inputMode="decimal"
            placeholder="До"
            value={values.priceTo}
            onChange={(event) => onChange("priceTo", event.target.value)}
            className="h-10 rounded-[10px] border border-transparent bg-[#f2f1eb] px-3 text-sm text-[var(--heading)] outline-none transition-colors placeholder:text-[#9b9b9b] focus:border-[var(--accent)]"
          />
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-[#404040]">Количество от</p>
        <div className="mt-2">
          <input
            type="text"
            inputMode="numeric"
            placeholder="Например, 50"
            value={values.stockFrom}
            onChange={(event) => onChange("stockFrom", event.target.value)}
            className="h-10 w-full rounded-[10px] border border-transparent bg-[#f2f1eb] px-3 text-sm text-[var(--heading)] outline-none transition-colors placeholder:text-[#9b9b9b] focus:border-[var(--accent)]"
          />
        </div>
      </div>
    </div>
  );
}

function CatalogNumericFilters({
  values,
  onChange,
  onReset,
}: {
  values: PartnerCatalogFilterInputValues;
  onChange: (key: keyof PartnerCatalogFilterInputValues, value: string) => void;
  onReset: () => void;
}) {
  const hasActiveFilters = values.priceFrom !== "" || values.priceTo !== "" || values.stockFrom !== "";
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="relative rounded-[18px] bg-white p-4 md:rounded-[22.5px] md:p-5">
        <div className="flex items-center justify-between gap-3">
          <CollapsibleTrigger showChevron={false} className="flex !w-auto cursor-pointer items-center gap-3 text-left">
            <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.05em] text-[var(--heading)]">
              <span>Фильтры</span>
              <ChevronDownIcon className={cn("size-4 shrink-0 text-[#7d7d7d] transition-transform", isOpen ? "rotate-180" : null)} />
            </span>
          </CollapsibleTrigger>

          <div
            aria-hidden={!hasActiveFilters}
            className={cn(
              "overflow-hidden transition-[max-width,opacity,margin] duration-200 ease-out",
              hasActiveFilters ? "ml-2 max-w-[140px] opacity-100" : "ml-0 max-w-0 opacity-0",
            )}
          >
            <button
              type="button"
              onClick={onReset}
              disabled={!hasActiveFilters}
              className={cn(
                "shrink-0 whitespace-nowrap text-sm transition-colors",
                hasActiveFilters ? "cursor-pointer text-[var(--accent)] hover:text-[var(--accent-hover)]" : "cursor-default text-[#a3a3a3]",
              )}
            >
              Сбросить
            </button>
          </div>
        </div>

        <CollapsibleContent className="overflow-hidden data-[closed]:animate-accordion-up data-[open]:animate-accordion-down">
          <div className="mt-4">
            <CatalogFilterFields values={values} onChange={onChange} />
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}

function FilterApplyPopover({
  total,
  isLoading,
  onApply,
  onDismiss,
  className,
}: {
  total: number | null;
  isLoading: boolean;
  onApply: () => void;
  onDismiss: () => void;
  className?: string;
}) {
  const label = isLoading ? "Ищем товары..." : `Показать ${total ?? 0} товаров`;

  return (
    <div className={cn("z-25", className)}>
      <div className="relative rounded-[16px] bg-[var(--accent)] px-4 py-3 text-white shadow-[0_18px_40px_rgba(60,120,255,0.28)]">
        <div aria-hidden="true" className="absolute top-1/2 -left-[6px] size-[16px] -translate-y-1/2 rotate-45 bg-[var(--accent)]" />
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onApply}
            disabled={isLoading}
            className="cursor-pointer whitespace-nowrap border-b border-dotted border-white/45 text-left text-sm font-medium leading-none transition-opacity hover:opacity-90 disabled:cursor-default disabled:opacity-70"
          >
            {label}
          </button>
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Скрыть подсказку применения фильтра"
            className="inline-flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/16 transition-colors hover:bg-white/24"
          >
            <XIcon className="size-4" strokeWidth={2.3} />
          </button>
        </div>
      </div>
    </div>
  );
}

function CatalogSortSelect({ value, onChange }: { value: PartnerCatalogSortKey; onChange: (value: PartnerCatalogSortKey) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const activeOption = SORT_OPTIONS.find((option) => option.value === value) ?? SORT_OPTIONS[0];

  useOutsideClick(popoverRef, () => setIsOpen(false), isOpen);

  return (
    <div className="relative" ref={popoverRef}>
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-full bg-[var(--card-bg)] px-4 py-2 text-sm text-[var(--heading)] transition-colors hover:bg-[#e1e0db]"
      >
        <span className="whitespace-nowrap">{activeOption.label}</span>
        <ChevronDownIcon className={cn("size-4 shrink-0 transition-transform", isOpen ? "rotate-180" : null)} />
      </button>

      {isOpen ? (
        <div className="absolute top-[calc(100%+8px)] left-0 z-30 min-w-[280px] rounded-[16px] border border-black/10 bg-white p-2 shadow-[0_18px_40px_rgba(42,42,42,0.16)]">
          {SORT_OPTIONS.map((option) => {
            const isActive = option.value === value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex w-full cursor-pointer items-center rounded-[12px] px-3 py-2 text-left text-sm transition-colors",
                  isActive ? "bg-[var(--card-bg)] text-[var(--heading)]" : "text-[#5f5f5f] hover:bg-[var(--card-bg)] hover:text-[var(--heading)]",
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function CategoryFilterList({
  categories,
  activeFilterId,
  expandedRootId,
  onExpandedRootChange,
  onAllProductsClick,
  onRootCategoryClick,
  onChildCategoryClick,
  showIcons = false,
}: {
  categories: PartnerCatalogRootSection[];
  activeFilterId: string;
  expandedRootId: string | null;
  onExpandedRootChange: (rootId: string | null) => void;
  onAllProductsClick: () => void;
  onRootCategoryClick: (rootCategoryId: string) => void;
  onChildCategoryClick: (rootCategoryId: string, childCategoryId: string) => void;
  showIcons?: boolean;
}) {
  return (
    <div className="rounded-[18px] bg-white p-4 md:rounded-[22.5px] md:p-5">
      <button
        type="button"
        onClick={onAllProductsClick}
        className={cn(
          "w-full cursor-pointer border-b border-black/10 py-3 text-left text-sm transition-colors",
          activeFilterId === ALL_FILTER_ID ? "font-semibold text-black" : "text-[#5f5f5f] hover:text-black",
        )}
      >
        Все товары
      </button>

      <div className="pt-1">
        {categories.map((category) => (
          <div key={category.id} className="border-b border-black/10 py-1">
            <Collapsible open={expandedRootId === category.id} onOpenChange={(open) => onExpandedRootChange(open ? category.id : null)}>
              <CollapsibleTrigger className="py-2 text-sm font-medium text-[#404040]">
                {showIcons ? (
                  <span className="flex items-center gap-3">
                    <CatalogCategoryIcon
                      iconId={getCatalogRootIconId(category.id)}
                      monochrome
                      className="h-6 w-8 text-[var(--accent)] md:h-6 md:w-8"
                    />
                    <span>{category.name}</span>
                  </span>
                ) : (
                  category.name
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="pb-2">
                <div className={cn("mt-1 space-y-1", showIcons ? "pl-[44px]" : "pl-3")}>
                  <button
                    type="button"
                    onClick={() => onRootCategoryClick(category.id)}
                    className={cn(
                      "w-full cursor-pointer py-1.5 text-left text-sm leading-[1.3] transition-colors",
                      activeFilterId === category.id ? "font-medium text-[var(--accent)]" : "text-[#6f6f6f] hover:text-black",
                    )}
                  >
                    Все товары
                  </button>
                  {category.children.map((childCategory) => {
                    const isActive = activeFilterId === childCategory.id;

                    return (
                      <button
                        key={childCategory.id}
                        type="button"
                        onClick={() => onChildCategoryClick(category.id, childCategory.id)}
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
  );
}

export function PartnerCatalogPage({ initialData }: { initialData: PartnerCatalogInitialData }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeFilterId, setActiveFilterId] = useState(initialData.initialFilterId);
  const [expandedRootId, setExpandedRootId] = useState<string | null>(initialData.initialExpandedRootId);
  const [sortKey, setSortKey] = useState<PartnerCatalogSortKey>(initialData.initialSort);
  const [draftFilterInputs, setDraftFilterInputs] = useState<PartnerCatalogFilterInputValues>(initialData.initialFilters);
  const [appliedFilterInputs, setAppliedFilterInputs] = useState<PartnerCatalogFilterInputValues>(initialData.initialFilters);
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZE_OPTIONS)[number]>(24);
  const [products, setProducts] = useState(initialData.initialSlice.items);
  const [totalCount, setTotalCount] = useState(initialData.initialSlice.total);
  const [draftPreviewTotal, setDraftPreviewTotal] = useState<number | null>(initialData.initialSlice.total);
  const [isFetchingDraftPreview, setIsFetchingDraftPreview] = useState(false);
  const [isFilterApplyPopoverDismissed, setIsFilterApplyPopoverDismissed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isFetchingProducts, setIsFetchingProducts] = useState(false);
  const [isGridRefreshing, setIsGridRefreshing] = useState(false);
  const [isMobileCategoryDialogOpen, setIsMobileCategoryDialogOpen] = useState(false);
  const [isMobileFilterDialogOpen, setIsMobileFilterDialogOpen] = useState(false);
  const listStartRef = useRef<HTMLDivElement | null>(null);
  const requestIdRef = useRef(0);
  const draftPreviewRequestIdRef = useRef(0);
  const activeFilterIdRef = useRef(initialData.initialFilterId);
  const expandedRootIdRef = useRef<string | null>(initialData.initialExpandedRootId);
  const sortKeyRef = useRef(initialData.initialSort);
  const draftFilterInputsRef = useRef(initialData.initialFilters);
  const appliedFilterInputsRef = useRef(initialData.initialFilters);
  const searchParamsKey = searchParams.toString();
  const normalizedDraftFilterInputs = useMemo(
    () => getPartnerCatalogFilterInputValues(normalizePartnerCatalogFilters(draftFilterInputs)),
    [draftFilterInputs],
  );

  const activeRootCategory = useMemo(
    () =>
      activeFilterId === ALL_FILTER_ID
        ? undefined
        : initialData.categories.find(
            (category) => category.id === activeFilterId || category.children.some((childCategory) => childCategory.id === activeFilterId),
          ),
    [activeFilterId, initialData.categories],
  );
  const activeChildCategory = useMemo(
    () => activeRootCategory?.children.find((childCategory) => childCategory.id === activeFilterId),
    [activeFilterId, activeRootCategory],
  );
  const nextCursor = products.length < totalCount ? products.length : null;
  const activeCategoryLabel = activeChildCategory?.name ?? activeRootCategory?.name ?? "Все товары";
  const hasPendingFilterChanges = !areFilterInputValuesEqual(normalizedDraftFilterInputs, appliedFilterInputs);
  const shouldShowFilterApplyPopover = hasPendingFilterChanges && !isFilterApplyPopoverDismissed;
  const displayedProducts = useMemo(
    () => sortPartnerCatalogProductsForClient(products, normalizePartnerCatalogFilters(appliedFilterInputs), sortKey),
    [appliedFilterInputs, products, sortKey],
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsDesktop(event.matches);
    };

    handleChange(mediaQuery);
    const unsubscribe = subscribeToMediaQuery(mediaQuery, handleChange);

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const targetPageSize = isDesktop ? pageSize : MOBILE_PAGE_SIZE;

    if (products.length >= Math.min(targetPageSize, totalCount)) {
      return;
    }

    void loadCatalogSlice(activeFilterId, appliedFilterInputs, sortKey, 0, targetPageSize, false);
  }, [activeFilterId, appliedFilterInputs, isDesktop, pageSize, products.length, sortKey, totalCount]);

  useEffect(() => {
    activeFilterIdRef.current = activeFilterId;
  }, [activeFilterId]);

  useEffect(() => {
    expandedRootIdRef.current = expandedRootId;
  }, [expandedRootId]);

  useEffect(() => {
    sortKeyRef.current = sortKey;
  }, [sortKey]);

  useEffect(() => {
    draftFilterInputsRef.current = draftFilterInputs;
  }, [draftFilterInputs]);

  useEffect(() => {
    appliedFilterInputsRef.current = appliedFilterInputs;
  }, [appliedFilterInputs]);

  useEffect(() => {
    setIsFilterApplyPopoverDismissed(false);
  }, [normalizedDraftFilterInputs, activeFilterId]);

  useEffect(() => {
    if (!hasPendingFilterChanges) {
      setDraftPreviewTotal(totalCount);
      setIsFetchingDraftPreview(false);
      return;
    }

    const nextRequestId = draftPreviewRequestIdRef.current + 1;
    draftPreviewRequestIdRef.current = nextRequestId;
    setIsFetchingDraftPreview(true);

    const timeoutId = window.setTimeout(() => {
      void fetchCatalogPageSlice(activeFilterId, normalizedDraftFilterInputs, sortKey, 0, 1)
        .then((slice) => {
          if (draftPreviewRequestIdRef.current !== nextRequestId) {
            return;
          }

          setDraftPreviewTotal(slice.total);
        })
        .catch(() => {
          if (draftPreviewRequestIdRef.current !== nextRequestId) {
            return;
          }

          setDraftPreviewTotal(null);
        })
        .finally(() => {
          if (draftPreviewRequestIdRef.current === nextRequestId) {
            setIsFetchingDraftPreview(false);
          }
        });
    }, 180);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [activeFilterId, hasPendingFilterChanges, normalizedDraftFilterInputs, sortKey, totalCount]);

  useEffect(() => {
    const queryCategory = searchParams.get(PARTNER_CATALOG_QUERY_CATEGORY_KEY) ?? undefined;
    const querySubcategory = searchParams.get(PARTNER_CATALOG_QUERY_SUBCATEGORY_KEY) ?? undefined;
    const queryFilters = normalizePartnerCatalogFilters({
      priceFrom: searchParams.get(PARTNER_CATALOG_QUERY_PRICE_FROM_KEY) ?? undefined,
      priceTo: searchParams.get(PARTNER_CATALOG_QUERY_PRICE_TO_KEY) ?? undefined,
      stockFrom: searchParams.get(PARTNER_CATALOG_QUERY_STOCK_FROM_KEY) ?? undefined,
    });
    const querySort = normalizePartnerCatalogSort(searchParams.get(PARTNER_CATALOG_QUERY_SORT_KEY) ?? undefined);
    const normalizedQueryFilters = getPartnerCatalogFilterInputValues(queryFilters);
    const currentPageSize = isDesktop ? pageSize : MOBILE_PAGE_SIZE;
    const resolvedSelection = resolvePartnerCatalogSelection(
      initialData.categories,
      {
        category: queryCategory,
        subcategory: querySubcategory,
      },
      ALL_FILTER_ID,
    );
    const normalizedPath = getPartnerCatalogPathForFilter(
      initialData.categories,
      resolvedSelection.filterId,
      ALL_FILTER_ID,
      pathname,
      normalizedQueryFilters,
      querySort,
    );
    const currentPath = `${pathname}${searchParams.size > 0 ? `?${searchParams.toString()}` : ""}`;

    if (normalizedPath !== currentPath) {
      router.replace(normalizedPath, { scroll: false });
    }

    if (resolvedSelection.expandedRootId !== expandedRootIdRef.current) {
      setExpandedRootId(resolvedSelection.expandedRootId);
    }

    if (!areFilterInputValuesEqual(normalizedQueryFilters, draftFilterInputsRef.current)) {
      setDraftFilterInputs(normalizedQueryFilters);
    }

    if (!areFilterInputValuesEqual(normalizedQueryFilters, appliedFilterInputsRef.current)) {
      setAppliedFilterInputs(normalizedQueryFilters);
    }
    if (querySort !== sortKeyRef.current) {
      setSortKey(querySort);
    }
    setDraftPreviewTotal(totalCount);
    setIsFetchingDraftPreview(false);

    if (
      resolvedSelection.filterId === activeFilterIdRef.current &&
      areFilterInputValuesEqual(normalizedQueryFilters, appliedFilterInputsRef.current) &&
      querySort === sortKeyRef.current
    ) {
      return;
    }

    setActiveFilterId(resolvedSelection.filterId);
    void loadCatalogSlice(resolvedSelection.filterId, normalizedQueryFilters, querySort, 0, currentPageSize, false);
  }, [initialData.categories, isDesktop, pageSize, pathname, router, searchParams, searchParamsKey]);

  function getCurrentPageSize() {
    return isDesktop ? pageSize : MOBILE_PAGE_SIZE;
  }

  function syncFilterUrl(nextFilterId: string, nextFilterInputs: PartnerCatalogFilterInputValues, nextSortKey: PartnerCatalogSortKey = sortKey) {
    router.replace(getPartnerCatalogPathForFilter(initialData.categories, nextFilterId, ALL_FILTER_ID, pathname, nextFilterInputs, nextSortKey), {
      scroll: false,
    });
  }

  async function loadCatalogSlice(
    filterId: string,
    nextFilterInputs: PartnerCatalogFilterInputValues,
    nextSortKey: PartnerCatalogSortKey,
    offset: number,
    limit: number,
    append: boolean,
  ) {
    const nextRequestId = requestIdRef.current + 1;
    requestIdRef.current = nextRequestId;
    setIsFetchingProducts(true);
    setIsGridRefreshing(!append);

    try {
      const nextSlice = await fetchCatalogPageSlice(filterId, nextFilterInputs, nextSortKey, offset, limit);

      if (requestIdRef.current !== nextRequestId) {
        return;
      }

      setTotalCount(nextSlice.total);
      setProducts((currentProducts) => (append ? [...currentProducts, ...nextSlice.items] : nextSlice.items));
    } catch {
      if (requestIdRef.current === nextRequestId) {
        toast.error("Не удалось загрузить каталог");
      }
    } finally {
      if (requestIdRef.current === nextRequestId) {
        setIsFetchingProducts(false);
        setIsGridRefreshing(false);
      }
    }
  }

  function handleFilterChange(nextFilterId: string) {
    if (nextFilterId === activeFilterId || isFetchingProducts) {
      return;
    }

    const nextPageSize = getCurrentPageSize();
    setActiveFilterId(nextFilterId);
    syncFilterUrl(nextFilterId, appliedFilterInputs, sortKey);
    void loadCatalogSlice(nextFilterId, appliedFilterInputs, sortKey, 0, nextPageSize, false);
    listStartRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleChildCategoryClick(rootCategoryId: string, childCategoryId: string) {
    setExpandedRootId(rootCategoryId);
    handleFilterChange(childCategoryId);
  }

  function handleRootCategoryClick(rootCategoryId: string) {
    setExpandedRootId(rootCategoryId);
    handleFilterChange(rootCategoryId);
  }

  function handlePageSizeChange(nextPageSize: (typeof PAGE_SIZE_OPTIONS)[number]) {
    if (nextPageSize === pageSize || isFetchingProducts) {
      return;
    }

    setPageSize(nextPageSize);

    if (isDesktop) {
      void loadCatalogSlice(activeFilterId, appliedFilterInputs, sortKey, 0, nextPageSize, false);
    }
  }

  function handleLoadMore() {
    if (nextCursor === null || isFetchingProducts) {
      return;
    }

    void loadCatalogSlice(activeFilterId, appliedFilterInputs, sortKey, products.length, getCurrentPageSize(), true);
  }

  function handleAllProductsClick() {
    setExpandedRootId(null);

    if (activeFilterId === ALL_FILTER_ID) {
      syncFilterUrl(ALL_FILTER_ID, appliedFilterInputs, sortKey);
      return;
    }

    handleFilterChange(ALL_FILTER_ID);
  }

  function handleMobileChildCategoryClick(rootCategoryId: string, childCategoryId: string) {
    handleChildCategoryClick(rootCategoryId, childCategoryId);
    setIsMobileCategoryDialogOpen(false);
  }

  function handleMobileRootCategoryClick(rootCategoryId: string) {
    handleRootCategoryClick(rootCategoryId);
    setIsMobileCategoryDialogOpen(false);
  }

  function handleFilterInputChange(key: keyof PartnerCatalogFilterInputValues, value: string) {
    setDraftFilterInputs((currentInputs) => ({
      ...currentInputs,
      [key]: sanitizeNumericInput(value, key === "stockFrom"),
    }));
  }

  function handleApplyFilters() {
    const nextFilterInputs = normalizedDraftFilterInputs;
    const nextPageSize = getCurrentPageSize();

    setDraftFilterInputs(nextFilterInputs);
    setAppliedFilterInputs(nextFilterInputs);
    setDraftPreviewTotal(null);
    syncFilterUrl(activeFilterId, nextFilterInputs, sortKey);
    void loadCatalogSlice(activeFilterId, nextFilterInputs, sortKey, 0, nextPageSize, false);
  }

  function handleResetFilters() {
    const clearedFilters = {
      priceFrom: "",
      priceTo: "",
      stockFrom: "",
    };

    setDraftFilterInputs(clearedFilters);
    setAppliedFilterInputs(clearedFilters);
    setDraftPreviewTotal(null);
    syncFilterUrl(activeFilterId, clearedFilters, sortKey);
    void loadCatalogSlice(activeFilterId, clearedFilters, sortKey, 0, getCurrentPageSize(), false);
  }

  function handleDismissFilterApplyPopover() {
    setIsFilterApplyPopoverDismissed(true);
  }

  function handleSortChange(nextSortKey: PartnerCatalogSortKey) {
    if (nextSortKey === sortKey || isFetchingProducts) {
      return;
    }

    const nextPageSize = getCurrentPageSize();
    setSortKey(nextSortKey);
    syncFilterUrl(activeFilterId, appliedFilterInputs, nextSortKey);
    void loadCatalogSlice(activeFilterId, appliedFilterInputs, nextSortKey, 0, nextPageSize, false);
  }

  return (
    <>
      <WidowFix />
      <PageHeading
        title="Каталог продукции"
        breadcrumb={{
          labelFrom: "Главная",
          labelTo: "Каталог продукции",
          href: "/",
        }}
      />

      <section className="mt-[28.8px] mb-[35px] md:mb-[45px]">
        <div className="mb-5 md:mb-4 md:grid md:grid-cols-[245px_minmax(0,1fr)] md:items-center md:gap-8 xl:gap-[63px]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <p className="text-base font-bold uppercase tracking-[0.05em] text-[var(--heading)]">Категория:</p>
              <button
                type="button"
                onClick={() => setIsMobileCategoryDialogOpen(true)}
                className="inline-flex min-w-0 items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-[var(--heading)] md:hidden"
              >
                <span className="truncate">{activeCategoryLabel}</span>
                <ChevronDownIcon className="size-4 shrink-0" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => setIsMobileFilterDialogOpen(true)}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[var(--heading)] md:hidden"
              aria-label="Открыть фильтры"
            >
              <FunnelIcon className="size-4 shrink-0" />
            </button>
          </div>

          <div className="mt-3 flex flex-col gap-3 md:mt-0 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3 self-start md:self-auto">
              <div className="hidden md:block">
                <CatalogSortSelect value={sortKey} onChange={handleSortChange} />
              </div>
              <p className="text-sm text-[var(--text-muted)]">
                Показано {products.length} из {totalCount}
              </p>
            </div>

            <div className="hidden flex-wrap items-center gap-2 md:flex">
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
            <div className="space-y-4">
              <div className="relative">
                <CatalogNumericFilters values={draftFilterInputs} onChange={handleFilterInputChange} onReset={handleResetFilters} />
                {shouldShowFilterApplyPopover ? (
                  <FilterApplyPopover
                    total={draftPreviewTotal}
                    isLoading={isFetchingDraftPreview}
                    onApply={handleApplyFilters}
                    onDismiss={handleDismissFilterApplyPopover}
                    className="absolute top-1/2 left-full ml-4 hidden -translate-y-1/2 md:block"
                  />
                ) : null}
              </div>
              <CategoryFilterList
                categories={initialData.categories}
                activeFilterId={activeFilterId}
                expandedRootId={expandedRootId}
                onExpandedRootChange={setExpandedRootId}
                onAllProductsClick={handleAllProductsClick}
                onRootCategoryClick={handleRootCategoryClick}
                onChildCategoryClick={handleChildCategoryClick}
              />
            </div>
          </aside>

          <div ref={listStartRef} className="scroll-mt-[88px] md:scroll-mt-[112px]">
            {products.length > 0 ? (
              <div className="relative">
                <div className="grid grid-cols-1 gap-5 overflow-visible md:grid-cols-2 md:gap-7 lg:grid-cols-3 2xl:grid-cols-4">
                  {displayedProducts.map((item) => (
                    <PartnerProductCard key={item.id} item={item} categories={initialData.categories} filterInputs={appliedFilterInputs} />
                  ))}
                </div>

                {isGridRefreshing ? (
                  <div className="absolute inset-0 z-30 flex items-start justify-center rounded-[18px] bg-white/65 pt-6 backdrop-blur-[2px] md:rounded-[22.5px] md:pt-8">
                    <div className="inline-flex items-center gap-3 rounded-full bg-white/92 px-4 py-2 text-sm font-medium text-[var(--heading)] shadow-[0_12px_30px_rgba(42,42,42,0.12)]">
                      <Spinner className="size-4 text-[var(--accent)]" />
                      <span>Обновляем товары...</span>
                    </div>
                  </div>
                ) : null}

                {nextCursor !== null ? (
                  <div className="mt-10 flex justify-center md:mt-12">
                    <button
                      type="button"
                      onClick={handleLoadMore}
                      disabled={isFetchingProducts}
                      className={cn(buttonVariants({ variant: "white" }), "min-w-44 text-[var(--accent)]")}
                    >
                      {isFetchingProducts ? "Загрузка..." : "Загрузить еще"}
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="rounded-[18px] bg-[var(--card-bg)] p-4 text-sm leading-[1.4] text-[var(--text-muted)] md:p-6">
                {isFetchingProducts ? "Загрузка товаров..." : "Для выбранной категории пока нет товаров."}
              </div>
            )}
          </div>
        </div>
      </section>

      <Dialog open={isMobileCategoryDialogOpen} onOpenChange={setIsMobileCategoryDialogOpen}>
        <DialogContent
          showCloseButton={false}
          className="block h-screen h-[100dvh] max-h-screen max-h-[100dvh] w-screen max-w-none overflow-y-auto rounded-none bg-[var(--card-bg)] p-[27px] pt-[max(27px,env(safe-area-inset-top))] pb-[max(27px,env(safe-area-inset-bottom))] top-0 left-0 translate-x-0 translate-y-0 sm:p-[72px] sm:pt-[72px] sm:pb-[72px] sm:h-auto sm:max-h-[calc(100vh-2rem)] sm:max-h-[calc(100dvh-2rem)] sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-md sm:rounded-[22.5px] md:hidden"
        >
          <div className="mb-7 flex items-start justify-between gap-4">
            <DialogTitle className="font-heading text-4xl leading-[0.95] tracking-[0.015em] uppercase text-[var(--heading)]">Категории</DialogTitle>
            <DialogClose
              className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center text-[#b3b3b3] transition-colors hover:text-[#2a2a2a]"
              aria-label="Закрыть выбор категорий"
            >
              <XIcon className="size-5" strokeWidth={2.5} />
            </DialogClose>
          </div>
          <div className="space-y-4">
            <CategoryFilterList
              categories={initialData.categories}
              activeFilterId={activeFilterId}
              expandedRootId={expandedRootId}
              onExpandedRootChange={setExpandedRootId}
              showIcons
              onAllProductsClick={() => {
                handleAllProductsClick();
                setIsMobileCategoryDialogOpen(false);
              }}
              onRootCategoryClick={handleMobileRootCategoryClick}
              onChildCategoryClick={handleMobileChildCategoryClick}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isMobileFilterDialogOpen} onOpenChange={setIsMobileFilterDialogOpen}>
        <DialogContent
          showCloseButton={false}
          className="block h-screen h-[100dvh] max-h-screen max-h-[100dvh] w-screen max-w-none overflow-y-auto rounded-none bg-[var(--card-bg)] p-[27px] pt-[max(27px,env(safe-area-inset-top))] pb-[max(27px,env(safe-area-inset-bottom))] top-0 left-0 translate-x-0 translate-y-0 sm:p-[72px] sm:pt-[72px] sm:pb-[72px] sm:h-auto sm:max-h-[calc(100vh-2rem)] sm:max-h-[calc(100dvh-2rem)] sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-md sm:rounded-[22.5px] md:hidden"
        >
          <div className="mb-7 flex items-start justify-between gap-4">
            <DialogTitle className="font-heading text-4xl leading-[0.95] tracking-[0.015em] uppercase text-[var(--heading)]">Фильтры</DialogTitle>
            <DialogClose
              className="inline-flex size-8 shrink-0 cursor-pointer items-center justify-center text-[#b3b3b3] transition-colors hover:text-[#2a2a2a]"
              aria-label="Закрыть фильтры"
            >
              <XIcon className="size-5" strokeWidth={2.5} />
            </DialogClose>
          </div>

          <div className="space-y-4">
            <div className="rounded-[18px] bg-white p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <p className="text-sm font-semibold uppercase tracking-[0.05em] text-[var(--heading)]">Фильтры</p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className={cn(
                    "shrink-0 text-sm transition-colors",
                    draftFilterInputs.priceFrom !== "" || draftFilterInputs.priceTo !== "" || draftFilterInputs.stockFrom !== ""
                      ? "cursor-pointer text-[var(--accent)] hover:text-[var(--accent-hover)]"
                      : "cursor-default text-[#a3a3a3]",
                  )}
                >
                  Сбросить
                </button>
              </div>

              <CatalogFilterFields values={draftFilterInputs} onChange={handleFilterInputChange} />
            </div>

            <button
              type="button"
              onClick={() => {
                handleApplyFilters();
                setIsMobileFilterDialogOpen(false);
              }}
              disabled={isFetchingDraftPreview}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-[14px] bg-[var(--accent)] px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-[var(--accent-hover)] disabled:cursor-default disabled:opacity-70"
            >
              {isFetchingDraftPreview ? "Ищем товары..." : `Показать ${draftPreviewTotal ?? 0} товаров`}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <RequestCta />
    </>
  );
}
