"use client";

import { RequestCta } from "@/features/request-cta";
import { cn } from "@/shared/lib/cn";
import { useWishlist } from "@/shared/lib/wishlist";
import { buttonVariants } from "@/shared/ui/button";
import { PageHeading } from "@/shared/ui/page-heading";
import { SliderControl } from "@/shared/ui/slider-control";
import { WidowFix } from "@/shared/ui/widow-fix";
import { CheckIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState, type RefObject } from "react";
import { toast } from "sonner";

type PartnerProductItem = {
  title: string;
  imageUrl: string;
  href: string;
  price: string;
  discountPrice?: string;
  article: string;
  stock: number;
  colorThumbnails: string[];
};

const MOBILE_FADE_DURATION_MS = 180;
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

function parseRubPriceToNumber(value: string) {
  const numeric = value.replace(/[^\d]/g, "");
  const parsed = Number.parseInt(numeric, 10);

  return Number.isFinite(parsed) ? parsed : 0;
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

const PARTNER_PRODUCTS: PartnerProductItem[] = [
  {
    title: "Футболки и поло с контрастной отделкой для командных и event-задач",
    imageUrl: "/home/partner-products/01-futbolki-i-polo.png",
    href: "https://gifts.ru/",
    price: "2 490 ₽",
    discountPrice: "1 790 ₽",
    article: "TSH-1001",
    stock: 128,
    colorThumbnails: [
      "/home/partner-products/01-futbolki-i-polo.png",
      "/home/partner-products/02-tolstovki.png",
      "/home/partner-products/03-rubashki.png",
    ],
  },
  {
    title: "Толстовки премиального качества с плотным футером и брендированной фурнитурой",
    imageUrl: "/home/partner-products/02-tolstovki.png",
    href: "https://gifts.ru/",
    price: "3 990 ₽",
    discountPrice: "2 990 ₽",
    article: "HDY-2044",
    stock: 94,
    colorThumbnails: ["/home/partner-products/02-tolstovki.png", "/home/partner-products/06-bombery.png", "/home/partner-products/05-dozhdeviki.png"],
  },
  {
    title: "Рубашки",
    imageUrl: "/home/partner-products/03-rubashki.png",
    href: "https://gifts.ru/",
    price: "4 390 ₽",
    discountPrice: "3 390 ₽",
    article: "SHT-3108",
    stock: 56,
    colorThumbnails: [
      "/home/partner-products/03-rubashki.png",
      "/home/partner-products/10-delovye-aksessuary.png",
      "/home/partner-products/11-suvenirnaya-produkciya.png",
    ],
  },
  {
    title: "Безрукавки",
    imageUrl: "/home/partner-products/04-bezrukavki.png",
    href: "https://gifts.ru/",
    price: "3 690 ₽",
    discountPrice: "2 790 ₽",
    article: "VST-4022",
    stock: 73,
    colorThumbnails: [
      "/home/partner-products/04-bezrukavki.png",
      "/home/partner-products/06-bombery.png",
      "/home/partner-products/07-golovnye-ubory.png",
    ],
  },
  {
    title: "Дождевики",
    imageUrl: "/home/partner-products/05-dozhdeviki.png",
    href: "https://gifts.ru/",
    price: "2 890 ₽",
    discountPrice: "1 990 ₽",
    article: "RNC-5180",
    stock: 211,
    colorThumbnails: [
      "/home/partner-products/05-dozhdeviki.png",
      "/home/partner-products/04-bezrukavki.png",
      "/home/partner-products/08-sumki-i-ryukzaki.png",
    ],
  },
  {
    title: "Бомберы",
    imageUrl: "/home/partner-products/06-bombery.png",
    href: "https://gifts.ru/",
    price: "5 490 ₽",
    discountPrice: "4 190 ₽",
    article: "BMB-6120",
    stock: 39,
    colorThumbnails: [
      "/home/partner-products/06-bombery.png",
      "/home/partner-products/02-tolstovki.png",
      "/home/partner-products/07-golovnye-ubory.png",
    ],
  },
  {
    title: "Головные уборы",
    imageUrl: "/home/partner-products/07-golovnye-ubory.png",
    href: "https://gifts.ru/",
    price: "1 290 ₽",
    discountPrice: "890 ₽",
    article: "HAT-7070",
    stock: 302,
    colorThumbnails: [
      "/home/partner-products/07-golovnye-ubory.png",
      "/home/partner-products/01-futbolki-i-polo.png",
      "/home/partner-products/12-pakety.png",
    ],
  },
  {
    title: "Сумки и рюкзаки",
    imageUrl: "/home/partner-products/08-sumki-i-ryukzaki.png",
    href: "https://gifts.ru/",
    price: "3 290 ₽",
    discountPrice: "2 490 ₽",
    article: "BAG-8135",
    stock: 117,
    colorThumbnails: [
      "/home/partner-products/08-sumki-i-ryukzaki.png",
      "/home/partner-products/12-pakety.png",
      "/home/partner-products/09-elektronika.png",
    ],
  },
  {
    title: "Электроника",
    imageUrl: "/home/partner-products/09-elektronika.png",
    href: "https://gifts.ru/",
    price: "6 990 ₽",
    discountPrice: "5 490 ₽",
    article: "ELC-9210",
    stock: 48,
    colorThumbnails: [
      "/home/partner-products/09-elektronika.png",
      "/home/partner-products/10-delovye-aksessuary.png",
      "/home/partner-products/11-suvenirnaya-produkciya.png",
    ],
  },
  {
    title: "Деловые аксессуары",
    imageUrl: "/home/partner-products/10-delovye-aksessuary.png",
    href: "https://gifts.ru/",
    price: "2 190 ₽",
    discountPrice: "1 590 ₽",
    article: "BUS-1022",
    stock: 166,
    colorThumbnails: [
      "/home/partner-products/10-delovye-aksessuary.png",
      "/home/partner-products/11-suvenirnaya-produkciya.png",
      "/home/partner-products/09-elektronika.png",
    ],
  },
  {
    title: "Сувенирная продукция для корпоративных подарков, welcome-pack и промо-наборов",
    imageUrl: "/home/partner-products/11-suvenirnaya-produkciya.png",
    href: "https://gifts.ru/",
    price: "1 990 ₽",
    discountPrice: "1 390 ₽",
    article: "SUV-1170",
    stock: 247,
    colorThumbnails: [
      "/home/partner-products/11-suvenirnaya-produkciya.png",
      "/home/partner-products/10-delovye-aksessuary.png",
      "/home/partner-products/12-pakety.png",
    ],
  },
  {
    title: "Пакеты",
    imageUrl: "/home/partner-products/12-pakety.png",
    href: "https://gifts.ru/",
    price: "790 ₽",
    discountPrice: "540 ₽",
    article: "PKT-1211",
    stock: 520,
    colorThumbnails: [
      "/home/partner-products/12-pakety.png",
      "/home/partner-products/08-sumki-i-ryukzaki.png",
      "/home/partner-products/11-suvenirnaya-produkciya.png",
    ],
  },
];

function WishlistActionButton({ item }: { item: PartnerProductItem }) {
  const { isInWishlist, addItem, removeItem } = useWishlist();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [quantity, setQuantity] = useState("50");
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const added = isInWishlist(item.article);

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
    const unitPriceRub = parseRubPriceToNumber(item.discountPrice ?? item.price);

    addItem(
      {
        id: item.article,
        articleNumber: item.article,
        title: item.title,
        imageUrl: item.imageUrl,
        unitPriceRub,
      },
      safeQuantity,
    );
    toast.success("Товар добавлен в вишлист");
    setIsPopoverOpen(false);
  }

  function handleMainClick() {
    if (added) {
      removeItem(item.article);
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

function ProductCardImage({ item }: { item: PartnerProductItem }) {
  return (
    <div className="relative aspect-square w-full cursor-pointer overflow-hidden bg-[var(--surface)]">
      <Image src={item.imageUrl} alt={item.title} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover" />
      {item.discountPrice ? (
        <span className="font-heading absolute right-3 top-3 rounded-md bg-[#ff3333] px-[12px] pt-[2px] text-lg uppercase tracking-[0.04em] text-white">
          Скидка
        </span>
      ) : null}
    </div>
  );
}

function ProductCardContent({ item, expandedTitle = false, className }: { item: PartnerProductItem; expandedTitle?: boolean; className?: string }) {
  return (
    <div
      className={cn(
        "flex h-full flex-1 flex-col gap-2 bg-[var(--card-bg)] px-[18px] pt-[10px] pb-[18px] md:px-[22px] md:pt-[12px] md:pb-[22px]",
        expandedTitle ? DESKTOP_CARD_CONTENT_MIN_HEIGHT_CLASS : DESKTOP_CARD_CONTENT_HEIGHT_CLASS,
        className,
      )}
    >
      <div className="flex items-baseline gap-2 font-sans">
        {item.discountPrice ? <span className="text-lg font-semibold text-black">{item.discountPrice}</span> : null}
        <span className={cn("text-base", item.discountPrice ? "text-[#8f8f8f] line-through" : "font-semibold text-black")}>{item.price}</span>
      </div>

      <div className={cn("pt-[2px]", expandedTitle ? DESKTOP_CARD_TITLE_MIN_HEIGHT_CLASS : DESKTOP_CARD_TITLE_HEIGHT_CLASS)}>
        <h3
          className={cn(
            "font-heading text-3xl leading-[1.2] tracking-[0.01em] text-[var(--heading)]",
            expandedTitle ? "block" : "overflow-hidden [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical]",
          )}
        >
          {item.title}
        </h3>
      </div>

      <div className="mt-auto flex flex-col gap-2">
        <div>
          <p className="text-sm text-[var(--text-muted)]">Артикул: {item.article}</p>
          <p className="text-sm text-[var(--text-muted)]">Наличие: {item.stock} шт.</p>
        </div>
        <div className="flex items-center gap-2">
          {item.colorThumbnails.map((thumb, index) => (
            <div key={`${item.article}-thumb-${index}`} className="relative h-10 w-10 cursor-pointer overflow-hidden rounded-[6px] bg-white">
              <Image src={thumb} alt={`${item.title} цвет ${index + 1}`} fill sizes="40px" className="object-cover" />
            </div>
          ))}
        </div>
      </div>

      <WishlistActionButton item={item} />
    </div>
  );
}

function ProductCardBody({ item }: { item: PartnerProductItem }) {
  return (
    <>
      <ProductCardImage item={item} />
      <ProductCardContent item={item} />
    </>
  );
}

function ProductCardShell({
  item,
  expandedTitle = false,
  shadow = false,
  ariaHidden = false,
}: {
  item: PartnerProductItem;
  expandedTitle?: boolean;
  shadow?: boolean;
  ariaHidden?: boolean;
}) {
  return (
    <article
      aria-hidden={ariaHidden || undefined}
      className={cn(
        "overflow-hidden rounded-[18px] bg-[var(--card-bg)] md:rounded-[22.5px]",
        shadow ? "shadow-[0_16px_40px_rgba(42,42,42,0.16)]" : null,
      )}
    >
      <ProductCardImage item={item} />
      <ProductCardContent item={item} expandedTitle={expandedTitle} />
    </article>
  );
}

function PartnerProductCard({ item }: { item: PartnerProductItem }) {
  return (
    <div className="group relative z-0 overflow-visible md:hover:z-20">
      {PRODUCT_CARD_LAYERS.map((layer) => (
        <div key={layer.key} className={layer.wrapperClassName}>
          <div className={layer.innerClassName}>
            <ProductCardShell item={item} {...layer.shellProps} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function PartnerCatalogPage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobileContentVisible, setIsMobileContentVisible] = useState(true);
  const transitionTimeoutRef = useRef<number | null>(null);
  const activeItem = PARTNER_PRODUCTS[activeIndex] ?? PARTNER_PRODUCTS[0];

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current !== null) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
    };
  }, []);

  function commitCardChange(nextIndex: number) {
    if (!PARTNER_PRODUCTS[nextIndex] || nextIndex === activeIndex) {
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

      <section className="my-[63px] md:my-[72px] xl:my-[90px]">
        <div className="flex flex-col md:hidden">
          <article className="flex h-full flex-col overflow-hidden rounded-[18px] bg-white md:rounded-[22.5px]">
            <div className={cn("transition-opacity duration-200", isMobileContentVisible ? "opacity-100" : "opacity-0")}>
              <ProductCardBody item={activeItem} />
            </div>
          </article>
          <SliderControl
            className="mt-5 self-center"
            onPrevClick={() => commitCardChange(activeIndex - 1)}
            onNextClick={() => commitCardChange(activeIndex + 1)}
            prevDisabled={activeIndex === 0}
            nextDisabled={activeIndex === PARTNER_PRODUCTS.length - 1}
            prevAriaLabel={`Предыдущая карточка (${activeIndex + 1} из ${PARTNER_PRODUCTS.length})`}
            nextAriaLabel={`Следующая карточка (${activeIndex + 1} из ${PARTNER_PRODUCTS.length})`}
          />
        </div>

        <div className="hidden overflow-visible items-start gap-7 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {PARTNER_PRODUCTS.map((item) => (
            <PartnerProductCard key={item.article} item={item} />
          ))}
        </div>
      </section>

      <RequestCta />
    </>
  );
}
