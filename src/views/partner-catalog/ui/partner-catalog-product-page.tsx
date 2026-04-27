"use client";

import { RequestCta } from "@/features/request-cta";
import { cn } from "@/shared/lib/cn";
import { showWishlistAddedToast, useWishlist } from "@/shared/lib/wishlist";
import { PageBreadcrumb } from "@/shared/ui/breadcrumb";
import { buttonVariants } from "@/shared/ui/button";
import { Skeleton } from "@/shared/ui/skeleton";
import { SliderControl } from "@/shared/ui/slider-control";
import { CheckIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type ComponentProps, type PointerEvent, type RefObject } from "react";
import { toast } from "sonner";
import type { PartnerCatalogProductDetail } from "../model/partner-catalog-data";
import { getPartnerCatalogPreviewImageUrl } from "../model/partner-catalog-image";

const loadedDetailImageKeys = new Set<string>();

const rubFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 2,
});

function formatRubPrice(value: number) {
  return rubFormatter.format(value);
}

function formatColorLabel(value: string) {
  return value
    .split(",")
    .map((part) => {
      const normalizedPart = part.trim().toLocaleLowerCase("ru-RU");

      if (!normalizedPart) {
        return "";
      }

      return normalizedPart.charAt(0).toLocaleUpperCase("ru-RU") + normalizedPart.slice(1);
    })
    .filter(Boolean)
    .join(", ");
}

function getCatalogImageCacheKey(src: ComponentProps<typeof Image>["src"]) {
  if (typeof src === "string") {
    return src;
  }

  return "src" in src ? src.src : src.default.src;
}

function shouldBypassNextImageOptimizer(src: ComponentProps<typeof Image>["src"]) {
  const imageSrc = getCatalogImageCacheKey(src);

  return imageSrc.startsWith("/gifts_export/") || imageSrc.startsWith("/images/");
}

type PartnerCatalogProductPageProps = {
  detail: PartnerCatalogProductDetail;
  listingHref: string;
};

type DescriptionContentBlock = {
  id: string;
  html: string;
  kind: "html" | "summary";
  summaryListHtml?: string;
};

type ZoomPosition = {
  x: number;
  y: number;
};

const descriptionContentClassName =
  "partner-catalog-description min-w-0 max-w-full overflow-x-hidden break-words [&_.tui-table-wrapper]:block [&_.tui-table-wrapper]:min-w-0 [&_.tui-table-wrapper]:max-w-full [&_.tui-table-wrapper]:overflow-x-auto [&_.tui-table-wrapper]:overscroll-x-contain [&_div]:max-w-full [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-[12px] [&_img]:object-contain [&_li]:mb-1 [&_p]:mb-1 [&_table]:w-max [&_table]:min-w-full [&_table]:max-w-none [&_table]:table-auto [&_td]:max-w-[12rem] [&_td]:whitespace-normal [&_td]:break-words [&_th]:max-w-[12rem] [&_th]:whitespace-normal [&_th]:break-words [&_ul]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:list-outside text-sm text-[var(--text)] md:text-base";

function stripHtmlTags(value: string) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function shouldSkipDescriptionBlock(value: string) {
  const normalizedText = stripHtmlTags(value).replace(/:+$/, "").trim().toLocaleLowerCase("ru-RU");

  return normalizedText === "размеры товара" || normalizedText === "шкала температуры" || normalizedText === "шкала времени";
}

function extractTopLevelDescriptionBlocks(descriptionHtml: string) {
  const blocks: string[] = [];
  const source = descriptionHtml.trim();
  let cursor = 0;

  while (cursor < source.length) {
    const nextTagIndex = source.indexOf("<", cursor);

    if (nextTagIndex === -1) {
      break;
    }

    if (nextTagIndex > cursor) {
      cursor = nextTagIndex;
    }

    const openTagMatch = source.slice(cursor).match(/^<([a-z0-9]+)(\s[^>]*)?>/i);

    if (!openTagMatch) {
      cursor += 1;
      continue;
    }

    const tagName = openTagMatch[1]?.toLowerCase();

    if (!tagName) {
      cursor += 1;
      continue;
    }

    if (tagName === "br") {
      cursor += openTagMatch[0].length;
      continue;
    }

    const closingTag = `</${tagName}>`;
    let depth = 0;
    let searchIndex = cursor;
    let blockEndIndex = -1;

    while (searchIndex < source.length) {
      const nextOpenIndex = source.toLowerCase().indexOf(`<${tagName}`, searchIndex);
      const nextCloseIndex = source.toLowerCase().indexOf(closingTag, searchIndex);

      if (nextCloseIndex === -1) {
        break;
      }

      if (nextOpenIndex !== -1 && nextOpenIndex < nextCloseIndex) {
        depth += 1;
        searchIndex = nextOpenIndex + tagName.length + 1;
        continue;
      }

      depth -= 1;
      searchIndex = nextCloseIndex + closingTag.length;

      if (depth === 0) {
        blockEndIndex = searchIndex;
        break;
      }
    }

    if (blockEndIndex === -1) {
      break;
    }

    const blockHtml = source.slice(cursor, blockEndIndex).trim();

    if ((stripHtmlTags(blockHtml) || tagName === "ul" || tagName === "ol") && !shouldSkipDescriptionBlock(blockHtml)) {
      blocks.push(blockHtml);
    }

    cursor = blockEndIndex;
  }

  return blocks;
}

