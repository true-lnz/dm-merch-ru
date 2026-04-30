"use client";

import { cn } from "@/shared/lib/cn";
import { openWishlistDialog, useWishlist } from "@/shared/lib/wishlist";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/shared/ui/dialog";
import { TransitionLink } from "@/shared/ui/page-transition";
import { WishlistTrigger } from "@/shared/ui/wishlist-trigger";
import { CatalogCategoryIcon } from "@/widgets/catalog-products-categories";
import type { CatalogProductsLandingCategory } from "@/widgets/catalog-products/model/types";
import { ChevronDownIcon, ChevronRightIcon, LayoutGridIcon, SearchIcon, XIcon } from "lucide-react";
import { type ChangeEvent, type RefObject, useEffect, useMemo, useRef, useState } from "react";

type CatalogProductsBottomBarProps = {
  categories: CatalogProductsLandingCategory[];
};

type SearchResultItem = {
  id: string;
  href: string;
  categoryTitle: string;
  subcategoryTitle: string;
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

export function CatalogProductsBottomBar({ categories }: CatalogProductsBottomBarProps) {
  const { count: wishlistCount } = useWishlist();
  const [isDesktopCategoryMenuOpen, setIsDesktopCategoryMenuOpen] = useState(false);
  const [isMobileCategoryDialogOpen, setIsMobileCategoryDialogOpen] = useState(false);
  const [activeDesktopCategoryId, setActiveDesktopCategoryId] = useState(categories[0]?.id ?? "");
  const [expandedMobileCategoryId, setExpandedMobileCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const categoryMenuRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLDivElement | null>(null);

  const normalizedQuery = searchQuery.trim().toLocaleLowerCase("ru");
  const searchResults = useMemo<SearchResultItem[]>(() => {
    return categories.flatMap((category) =>
      category.subcategories.map((subcategory) => ({
        id: subcategory.id,
        href: subcategory.href,
        categoryTitle: category.title,
        subcategoryTitle: subcategory.title,
      })),
    );
  }, [categories]);

  const filteredResults = useMemo(() => {
    if (!normalizedQuery) {
      return [];
    }

    return searchResults.filter((item) => item.subcategoryTitle.toLocaleLowerCase("ru").includes(normalizedQuery));
  }, [normalizedQuery, searchResults]);

  const isSearchResultsOpen = isSearchFocused && normalizedQuery.length > 0;
  const resolvedActiveDesktopCategoryId = categories.some((category) => category.id === activeDesktopCategoryId)
    ? activeDesktopCategoryId
    : (categories[0]?.id ?? "");
  const resolvedExpandedMobileCategoryId =
    expandedMobileCategoryId && categories.some((category) => category.id === expandedMobileCategoryId) ? expandedMobileCategoryId : null;
  const activeDesktopCategory = categories.find((category) => category.id === resolvedActiveDesktopCategoryId) ?? categories[0] ?? null;

  useOutsideClick(categoryMenuRef, () => setIsDesktopCategoryMenuOpen(false), isDesktopCategoryMenuOpen);
  useOutsideClick(searchRef, () => setIsSearchFocused(false), isSearchResultsOpen);

  useEffect(() => {
    function handleResize() {
      if (window.matchMedia("(min-width: 768px)").matches) {
        setIsMobileCategoryDialogOpen(false);
        return;
      }

      setIsDesktopCategoryMenuOpen(false);
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    setSearchQuery(event.target.value);
    setIsSearchFocused(true);
  }

  function handleNavigateFromOverlay() {
    setIsDesktopCategoryMenuOpen(false);
    setIsMobileCategoryDialogOpen(false);
    setIsSearchFocused(false);
  }

  function handleCategoryTriggerClick() {
    if (window.matchMedia("(max-width: 767px)").matches) {
      setIsMobileCategoryDialogOpen(true);
      return;
    }

    setIsDesktopCategoryMenuOpen((open) => {
      const nextOpen = !open;

      if (nextOpen && categories[0]) {
        setActiveDesktopCategoryId((current) => current || categories[0].id);
      }

      return nextOpen;
    });
  }

  return (
    <>
      <section className="sticky top-0 z-30">
        <div className="relative left-[calc(var(--layout-side-padding)*-1)] w-[calc(100%+var(--layout-side-padding)*2)] border-b border-[rgba(42,42,42,0.08)] bg-white/95 px-[var(--layout-side-padding)] shadow-[0_10px_24px_rgba(42,42,42,0.06)] backdrop-blur-md">
          <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 py-3 md:gap-4">
            <div className="relative" ref={categoryMenuRef}>
              <button
                type="button"
                onClick={handleCategoryTriggerClick}
                className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-[10px] border border-[rgba(42,42,42,0.08)] bg-white px-3 text-base font-medium leading-none tracking-[-0.03em] text-[#404040] transition-colors hover:bg-[#f4f3ee]"
                aria-expanded={isDesktopCategoryMenuOpen || isMobileCategoryDialogOpen}
                aria-haspopup="menu"
                aria-label="Открыть категории"
              >
                <LayoutGridIcon className="size-4 shrink-0 text-[var(--accent)]" strokeWidth={1.8} />
                <span className="hidden sm:inline">Категория</span>
                <ChevronDownIcon
                  className={cn(
                    "size-4 shrink-0 transition-transform duration-200",
                    (isDesktopCategoryMenuOpen || isMobileCategoryDialogOpen) && "rotate-180",
                  )}
                  strokeWidth={1.8}
                />
              </button>

              {isDesktopCategoryMenuOpen && activeDesktopCategory ? (
                <div className="absolute left-0 top-[calc(100%+24px)] z-40 hidden md:block">
                  <div className="relative flex">
                    <div className="w-[520px] overflow-hidden rounded-[18px] border border-[rgba(42,42,42,0.08)] bg-white p-2 shadow-[0_20px_50px_rgba(42,42,42,0.16)]">
                      <div className="grid grid-cols-2 gap-1">
                        {categories.map((category) => {
                          const isActive = category.id === activeDesktopCategory.id;

                          return (
                            <button
                              key={category.id}
                              type="button"
                              onMouseEnter={() => setActiveDesktopCategoryId(category.id)}
                              onFocus={() => setActiveDesktopCategoryId(category.id)}
                              className={cn(
                                "flex w-full cursor-pointer items-center gap-2 rounded-[10px] px-2.5 py-2 text-left transition-colors",
                                isActive ? "bg-[var(--card-bg)]" : "hover:bg-[var(--card-bg)]/55",
                              )}
                            >
                              <CatalogCategoryIcon iconId={category.iconId} monochrome className="h-6 w-8 text-[var(--accent)] md:h-6 md:w-8" />
                              <span className="min-w-0 flex-1 text-sm font-medium leading-[1.25] tracking-[-0.03em] text-[var(--heading)]">
                                {category.title}
                              </span>
                              <ChevronRightIcon className="size-4 shrink-0 text-[var(--text-muted)]" strokeWidth={1.8} />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="ml-2 w-[520px] overflow-hidden rounded-[18px] border border-[rgba(42,42,42,0.08)] bg-white p-2 shadow-[0_20px_50px_rgba(42,42,42,0.16)]">
                      <div className="px-2.5 py-1.5">
                        <p className="text-sm font-semibold tracking-[-0.03em] text-[var(--heading)]">{activeDesktopCategory.title}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        {activeDesktopCategory.subcategories.map((subcategory) => (
                          <TransitionLink
                            key={subcategory.id}
                            href={subcategory.href}
                            source="menu"
                            onClick={handleNavigateFromOverlay}
                            className="cursor-pointer rounded-[10px] px-2.5 py-2 text-sm leading-[1.3] tracking-[-0.03em] text-[var(--heading)] transition-colors hover:bg-[var(--card-bg)] hover:text-[var(--accent)]"
                          >
                            {subcategory.title}
                          </TransitionLink>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="relative  xl:min-w-[50vw] xl:mx-auto" ref={searchRef}>
              <label className="relative block">
                <SearchIcon
                  className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[var(--text-muted)]"
                  strokeWidth={1.8}
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setIsSearchFocused(true)}
                  placeholder="Поиск"
                  className="h-10 w-full rounded-[10px] border border-[rgba(42,42,42,0.08)] bg-[#f7f6f2] pl-9 pr-3 text-base font-medium leading-none tracking-[-0.03em] text-[#404040] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--accent)]"
                  aria-label="Поиск по подкатегориям"
                />
              </label>

              {isSearchResultsOpen ? (
                <div className="absolute left-[calc(var(--layout-side-padding)*-1-48px)] right-[calc(var(--layout-side-padding)*-1)] top-[calc(100%+24px)] z-40 overflow-hidden rounded-[16px] border border-[rgba(42,42,42,0.08)] bg-white shadow-[0_20px_50px_rgba(42,42,42,0.16)] md:left-0 md:right-auto md:top-[calc(100%+22.5px)] w-[86vw] md:w-full">
                  {filteredResults.length > 0 ? (
                    <div className="max-h-[min(60vh,420px)] overflow-y-auto p-2">
                      {filteredResults.map((item) => (
                        <TransitionLink
                          key={item.id}
                          href={item.href}
                          source="menu"
                          onClick={handleNavigateFromOverlay}
                          className="block rounded-[10px] px-3 py-2 text-sm leading-[1.35] tracking-[-0.03em] text-[var(--heading)] transition-colors hover:bg-[var(--card-bg)]"
                        >
                          <span className="text-[var(--text-muted)]">{item.categoryTitle}</span>
                          <span className="text-[var(--text-muted)]"> / </span>
                          <span>{item.subcategoryTitle}</span>
                        </TransitionLink>
                      ))}
                    </div>
                  ) : (
                    <div className="px-3 py-3 text-sm text-[var(--text-muted)]">Ничего не найдено</div>
                  )}
                </div>
              ) : null}
            </div>

            <WishlistTrigger count={wishlistCount} variant="desktop" onClick={openWishlistDialog} className="h-10 whitespace-nowrap px-3" />
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
              aria-label="Закрыть категории"
            >
              <XIcon className="size-5" strokeWidth={2.5} />
            </DialogClose>
          </div>

          <div className="rounded-[18px] bg-white p-4">
            {categories.map((category) => {
              const isExpanded = resolvedExpandedMobileCategoryId === category.id;

              return (
                <div key={category.id} className="border-b border-black/10 py-1 last:border-b-0">
                  <button
                    type="button"
                    onClick={() => setExpandedMobileCategoryId((current) => (current === category.id ? null : category.id))}
                    className="flex w-full cursor-pointer items-center gap-3 py-2 text-left"
                    aria-expanded={isExpanded}
                  >
                    <CatalogCategoryIcon iconId={category.iconId} monochrome className="h-6 w-8 text-[var(--accent)] md:h-6 md:w-8" />
                    <span className="min-w-0 flex-1 text-sm font-medium leading-[1.25] tracking-[-0.03em] text-[#404040]">{category.title}</span>
                    <ChevronDownIcon
                      className={cn("size-4 shrink-0 text-[var(--text-muted)] transition-transform duration-200", isExpanded && "rotate-180")}
                      strokeWidth={1.8}
                    />
                  </button>

                  <div
                    className={cn(
                      "grid transition-[grid-template-rows,opacity,margin] duration-200 ease-out",
                      isExpanded ? "mt-1 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <div className="overflow-hidden">
                      <div className="space-y-1 pl-[45px] pb-2">
                        {category.subcategories.map((subcategory) => (
                          <TransitionLink
                            key={subcategory.id}
                            href={subcategory.href}
                            source="menu"
                            onClick={handleNavigateFromOverlay}
                            className="block cursor-pointer py-1.5 text-sm leading-[1.3] tracking-[-0.03em] text-[#6f6f6f] transition-colors hover:text-black"
                          >
                            {subcategory.title}
                          </TransitionLink>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
