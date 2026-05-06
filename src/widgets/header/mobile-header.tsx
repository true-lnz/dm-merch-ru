import type { HeaderNavigationItem } from "@/shared/config/navigation";
import { useSiteInfo } from "@/shared/config/site-info/site-info-provider";
import { cn } from "@/shared/lib/cn";
import { ContactPills } from "@/shared/ui/contact-pills";
import { TransitionLink } from "@/shared/ui/page-transition";
import { SocialLinks } from "@/shared/ui/social-links";
import { WishlistTrigger } from "@/shared/ui/wishlist-trigger";
import { ChevronDownIcon, XIcon } from "lucide-react";
import Image from "next/image";
import {
  HeaderIconLink,
  isActiveRoute,
  mobileMenuLinkClassName,
  mobilePrimaryLinkClassName,
  scaleFigma,
  useEmailHref,
  usePhoneHref,
} from "./header.shared";

function MobileHeaderActions({
  onOpenMenu,
  onOpenWishlist,
  showWishlist,
  wishlistCount,
}: {
  onOpenMenu: () => void;
  onOpenWishlist: () => void;
  showWishlist: boolean;
  wishlistCount: number;
}) {
  const phoneHref = usePhoneHref();
  const emailHref = useEmailHref();
  const actionSize = scaleFigma(28);
  const burgerWidth = scaleFigma(50);
  const burgerHeight = scaleFigma(28);

  return (
    <div className="flex items-center gap-2 lg:hidden">
      {showWishlist ? (
        <WishlistTrigger
          count={wishlistCount}
          variant="mobile-header"
          onClick={onOpenWishlist}
          style={{ width: `${actionSize}px`, height: `${actionSize}px` }}
        />
      ) : null}
      <div className="hidden min-[360px]:flex items-center gap-2">
        <HeaderIconLink href={phoneHref} ariaLabel="Позвонить" iconSrc="/icons/ic_contact_pill_phone.png" size={actionSize} />
        <HeaderIconLink href={emailHref} ariaLabel="Написать на email" iconSrc="/icons/ic_contact_pill_mail.png" size={actionSize} />
      </div>
      <button
        type="button"
        className="inline-flex items-center justify-center transition-transform hover:scale-[1.02]"
        onClick={onOpenMenu}
        aria-label="Открыть меню"
        aria-controls="mobile-header-menu"
      >
        <Image
          src="/icons/ic_menu_header.svg"
          alt=""
          width={50}
          height={28}
          aria-hidden="true"
          style={{ width: `${burgerWidth}px`, height: `${burgerHeight}px` }}
        />
      </button>
    </div>
  );
}

