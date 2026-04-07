"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/shared/ui/navigation-menu";
import { siteNavigation } from "@/shared/config/navigation";
import { siteInfo } from "@/shared/config/site-info";
import { cn } from "@/shared/lib/cn";

const headerNavigation = siteNavigation.filter((item) => item.href !== "/");
const navLinkClassName =
  "text-base tracking-[-0.02em] text-[#404040] transition-colors hover:text-[var(--accent)]";
const contactLinkClassName =
  "cta-link inline-flex min-h-[38px] items-center justify-center whitespace-nowrap rounded-[10px] bg-[var(--accent)] px-[0.56rem] py-[0.55rem] text-[0.88rem]";

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--surface-header)]/95 px-[var(--layout-side-padding)] backdrop-blur-md transition-shadow",
        isScrolled && "shadow-[0_4px_8px_rgba(0,0,0,0.03)]",
      )}
    >
      <div className="flex min-h-[93px] items-center justify-between gap-5 py-4 max-[1280px]:min-h-0">
        <div className="flex min-w-0 items-center gap-8 xl:gap-[6.85rem]">
          <Link href="/" className="inline-flex items-center" aria-label="На главную страницу">
            <Image src="/logo-dm.svg" alt="Держи Марку" width={273} height={37} priority />
          </Link>

          <NavigationMenu
            align="start"
            className="hidden flex-none items-center lg:flex"
            aria-label="Основная навигация"
          >
            <NavigationMenuList className="gap-[2.1rem]">
              {headerNavigation.map((item) => {
                const isActive = pathname?.startsWith(item.href);

                if (!item.children?.length) {
                  return (
                    <NavigationMenuItem key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(navLinkClassName, isActive && "text-[var(--accent)]")}
                      >
                        {item.label}
                      </Link>
                    </NavigationMenuItem>
                  );
                }

                return (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuTrigger
                      className={cn(
                        "h-auto gap-1 rounded-none bg-transparent px-0 py-0 text-base font-medium tracking-[-0.02em] text-[#404040] shadow-none hover:bg-transparent hover:text-[var(--accent)] focus:bg-transparent focus-visible:ring-0 data-[open]:bg-transparent data-[popup-open]:bg-transparent",
                        isActive && "text-[var(--accent)]",
                      )}
                    >
                      {item.label}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="w-[min(580px,calc(100vw-4rem))] rounded-[20px] border border-[var(--border)] bg-[var(--surface)] p-2 shadow-[0_18px_60px_rgba(15,23,42,0.12)]">
                      <div className="grid gap-1 md:grid-cols-2">
                        {item.children.map((child, index) => {
                          const isChildActive = index === 0 && pathname === item.href;

                          return (
                            <NavigationMenuLink
                              key={child.href}
                              href={child.href}
                              className={cn(
                                "flex min-h-[88px] flex-col items-start justify-start gap-1 rounded-[16px] px-4 py-3 text-left hover:bg-[var(--surface-header)] focus:bg-[var(--surface-header)]",
                                isChildActive && "bg-[var(--surface-header)]",
                              )}
                            >
                              <span className="text-sm font-medium text-[var(--heading)]">
                                {child.label}
                              </span>
                              {child.description ? (
                                <span className="text-xs leading-5 text-[var(--text-muted)]">
                                  {child.description}
                                </span>
                              ) : null}
                            </NavigationMenuLink>
                          );
                        })}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="hidden flex-wrap items-center justify-end gap-2 lg:flex">
          <div className="inline-flex gap-2" aria-label="Социальные сети">
            {siteInfo.socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="inline-flex size-[38px] overflow-hidden rounded-[10px]"
                aria-label={social.label}
              >
                <Image src={social.iconSrc} alt="" width={38} height={38} aria-hidden="true" />
              </a>
            ))}
          </div>
          <a href={`mailto:${siteInfo.email}`} className={contactLinkClassName}>
            {siteInfo.email}
          </a>
          <a href={`tel:${siteInfo.phone.replace(/\D+/g, "")}`} className={contactLinkClassName}>
            {siteInfo.phone}
          </a>
        </div>
      </div>
    </header>
  );
}