function normalizeDescriptionSectionHtml(nodes: string[]) {
  return nodes
    .map((node) => node.trim())
    .filter(Boolean)
    .join("");
}

function normalizeSummaryHtml(value: string) {
  return value
    .trim()
    .replace(/^<p[^>]*>/i, "")
    .replace(/<\/p>$/i, "")
    .trim();
}

function buildDescriptionContentBlocks(descriptionHtml: string): DescriptionContentBlock[] {
  const topLevelElements = extractTopLevelDescriptionBlocks(descriptionHtml);

  if (topLevelElements.length === 0) {
    return [];
  }

  const contentBlocks: DescriptionContentBlock[] = [];
  let pendingHtmlNodes: string[] = [];

  function flushPendingHtmlNodes() {
    const html = normalizeDescriptionSectionHtml(pendingHtmlNodes);

    if (html) {
      contentBlocks.push({
        id: `html-${contentBlocks.length}`,
        kind: "html",
        html,
      });
    }

    pendingHtmlNodes = [];
  }

  for (let index = 0; index < topLevelElements.length; index += 1) {
    const currentElement = topLevelElements[index];
    const currentTagName = (currentElement.match(/^<([a-z0-9]+)/i)?.[1] ?? "").toUpperCase();
    const nextElement = topLevelElements[index + 1];
    const nextTagName = (nextElement?.match(/^<([a-z0-9]+)/i)?.[1] ?? "").toUpperCase();

    if (currentTagName === "P" && (nextTagName === "UL" || nextTagName === "OL")) {
      flushPendingHtmlNodes();
      contentBlocks.push({
        id: `summary-${contentBlocks.length}`,
        kind: "summary",
        html: currentElement,
        summaryListHtml: nextElement,
      });
      index += 1;
      continue;
    }

    pendingHtmlNodes.push(currentElement);
  }

  flushPendingHtmlNodes();

  return contentBlocks;
}

function DescriptionPlaceholder() {
  return (
    <p className="text-sm leading-[1.55] text-[var(--text-muted)] md:text-base">
      Для этого товара подробное описание пока не добавлено.
    </p>
  );
}

