"use client";

import { RequestCta } from "@/features/request-cta";
import { cn } from "@/shared/lib/cn";
import { WidowFix } from "@/shared/ui/widow-fix";
import { FaqSection } from "@/widgets/faq-section";
import { useCallback, useMemo, useRef, useState } from "react";
import { PageHeading } from "../../../shared/ui/page-heading";
import type { CaseItem, CaseThemeFilter } from "../model/cases-types";
import { CaseCard } from "./case-card";

type CasesPageProps = {
  items: CaseItem[];
  themes: CaseThemeFilter[];
  title?: string;
};

const ALL_CASES_THEME = "all";

export function CasesPage({ items, themes, title = "Кейсы" }: CasesPageProps) {
  const [activeTheme, setActiveTheme] = useState<string>(ALL_CASES_THEME);
  const listStartRef = useRef<HTMLDivElement | null>(null);

  const visibleCases = useMemo(() => {
    if (activeTheme === ALL_CASES_THEME) {
      return items;
    }

    return items.filter((item) => item.themeSlug === activeTheme);
  }, [activeTheme, items]);

  const themeButtons = useMemo(
    () => [{ slug: ALL_CASES_THEME, label: "Все кейсы" }, ...themes],
    [themes],
  );

  const handleThemeChange = useCallback(
    (themeSlug: string) => {
      if (themeSlug === activeTheme) {
        return;
      }

      setActiveTheme(themeSlug);
      listStartRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [activeTheme],
  );

  return (
    <>
      <WidowFix />
      <PageHeading
        title={title}
        breadcrumb={{
          labelFrom: "Главная",
          labelTo: title,
          href: "/",
        }}
      />

      <section className="mb-[35px] md:mb-[45px] mt-[28.8px] grid gap-6 xl:grid-cols-[245.7px_minmax(0,1fr)] xl:gap-[63px]">
        <aside className="-mr-[var(--layout-side-padding)] overflow-hidden xl:sticky xl:top-28 xl:self-start lg:mr-0">
          <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden xl:grid xl:gap-[18px] xl:overflow-visible xl:pb-0">
            {themeButtons.map((theme) => {
              const isActive = activeTheme === theme.slug;

              return (
                <button
                  key={theme.slug}
                  type="button"
                  onClick={() => handleThemeChange(theme.slug)}
                  className={cn(
                    "flex min-h-[60px] md:min-h-[90px] w-[75%] shrink-0 cursor-pointer snap-start flex-col items-start justify-center md:justify-start rounded-[18px] px-[18px] py-4 text-left font-heading text-xl md:text-3xl leading-[0.95] uppercase transition-colors xl:w-full",
                    isActive ? "bg-[var(--accent)] text-white" : "bg-[var(--card-bg)] text-[#404040] hover:bg-[#e1e0db]",
                  )}
                >
                  {theme.label}
                </button>
              );
            })}
          </div>
        </aside>

        <div ref={listStartRef} className="space-y-[40px] md:space-y-[22px] scroll-mt-[88px] md:scroll-mt-[112px]">
          {visibleCases.length > 0 ? (
            visibleCases.map((item) => <CaseCard key={item.id} item={item} />)
          ) : (
            <div className="rounded-[18px] bg-[var(--card-bg)] p-4 text-xs leading-[1.4] text-[var(--text-muted)] md:px-4 md:py-6">
              К сожалению, для этого фильтра пока нет карточек кейсов.
            </div>
          )}
        </div>
      </section>

      <FaqSection />
      <RequestCta />
    </>
  );
}
