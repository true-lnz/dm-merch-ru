"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { headerNavigation } from "@/shared/config/navigation";
import { useWishlist } from "@/shared/lib/wishlist";
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

export function Header() {
  const pathname = usePathname();
  const isPartnerCatalogPage = pathname.startsWith("/partner-catalog");
  const isScrolled = useScrolledHeader();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
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

  useLockedBodyScroll(isMenuOpen);
  useEscapeToClose(isMenuOpen, closeMenu);

  return (
    <>
      <header
        className={cn(
          desktopHeaderClassName,
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

        <DesktopHeader pathname={pathname} showWishlist={isPartnerCatalogPage} />

        <MobileHeaderBar onOpenMenu={openMenu} />
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
      />
    </>
  );
}
