"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { siteInfo } from "@/shared/config/site-info";
import { formatPhoneHref } from "@/shared/lib/phone";

export const navLinkClassName =
  "inline-flex items-center justify-center !bg-transparent px-4 py-2 font-medium tracking-[-0.02em] text-[#404040] transition-colors hover:!bg-transparent hover:text-[var(--text-muted)] focus:!bg-transparent focus-visible:!bg-transparent data-active:!bg-transparent";

export const catalogTriggerClassName =
  "h-auto cursor-pointer !bg-transparent px-4 py-2 font-medium tracking-[-0.02em] text-[#404040] shadow-none hover:!bg-transparent hover:!text-[var(--text-muted)] focus:!bg-transparent focus-visible:!bg-transparent data-[popup-open]:!bg-transparent data-[open]:!bg-transparent data-[popup-open]:hover:!bg-transparent data-[open]:hover:!bg-transparent data-[popup-open]:!text-[var(--text-muted)] data-[open]:!text-[var(--text-muted)]";

export const catalogMenuLinkClassName =
  "group flex w-full items-center justify-between !bg-transparent px-5 py-[7px] text-base leading-[1.35] tracking-[-0.04em] text-[#727272] hover:!bg-transparent hover:!text-[var(--accent)] focus:!bg-transparent focus:!text-[var(--accent)] data-active:!bg-transparent data-active:!text-[var(--accent)]";

export const mobileMenuLinkClassName =
  "text-sm leading-[1.35] tracking-[-0.04em] text-[#727272] transition-colors hover:text-[var(--accent)] focus-visible:text-[var(--accent)]";

export const mobilePrimaryLinkClassName =
  "text-sm font-medium leading-[1.35] tracking-[-0.03em] text-[#404040] transition-colors hover:text-[var(--accent)]";

const headerIconLinkClassName =
  "inline-flex items-center justify-center rounded-[6px] bg-[var(--accent)] transition-colors hover:bg-[var(--accent-hover)]";

export const desktopHeaderClassName =
  "sticky top-0 z-30 overflow-hidden px-[var(--layout-side-padding)] backdrop-blur-md transition-shadow duration-300";

export const desktopBackgroundClassName =
  "pointer-events-none absolute inset-0 border-b lg:border-[var(--border)] lg:bg-[var(--surface-header)]/95 lg:opacity-100";

export function scaleFigma(value: number) {
  return Math.round(value * 0.9 * 10) / 10;
}

function getScrollTop() {
  return Math.max(
    window.scrollY,
    document.documentElement.scrollTop,
    document.body.scrollTop,
  );
}

export function isActiveRoute(pathname: string | null, href: string) {
  if (!pathname) {
    return false;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function useScrolledHeader() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const updateScrollState = () => {
      setIsScrolled(getScrollTop() > 0);
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScrollState);
    };
  }, []);

  return isScrolled;
}

export function useLockedBodyScroll(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) {
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousBodyPaddingRight = document.body.style.paddingRight;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.body.style.paddingRight = previousBodyPaddingRight;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [isLocked]);
}

export function useEscapeToClose(isEnabled: boolean, onClose: () => void) {
  useEffect(() => {
    if (!isEnabled) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isEnabled, onClose]);
}

export function HeaderIconLink({
  href,
  ariaLabel,
  iconSrc,
  size,
}: {
  href: string;
  ariaLabel: string;
  iconSrc: string;
  size: number;
}) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      className={headerIconLinkClassName}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      <Image src={iconSrc} alt="" width={20} height={20} className="size-[55%]" aria-hidden="true" />
    </a>
  );
}

export function getPhoneHref() {
  return formatPhoneHref(siteInfo.phone);
}

export function getEmailHref() {
  return `mailto:${siteInfo.email}`;
}
