"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRightIcon } from "lucide-react";
import { headerNavigation } from "@/shared/config/navigation";
import { cn } from "@/shared/lib/cn";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/shared/ui/navigation-menu";
import { SiteContacts } from "@/shared/ui/site-contacts";

const navLinkClassName =
  "inline-flex items-center justify-center !bg-transparent px-4 py-2 text-base font-medium tracking-[-0.02em] text-[#404040] transition-colors hover:!bg-transparent hover:text-[var(--text-muted)] focus:!bg-transparent focus-visible:!bg-transparent data-active:!bg-transparent";

const catalogTriggerClassName =
  "h-auto !bg-transparent px-4 py-2 text-base font-medium tracking-[-0.02em] text-[#404040] shadow-none hover:!bg-transparent hover:!text-[var(--text-muted)] focus:!bg-transparent focus-visible:!bg-transparent data-[popup-open]:!bg-transparent data-[open]:!bg-transparent data-[popup-open]:hover:!bg-transparent data-[open]:hover:!bg-transparent data-[popup-open]:!text-[var(--text-muted)] data-[open]:!text-[var(--text-muted)]";

const catalogMenuLinkClassName =
  "group flex w-full items-center justify-between !bg-transparent px-5 py-[7px] text-[14px] leading-[1.35] tracking-[-0.04em] text-[#727272] hover:!bg-transparent hover:!text-[var(--accent)] focus:!bg-transparent focus:!text-[var(--accent)] data-active:!bg-transparent data-active:!text-[var(--accent)]";

function isActiveRoute(pathname: string | null, href: string) {
  if (!pathname) {
    return false;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--surface-header)]/95 px-[var(--layout-side-padding)] backdrop-blur-md">
      <div className="flex min-h-[93px] items-center justify-between gap-5 py-4 max-[1280px]:min-h-0">
        <div className="flex min-w-0 items-center gap-8 xl:gap-[6.85rem]">
          <Link href="/" className="inline-flex items-center" aria-label="На главную страницу">
            <Image src="/logo-dm.svg" alt="Держи Марку" width={273} height={37} priority />
          </Link>

          <NavigationMenu
            aria-label="Основная навигация"
            className="hidden lg:flex max-w-none"
            positionerClassName="z-20 transition-none"
            popupClassName="overflow-hidden rounded-b-[14px] rounded-t-none bg-white shadow-[0px_10px_22px_0px_rgba(0,0,0,0.08)] ring-0"
          >
            <NavigationMenuList className="gap-2">
              {headerNavigation.map((item) => {
                const isActive = isActiveRoute(pathname, item.href);

                return (
                  <NavigationMenuItem key={item.href}>
                    {item.children ? (
                      <>
                        <NavigationMenuTrigger
                          className={cn(
                            catalogTriggerClassName,
                            isActive && "!text-[var(--text-muted)]",
                          )}
                        >
                          {item.label}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent className="w-[220px] rounded-b-[14px] rounded-t-none bg-white p-0 shadow-none ring-0">
                          <div className="py-[13px]">
                            {item.children.map((child) => (
                              <NavigationMenuLink
                                key={child.href}
                                render={<Link href={child.href} />}
                                className={catalogMenuLinkClassName}
                              >
                                <span>{child.label}</span>
                                <ChevronRightIcon strokeWidth={1.5} className="size-4 shrink-0 translate-x-[-6px] opacity-0 transition-all duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 group-data-active:translate-x-0 group-data-active:opacity-100" />
                              </NavigationMenuLink>
                            ))}
                          </div>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <NavigationMenuLink
                        render={<Link href={item.href} />}
                        data-active={isActive ? "" : undefined}
                        aria-current={isActive ? "page" : undefined}
                        className={cn(
                          navLinkClassName,
                          isActive && "text-[var(--accent)] hover:text-[--accent-hover]",
                        )}
                      >
                        {item.label}
                      </NavigationMenuLink>
                    )}
                  </NavigationMenuItem>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <SiteContacts className="hidden lg:flex" />
      </div>
    </header>
  );
}