function SummaryDescription({ descriptionHtml }: { descriptionHtml: string }) {
  const contentBlocks = buildDescriptionContentBlocks(descriptionHtml);

  if (contentBlocks.length === 0) {
    return <DescriptionPlaceholder />;
  }

  return (
    <div className="space-y-4">
      {contentBlocks.map((block) =>
        block.kind === "summary" && block.summaryListHtml ? (
          <details key={block.id}>
            <summary className="group cursor-pointer bg-black/3 px-3 py-2 md:w-1/2 md:rounded-[8px]">
              <span
                className="relative inline text-sm leading-[1.55] text-[var(--text)] after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:content-[''] after:border-b after:border-dotted after:border-current after:opacity-0 after:origin-left after:scale-x-95 after:transition-all after:duration-200 group-hover:after:opacity-100 group-hover:after:scale-x-100 md:text-base"
                dangerouslySetInnerHTML={{ __html: normalizeSummaryHtml(block.html) }}
              />
            </summary>
            <div className={cn(descriptionContentClassName, "pt-3 [&_p]:mb-0")} dangerouslySetInnerHTML={{ __html: block.summaryListHtml }} />
          </details>
        ) : (
          <div key={block.id} className={descriptionContentClassName} dangerouslySetInnerHTML={{ __html: block.html }} />
        ),
      )}
    </div>
  );
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

function DetailImageWithSkeleton({
  alt,
  className,
  skeletonClassName,
  onLoad,
  ...props
}: ComponentProps<typeof Image> & { skeletonClassName?: string }) {
  const imageCacheKey = getCatalogImageCacheKey(props.src);
  const [isLoaded, setIsLoaded] = useState(() => loadedDetailImageKeys.has(imageCacheKey));

  useEffect(() => {
    setIsLoaded(loadedDetailImageKeys.has(imageCacheKey));
  }, [imageCacheKey]);

  return (
    <>
      {!isLoaded ? (
        <div className={cn("absolute inset-0 overflow-hidden", skeletonClassName)}>
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
        unoptimized={props.unoptimized ?? shouldBypassNextImageOptimizer(props.src)}
        onLoad={(event) => {
          loadedDetailImageKeys.add(imageCacheKey);
          setIsLoaded(true);
          onLoad?.(event);
        }}
        className={cn("transition-opacity duration-300", isLoaded ? "opacity-100" : "opacity-0", className)}
      />
    </>
  );
}

export function PartnerCatalogProductPage({ detail, listingHref }: PartnerCatalogProductPageProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [isDesktopViewport, setIsDesktopViewport] = useState(false);
  const [zoomPosition, setZoomPosition] = useState<ZoomPosition>({ x: 50, y: 50 });
  const { isInWishlist, addItem, removeItem } = useWishlist();
  const [isWishlistPopoverOpen, setIsWishlistPopoverOpen] = useState(false);
  const [quantity, setQuantity] = useState("50");
  const wishlistPopoverRef = useRef<HTMLDivElement | null>(null);
  const hasMultipleImages = detail.imageUrls.length > 1;
  const hasVariantChoices = detail.variants.length > 1;
  const addedToWishlist = isInWishlist(detail.article);
  const detailPreviewImageUrls = detail.imageUrls.map(getPartnerCatalogPreviewImageUrl);

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

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1280px)");

    function syncDesktopViewport() {
      if (!mediaQuery.matches) {
        setIsImageZoomed(false);
      }

      setIsDesktopViewport(mediaQuery.matches);
    }

    syncDesktopViewport();
    mediaQuery.addEventListener("change", syncDesktopViewport);

    return () => {
      mediaQuery.removeEventListener("change", syncDesktopViewport);
    };
  }, []);

  function activateImage(index: number) {
    setIsImageZoomed(false);
    setZoomPosition({ x: 50, y: 50 });
    setActiveImageIndex(index);
  }

  function showPreviousImage() {
    activateImage(activeImageIndex === 0 ? detail.imageUrls.length - 1 : activeImageIndex - 1);
  }

  function showNextImage() {
    activateImage(activeImageIndex === detail.imageUrls.length - 1 ? 0 : activeImageIndex + 1);
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
        productUrl: detail.variants.find((variant) => variant.id === detail.productId)?.href,
        unitPriceRub: detail.priceRub,
      },
      safeQuantity,
    );
    showWishlistAddedToast();
    setIsWishlistPopoverOpen(false);
  }

  function handleMainImagePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch" || !isDesktopViewport) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const nextX = ((event.clientX - bounds.left) / bounds.width) * 100;
    const nextY = ((event.clientY - bounds.top) / bounds.height) * 100;

    setZoomPosition({
      x: Math.min(100, Math.max(0, nextX)),
      y: Math.min(100, Math.max(0, nextY)),
    });
  }

  function handleMainImagePointerEnter(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "touch" || !isDesktopViewport) {
      return;
    }

    setIsImageZoomed(true);
    handleMainImagePointerMove(event);
  }

  function handleMainImagePointerLeave() {
    setIsImageZoomed(false);
  }

  return (
    <>
      <section className="mb-[35px] md:mb-[45px]">
        <PageBreadcrumb
          className="mb-4 mt-8 md:mb-5 md:mt-12 xl:mb-[42px] xl:mt-[39px]"
          items={[
            { label: "Главная", href: "/" },
            { label: "Каталог продукции", href: "/partner-catalog" },
            { label: detail.breadcrumb.rootName, href: listingHref },
          ]}
          currentLabel={detail.breadcrumb.childName}
        />

        <div className="grid min-w-0 gap-8 xl:grid-cols-[minmax(0,0.98fr)_minmax(0,0.88fr)] xl:gap-[62px]">
          <div className="min-w-0 space-y-4">
            <div className="grid min-w-0 gap-4 md:grid-cols-6 md:items-stretch">
              {hasMultipleImages ? (
                <div className="order-2 min-w-0 md:order-1 md:col-span-1">
                  <div className="relative md:h-[min(78vh,720px)]">
                    <div className="flex max-w-full min-w-0 gap-3 overflow-x-auto overscroll-x-contain pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:h-[min(78vh,720px)] md:flex-col md:gap-3 md:overflow-y-auto md:overflow-x-hidden">
                      {detail.imageUrls.map((imageUrl, index) => {
                        const isActive = index === activeImageIndex;
                        const previewImageUrl = detailPreviewImageUrls[index] ?? imageUrl;

                        return (
                          <button
                            key={`${imageUrl}-${index}`}
                            type="button"
                            onClick={() => activateImage(index)}
                            aria-label={`Открыть фото ${index + 1}`}
                            aria-pressed={isActive}
                            className={cn(
                              "relative h-24 w-24 shrink-0 cursor-pointer overflow-hidden rounded-[14px] border-2 bg-white transition-colors md:h-auto md:w-full md:aspect-square",
                              isActive ? "border-[var(--accent)]" : "border-[var(--card-bg)] hover:border-black/15",
                            )}
                          >
                            <DetailImageWithSkeleton
                              src={previewImageUrl}
                              alt=""
                              fill
                              sizes="(max-width: 767px) 96px, (max-width: 1279px) 16vw, 180px"
                              className="object-cover"
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : null}

              <div className={cn("order-1", hasMultipleImages ? "md:order-2 md:col-span-5" : "md:col-span-6")}>
                <div className="relative overflow-hidden rounded-[18px] bg-white md:rounded-[22.5px]">
                  <div
                    className={cn("relative aspect-square", isDesktopViewport ? (isImageZoomed ? "cursor-zoom-out" : "cursor-zoom-in") : null)}
                    onPointerEnter={handleMainImagePointerEnter}
                    onPointerMove={handleMainImagePointerMove}
                    onPointerLeave={handleMainImagePointerLeave}
                  >
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
                          <DetailImageWithSkeleton
                            src={imageUrl}
                            alt={detail.title}
                            fill
                            priority={index === 0}
                            sizes="(max-width: 767px) 100vw, (max-width: 1279px) calc(100vw - 160px), 700px"
                            className={cn(
                              "object-cover transition-transform duration-200 ease-out will-change-transform",
                              isActive && isImageZoomed && isDesktopViewport ? "scale-110" : "scale-100",
                            )}
                            style={
                              isActive && isDesktopViewport
                                ? { transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` }
                                : undefined
                            }
                          />
                          <div
                            aria-hidden="true"
                            className={cn(
                              "pointer-events-none absolute inset-0 hidden transition-opacity duration-200 xl:block",
                              isActive && isImageZoomed && isDesktopViewport ? "opacity-100" : "opacity-0",
                            )}
                          >
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,transparent_58%,rgba(255,255,255,0.08)_100%)]" />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {hasMultipleImages ? (
                    <>
                      <SliderControl
                        mini
                        onPrevClick={showPreviousImage}
                        onNextClick={showNextImage}
                        prevAriaLabel="Предыдущее фото"
                        nextAriaLabel="Следующее фото"
                        className="absolute right-4 bottom-4 z-10 md:hidden"
                      />
                      <SliderControl
                        onPrevClick={showPreviousImage}
                        onNextClick={showNextImage}
                        prevAriaLabel="Предыдущее фото"
                        nextAriaLabel="Следующее фото"
                        className="absolute right-4 bottom-4 z-10 hidden md:flex"
                      />
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-7">
            <div className="space-y-4">
              <div className="space-y-3">
                <h1 className="m-0 font-heading text-3xl leading-[0.96] tracking-[0.01em] text-[var(--heading)] uppercase md:text-6xl">
                  {detail.title}
                </h1>
              </div>

              <div className="grid gap-3 text-sm leading-[1.35] text-[var(--text-muted)] md:text-base">
                <p>Артикул: {detail.article}</p>
                <p className="text-2xl font-semibold leading-none text-[var(--heading)] md:text-[2rem]">{formatRubPrice(detail.priceRub)}</p>
              </div>
            </div>

            {hasVariantChoices ? (
              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--heading)]">Цвета</p>
                <div className="flex flex-wrap gap-3">
                  {detail.variants.map((variant) => {
                    const isActive = variant.id === detail.productId;
                    const formattedColorLabel = formatColorLabel(variant.colorLabel);
                    const previewImageUrl = getPartnerCatalogPreviewImageUrl(variant.imageUrl);

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
                          <DetailImageWithSkeleton src={previewImageUrl} alt={formattedColorLabel} fill sizes="48px" className="object-cover" />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm md:text-base font-medium text-[var(--heading)]">{formattedColorLabel}</span>
                          <span className="block truncate text-xs text-[var(--text-muted)]">арт. {variant.article}</span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
                <p className="text-sm leading-[1.35] text-[var(--text-muted)] md:text-base">Наличие: {detail.stock} шт.</p>
              </div>
            ) : (
              <p className="text-sm leading-[1.35] text-[var(--text-muted)] md:text-base">Наличие: {detail.stock} шт.</p>
            )}

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

      <section className="mb-[35px] md:mb-[45px] rounded-[18px] bg-white p-5 md:rounded-[22.5px] md:p-8">
        <h2 className="mb-5 font-heading text-2xl leading-[0.95] tracking-[0.01em] text-[var(--heading)] uppercase md:text-4xl">
          Подробное описание
        </h2>
        {detail.descriptionHtml ? (
          <SummaryDescription descriptionHtml={detail.descriptionHtml} />
        ) : (
          <DescriptionPlaceholder />
        )}
      </section>

      <RequestCta />
    </>
  );
}
