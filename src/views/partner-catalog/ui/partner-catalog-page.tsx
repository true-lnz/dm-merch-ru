"use client";

import { RequestCta } from "@/features/request-cta";
import { cn } from "@/shared/lib/cn";
import { useWishlist } from "@/shared/lib/wishlist";
import { buttonVariants } from "@/shared/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/shared/ui/collapsible";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/shared/ui/dialog";
import { PageHeading } from "@/shared/ui/page-heading";
import { Skeleton } from "@/shared/ui/skeleton";
import { WidowFix } from "@/shared/ui/widow-fix";
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { memo, useEffect, useMemo, useRef, useState, type ComponentProps, type RefObject } from "react";
import { toast } from "sonner";
import type {
  PartnerCatalogInitialData,
  PartnerCatalogPageSlice,
  PartnerCatalogProduct,
  PartnerCatalogRootSection,
  PartnerCatalogVariant,
} from "../model/partner-catalog-data";
import {
  getPartnerCatalogPathForFilter,
  getPartnerCatalogProductPath,
  PARTNER_CATALOG_QUERY_CATEGORY_KEY,
  PARTNER_CATALOG_QUERY_SUBCATEGORY_KEY,
  resolvePartnerCatalogSelection,
} from "../model/partner-catalog-query";

const ALL_FILTER_ID = "all";
const MOBILE_PAGE_SIZE = 16;
const PAGE_SIZE_OPTIONS = [50, 100, 200] as const;
const CATALOG_API_ROUTE = "/api/partner-catalog";
const loadedCatalogImageKeys = new Set<string>();

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

async function fetchCatalogPageSlice(filterId: string, offset: number, limit: number) {
  const params = new URLSearchParams({
    filterId,
    offset: String(offset),
    limit: String(limit),
  });

  const response = await fetch(`${CATALOG_API_ROUTE}?${params.toString()}`, { cache: "no-store" });

  if (!response.ok) {
    throw new Error("Failed to load partner catalog page slice");
  }

  return (await response.json()) as PartnerCatalogPageSlice;
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
        unitPriceRub: variant.priceRub,
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
      <div className="relative aspect-square w-full overflow-hidden bg-[var(--surface)]">
        <CatalogImageWithSkeleton src={variant.imageUrl} alt={variant.title} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover" />
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
  expandedTitle = false,
  onVariantSelect,
}: {
  variants: PartnerCatalogVariant[];
  activeVariant: PartnerCatalogVariant;
  activeVariantId: string;
  productHref: string;
  expandedTitle?: boolean;
  onVariantSelect: (variantId: string) => void;
}) {
  return (
    <div className="flex flex-1 flex-col gap-2 bg-[var(--card-bg)] px-[18px] pt-[10px] pb-[18px] md:px-[22px] md:pt-[12px] md:pb-[22px]">
      <div className="flex items-baseline gap-2 font-sans">
        <span className="text-base font-semibold text-black">{formatRubPrice(activeVariant.priceRub)}</span>
      </div>

      <div className="pt-[2px]">
        <h3
          className={cn(
            "font-heading text-2xl leading-[1.2] tracking-[0.01em] text-[var(--heading)]",
            expandedTitle ? "block" : "overflow-hidden [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]",
          )}
        >
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

      <WishlistActionButton variant={activeVariant} />
    </div>
  );
}

function ProductCardShell({
  variants,
  activeVariant,
  activeVariantId,
  productHref,
  onVariantSelect,
  expandedTitle = false,
  shadow = false,
  ariaHidden = false,
}: {
  variants: PartnerCatalogVariant[];
  activeVariant: PartnerCatalogVariant;
  activeVariantId: string;
  productHref: string;
  onVariantSelect: (variantId: string) => void;
  expandedTitle?: boolean;
  shadow?: boolean;
  ariaHidden?: boolean;
}) {
  return (
    <article
      aria-hidden={ariaHidden || undefined}
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-[18px] border border-transparent bg-[var(--card-bg)] transition-colors md:rounded-[22.5px] md:hover:border",
        shadow ? "shadow-[0_16px_40px_rgba(42,42,42,0.16)]" : null,
      )}
    >
      <ProductCardImage variant={activeVariant} href={productHref} />
      <ProductCardContent
        variants={variants}
        activeVariant={activeVariant}
        activeVariantId={activeVariantId}
        productHref={productHref}
        onVariantSelect={onVariantSelect}
        expandedTitle={expandedTitle}
      />
    </article>
  );
}

