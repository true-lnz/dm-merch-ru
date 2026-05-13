"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { HeaderNavigationItem } from "@/shared/config/navigation";
import { subscribeToWishlistDialogOpen, useWishlist } from "@/shared/lib/wishlist";
import { cn } from "@/shared/lib/cn";
import { DesktopHeader } from "./desktop-header";
import {
  desktopBackgroundClassName,
  desktopHeaderClassName,
  useEscapeToClose,
  useLockedBodyScroll,
  useScrolledHeader,
} from "./header.shared";
import { MobileHeaderBar, MobileMenu } from "./mobile-header";
import { WishlistDialog } from "./wishlist-dialog";

export function HeaderClient({ headerNavigation }: { headerNavigation: HeaderNavigationItem[] }) {
  const pathname = usePathname();
  const isPartnerCatalogPage = pathname.startsWith("/partner-catalog");
  const isCatalogProductsPage = pathname.startsWith("/catalog-products");
  const shouldMountWishlistDialog = isPartnerCatalogPage || isCatalogProductsPage;
  const isScrolled = useScrolledHeader();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const { count: wishlistCount } = useWishlist();

  const catalogItem = headerNavigation.find((item) => item.children);
  const mobilePrimaryLinks = headerNavigation.filter((item) => !item.children);

  const closeMenu = () => {
    setIsCatalogOpen(false);
    setIsMenuOpen(false);
  };

  const openMenu = () => {
    setIsCatalogOpen(false);
    setIsMenuOpen(true);
  };

  const openWishlist = () => {
    setIsWishlistOpen(true);
  };

  useLockedBodyScroll(isMenuOpen);
  useEscapeToClose(isMenuOpen, closeMenu);

  useEffect(() => subscribeToWishlistDialogOpen(() => setIsWishlistOpen(true)), []);

  return (
    <>
      <header
        className={cn(
          desktopHeaderClassName,
          isCatalogProductsPage && "!static",
          isScrolled ? "shadow-[0_12px_30px_rgba(42,42,42,0.05)]" : "shadow-none",
        )}
      >
        <div
          aria-hidden="true"
          className={cn(
            desktopBackgroundClassName,
            isScrolled
              ? "border-[var(--border)] bg-[var(--surface-header)]/95 opacity-100"
              : "border-transparent bg-[var(--surface-header)] opacity-0",
          )}
        />

        <DesktopHeader
          pathname={pathname}
          headerNavigation={headerNavigation}
          showWishlist={isPartnerCatalogPage}
          wishlistCount={wishlistCount}
          onOpenWishlist={openWishlist}
        />

        <MobileHeaderBar
          onOpenMenu={openMenu}
          onOpenWishlist={openWishlist}
          showWishlist={isPartnerCatalogPage}
          wishlistCount={wishlistCount}
        />
      </header>

      <MobileMenu
        pathname={pathname}
        isOpen={isMenuOpen}
        isCatalogOpen={isCatalogOpen}
        catalogItem={catalogItem}
        wishlistCount={wishlistCount}
        showWishlist={isPartnerCatalogPage}
        mobilePrimaryLinks={mobilePrimaryLinks}
        onToggleCatalog={() => setIsCatalogOpen((open) => !open)}
        onCloseMenu={closeMenu}
        onOpenWishlist={openWishlist}
      />

      {shouldMountWishlistDialog ? <WishlistDialog open={isWishlistOpen} onOpenChange={setIsWishlistOpen} /> : null}
    </>
  );
}