export function MobileMenu({
  pathname,
  isOpen,
  isCatalogOpen,
  catalogItem,
  wishlistCount,
  showWishlist,
  mobilePrimaryLinks,
  onToggleCatalog,
  onCloseMenu,
  onOpenWishlist,
}: {
  pathname: string | null;
  isOpen: boolean;
  isCatalogOpen: boolean;
  catalogItem?: HeaderNavigationItem;
  wishlistCount: number;
  showWishlist: boolean;
  mobilePrimaryLinks: HeaderNavigationItem[];
  onToggleCatalog: () => void;
  onCloseMenu: () => void;
  onOpenWishlist: () => void;
}) {
  const siteInfo = useSiteInfo();

  if (!isOpen) {
    return null;
  }

  const isCatalogActive = catalogItem ? isActiveRoute(pathname, catalogItem.href) : false;

  return (
    <>
      <div className="fixed inset-0 z-40 bg-[#232323]/24 backdrop-blur-[10px] lg:hidden" onClick={onCloseMenu} aria-hidden="true" />

      <div
        id="mobile-header-menu"
        className="fixed inset-0 z-1001 overflow-y-auto bg-[var(--bg)] lg:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Мобильное меню"
      >
        <div className="min-h-full px-[var(--layout-side-padding)] pt-8">
          <div className="mb-8 flex justify-end">
            <button
              type="button"
              className="inline-flex w-fit items-center justify-center text-[#9b9b9b] transition-colors hover:text-[var(--text)]"
              onClick={onCloseMenu}
              aria-label="Закрыть меню"
            >
              <XIcon className="size-[18px]" strokeWidth={2.5} />
            </button>
          </div>

          {showWishlist ? (
            <div className="mb-6">
              <WishlistTrigger
                count={wishlistCount}
                variant="mobile-menu"
                className="-mx-1 flex w-[calc(100%+1rem)] justify-between"
                onClick={() => {
                  onCloseMenu();
                  onOpenWishlist();
                }}
              />
            </div>
          ) : null}

          <nav aria-label="Навигация мобильного меню" className="mt-1">
            <ul className="grid gap-4">
              {catalogItem ? (
                <li className="border-b border-[var(--border)] pb-4">
                  <button
                    type="button"
                    className={cn(
                      "flex w-full items-center justify-between text-left text-sm font-medium leading-[1.35] tracking-[-0.03em] text-[#404040] transition-colors hover:text-[var(--accent)]",
                      isCatalogActive && "text-[var(--accent)]",
                    )}
                    onClick={onToggleCatalog}
                    aria-expanded={isCatalogOpen}
                    aria-controls="mobile-catalog-submenu"
                  >
                    <span>{catalogItem.label}</span>
                    <ChevronDownIcon
                      className={cn("size-4 shrink-0 transition-transform duration-200", isCatalogOpen && "rotate-180")}
                      strokeWidth={1.8}
                    />
                  </button>

                  <div
                    id="mobile-catalog-submenu"
                    className={cn(
                      "grid transition-[grid-template-rows,opacity,margin] duration-200 ease-out",
                      isCatalogOpen ? "mt-4 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0",
                    )}
                  >
                    <ul className="grid gap-[14px] overflow-hidden">
                      {catalogItem.children?.map((item) => (
                        <li key={item.href}>
                          <TransitionLink
                            href={item.href}
                            source="menu"
                            className={cn(mobileMenuLinkClassName, item.label === "Каталог продукции" && "font-semibold text-[#404040]")}
                            onClick={onCloseMenu}
                          >
                            {item.label}
                          </TransitionLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ) : null}

              {mobilePrimaryLinks.map((item) => {
                const isActive = isActiveRoute(pathname, item.href);

                return (
                  <li key={item.href}>
                    <TransitionLink
                      href={item.href}
                      source="menu"
                      className={cn(mobilePrimaryLinkClassName, isActive && "text-[var(--accent)]")}
                      onClick={onCloseMenu}
                    >
                      {item.label}
                    </TransitionLink>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="my-10 flex flex-col items-start gap-4">
            <SocialLinks size="menu" />
            <ContactPills email={siteInfo.email} phone={siteInfo.phone} variant="menu" className="gap-[9px]" />
            <p className="text-sm leading-[1.35] tracking-[-0.04em] text-[#404040]">Офис: {siteInfo.address}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export function MobileHeaderBar({
  onOpenMenu,
  onOpenWishlist,
  showWishlist,
  wishlistCount,
}: {
  onOpenMenu: () => void;
  onOpenWishlist: () => void;
  showWishlist: boolean;
  wishlistCount: number;
}) {
  return (
    <div className="relative z-10 flex min-h-[80px] items-center justify-between gap-5 py-3 lg:hidden">
      <TransitionLink href="/" source="header" className="inline-flex items-center" aria-label="На главную страницу">
        <Image src="/logo-dm.svg" alt="Держи Марку" width={273} height={37} className="h-auto w-[178px]" />
      </TransitionLink>

      <MobileHeaderActions onOpenMenu={onOpenMenu} onOpenWishlist={onOpenWishlist} showWishlist={showWishlist} wishlistCount={wishlistCount} />
    </div>
  );
}
