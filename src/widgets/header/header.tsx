"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { headerNavigation } from "@/shared/config/navigation";
import { cn } from "@/shared/lib/cn";
import { buttonVariants } from "@/shared/ui/button";
import { SiteContacts } from "@/shared/ui/site-contacts";

const navLinkClassName = buttonVariants({
  variant: "ghost",
  size: "sm",
  className:
    "h-auto rounded-full px-4 py-2 text-base font-medium tracking-[-0.02em] text-[#404040] hover:bg-white hover:text-[var(--accent)]",
});

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

          <nav aria-label="Основная навигация" className="hidden lg:block">
            <ul className="flex items-center gap-2">
              {headerNavigation.map((item) => {
                const isActive = isActiveRoute(pathname, item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        navLinkClassName,
                        isActive && "bg-white text-[var(--accent)] hover:bg-white",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <SiteContacts className="hidden lg:flex" />
      </div>
    </header>
  );
}