const PartnerProductCard = memo(function PartnerProductCard({
  item,
  categories,
}: {
  item: PartnerCatalogProduct;
  categories: PartnerCatalogRootSection[];
}) {
  const [activeVariantId, setActiveVariantId] = useState(item.variants[0]?.id ?? "");
  const [isHovered, setIsHovered] = useState(false);

  const activeVariant = item.variants.find((variant) => variant.id === activeVariantId) ?? item.variants[0];
  const productHref = useMemo(
    () => (activeVariant ? getPartnerCatalogProductPath(categories, item.sectionId, activeVariant.id) : "/partner-catalog"),
    [activeVariant, categories, item.sectionId],
  );

  if (!activeVariant) {
    return null;
  }

  return (
    <div
      className="group relative z-0 h-full overflow-visible md:hover:z-20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ProductCardShell
        variants={item.variants}
        activeVariant={activeVariant}
        activeVariantId={activeVariant.id}
        productHref={productHref}
        onVariantSelect={setActiveVariantId}
      />

      {isHovered ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 z-20 hidden md:block">
          <div className="pointer-events-auto">
            <ProductCardShell
              variants={item.variants}
              activeVariant={activeVariant}
              activeVariantId={activeVariant.id}
              productHref={productHref}
              onVariantSelect={setActiveVariantId}
              expandedTitle
              shadow
              ariaHidden
            />
          </div>
        </div>
      ) : null}
    </div>
  );
});

