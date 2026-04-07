"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { siteNavigation } from "@/shared/config/navigation";
import { siteInfo } from "@/shared/config/site-info";
import { cn } from "@/shared/lib/cn";
import { ContactPills } from "@/shared/ui/contact-pills";

const headerNavigation = siteNavigation.filter((item) => item.href !== "/");

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
        "site-header sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--surface-header)]/95 backdrop-blur-md",
        isScrolled && "is-scrolled",
      )}
    >
      <div className="header-layout">
        <div className="header-left">
          <Link href="/" className="header-logo" aria-label="На главную страницу">
            <Image src="/logo-dm.svg" alt="Держи Марку" width={273} height={37} priority />
          </Link>

          <nav aria-label="Основная навигация" className="header-nav">
            {headerNavigation.map((item) => {
              const isActive = pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn("header-nav-link", isActive && "is-active")}
                >
                  <span className="header-nav-item">
                    <span>{item.label}</span>
                    {item.href === "/catalog" ? (
                      <svg
                        className="header-nav-chevron"
                        width="8"
                        height="5"
                        viewBox="0 0 10 6"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          d="M1 1L5 5L9 1"
                          stroke="currentColor"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : null}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="header-contacts">
          <div className="header-socials" aria-label="Социальные сети">
            <a href="#" className="header-social-link" aria-label="VK">
              <Image src="/social-vk.svg" alt="" width={38} height={38} aria-hidden="true" />
            </a>
            <a href="#" className="header-social-link" aria-label="MAX">
              <Image src="/social-max.svg" alt="" width={38} height={38} aria-hidden="true" />
            </a>
          </div>
          <ContactPills
            email={siteInfo.email}
            phone={siteInfo.phone}
            variant="header"
          />
        </div>
      </div>
    </header>
  );
}