function CategoryFilterList({
  categories,
  activeFilterId,
  expandedRootId,
  onExpandedRootChange,
  onAllProductsClick,
  onChildCategoryClick,
}: {
  categories: PartnerCatalogRootSection[];
  activeFilterId: string;
  expandedRootId: string | null;
  onExpandedRootChange: (rootId: string | null) => void;
  onAllProductsClick: () => void;
  onChildCategoryClick: (rootCategoryId: string, childCategoryId: string) => void;
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
              <CollapsibleTrigger className="py-2 text-sm font-medium text-[#404040]">{category.name}</CollapsibleTrigger>
              <CollapsibleContent className="pb-2">
                <div className="mt-1 space-y-1 pl-3">
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
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZE_OPTIONS)[number]>(50);
  const [products, setProducts] = useState(initialData.initialSlice.items);
  const [totalCount, setTotalCount] = useState(initialData.initialSlice.total);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isFetchingProducts, setIsFetchingProducts] = useState(false);
  const [isMobileCategoryDialogOpen, setIsMobileCategoryDialogOpen] = useState(false);
  const listStartRef = useRef<HTMLDivElement | null>(null);
  const requestIdRef = useRef(0);
  const activeFilterIdRef = useRef(initialData.initialFilterId);
  const expandedRootIdRef = useRef<string | null>(initialData.initialExpandedRootId);
  const searchParamsKey = searchParams.toString();

  const activeRootCategory = useMemo(
    () =>
      activeFilterId === ALL_FILTER_ID
        ? undefined
        : initialData.categories.find((category) => category.children.some((childCategory) => childCategory.id === activeFilterId)),
    [activeFilterId, initialData.categories],
  );
  const activeChildCategory = useMemo(
    () => activeRootCategory?.children.find((childCategory) => childCategory.id === activeFilterId),
    [activeFilterId, activeRootCategory],
  );
  const nextCursor = products.length < totalCount ? products.length : null;
  const activeCategoryLabel = activeChildCategory?.name ?? "Все товары";

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsDesktop(event.matches);
    };

    handleChange(mediaQuery);
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  useEffect(() => {
    const targetPageSize = isDesktop ? pageSize : MOBILE_PAGE_SIZE;

    if (products.length >= Math.min(targetPageSize, totalCount)) {
      return;
    }

    void loadCatalogSlice(activeFilterId, 0, targetPageSize, false);
  }, [activeFilterId, isDesktop, pageSize, products.length, totalCount]);

  useEffect(() => {
    activeFilterIdRef.current = activeFilterId;
  }, [activeFilterId]);

  useEffect(() => {
    expandedRootIdRef.current = expandedRootId;
  }, [expandedRootId]);

  useEffect(() => {
    const queryCategory = searchParams.get(PARTNER_CATALOG_QUERY_CATEGORY_KEY) ?? undefined;
    const querySubcategory = searchParams.get(PARTNER_CATALOG_QUERY_SUBCATEGORY_KEY) ?? undefined;
    const currentPageSize = isDesktop ? pageSize : MOBILE_PAGE_SIZE;
    const resolvedSelection = resolvePartnerCatalogSelection(
      initialData.categories,
      {
        category: queryCategory,
        subcategory: querySubcategory,
      },
      ALL_FILTER_ID,
    );
    const normalizedPath = getPartnerCatalogPathForFilter(initialData.categories, resolvedSelection.filterId, ALL_FILTER_ID, pathname);
    const currentPath = `${pathname}${searchParams.size > 0 ? `?${searchParams.toString()}` : ""}`;

    if (normalizedPath !== currentPath) {
      router.replace(normalizedPath, { scroll: false });
    }

    if (resolvedSelection.expandedRootId !== expandedRootIdRef.current) {
      setExpandedRootId(resolvedSelection.expandedRootId);
    }

    if (resolvedSelection.filterId === activeFilterIdRef.current) {
      return;
    }

    setActiveFilterId(resolvedSelection.filterId);
    void loadCatalogSlice(resolvedSelection.filterId, 0, currentPageSize, false);
  }, [initialData.categories, isDesktop, pageSize, pathname, router, searchParams, searchParamsKey]);

  function getCurrentPageSize() {
    return isDesktop ? pageSize : MOBILE_PAGE_SIZE;
  }

  function syncFilterUrl(nextFilterId: string) {
    router.replace(getPartnerCatalogPathForFilter(initialData.categories, nextFilterId, ALL_FILTER_ID, pathname), { scroll: false });
  }

  async function loadCatalogSlice(filterId: string, offset: number, limit: number, append: boolean) {
    const nextRequestId = requestIdRef.current + 1;
    requestIdRef.current = nextRequestId;
    setIsFetchingProducts(true);

    try {
      const nextSlice = await fetchCatalogPageSlice(filterId, offset, limit);

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
      }
    }
  }

  function handleFilterChange(nextFilterId: string) {
    if (nextFilterId === activeFilterId || isFetchingProducts) {
      return;
    }

    const nextPageSize = getCurrentPageSize();
    setActiveFilterId(nextFilterId);
    syncFilterUrl(nextFilterId);
    void loadCatalogSlice(nextFilterId, 0, nextPageSize, false);
    listStartRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function handleChildCategoryClick(rootCategoryId: string, childCategoryId: string) {
    setExpandedRootId(rootCategoryId);
    handleFilterChange(childCategoryId);
  }

  function handlePageSizeChange(nextPageSize: (typeof PAGE_SIZE_OPTIONS)[number]) {
    if (nextPageSize === pageSize || isFetchingProducts) {
      return;
    }

    setPageSize(nextPageSize);

    if (isDesktop) {
      void loadCatalogSlice(activeFilterId, 0, nextPageSize, false);
    }
  }

  function handleLoadMore() {
    if (nextCursor === null || isFetchingProducts) {
      return;
    }

    void loadCatalogSlice(activeFilterId, products.length, getCurrentPageSize(), true);
  }

  function handleAllProductsClick() {
    setExpandedRootId(null);

    if (activeFilterId === ALL_FILTER_ID) {
      syncFilterUrl(ALL_FILTER_ID);
      return;
    }

    handleFilterChange(ALL_FILTER_ID);
  }

  function handleMobileChildCategoryClick(rootCategoryId: string, childCategoryId: string) {
    handleChildCategoryClick(rootCategoryId, childCategoryId);
    setIsMobileCategoryDialogOpen(false);
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

      <section className="mt-[28.8px] mb-[45px]">
        <div className="mb-5 md:mb-4 md:grid md:grid-cols-[245px_minmax(0,1fr)] md:items-center md:gap-8 xl:gap-[63px]">
          <div className="flex items-center gap-3">
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

          <div className="mt-3 flex flex-col gap-3 md:mt-0 md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-[var(--text-muted)]">
              Показано {products.length} из {totalCount}
            </p>

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
            <CategoryFilterList
              categories={initialData.categories}
              activeFilterId={activeFilterId}
              expandedRootId={expandedRootId}
              onExpandedRootChange={setExpandedRootId}
              onAllProductsClick={handleAllProductsClick}
              onChildCategoryClick={handleChildCategoryClick}
            />
          </aside>

          <div ref={listStartRef} className="scroll-mt-[88px] md:scroll-mt-[112px]">
            {products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-5 overflow-visible md:grid-cols-2 md:gap-7 lg:grid-cols-3 2xl:grid-cols-4">
                  {products.map((item) => (
                    <PartnerProductCard key={item.id} item={item} categories={initialData.categories} />
                  ))}
                </div>

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
              </>
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
          className="block h-[100dvh] max-h-[100dvh] w-screen max-w-none overflow-y-auto rounded-none bg-[var(--card-bg)] p-[27px] pt-[max(27px,env(safe-area-inset-top))] pb-[max(27px,env(safe-area-inset-bottom))] top-0 left-0 translate-x-0 translate-y-0 sm:p-[72px] sm:pt-[72px] sm:pb-[72px] sm:h-auto sm:max-h-[calc(100dvh-2rem)] sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-md sm:rounded-[22.5px] md:hidden"
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
          <CategoryFilterList
            categories={initialData.categories}
            activeFilterId={activeFilterId}
            expandedRootId={expandedRootId}
            onExpandedRootChange={setExpandedRootId}
            onAllProductsClick={() => {
              handleAllProductsClick();
              setIsMobileCategoryDialogOpen(false);
            }}
            onChildCategoryClick={handleMobileChildCategoryClick}
          />
        </DialogContent>
      </Dialog>

      <RequestCta />
    </>
  );
}
