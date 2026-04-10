"use client";

import { useMemo, useState } from "react";
import { cn } from "@/shared/lib/cn";
import { PageHeader } from "@/shared/ui/page-header";
import { FaqSection } from "@/widgets/faq-section";
import { RequestCta } from "@/widgets/request-cta";
import { CaseCard } from "./case-card";
import {
  casesPageItems,
  caseThemes,
  type CaseTheme,
} from "../model/cases-data";

export function CasesPage() {
  const [activeTheme, setActiveTheme] = useState<CaseTheme>("Все кейсы");

  const visibleCases = useMemo(() => {
    if (activeTheme === "Все кейсы") {
      return casesPageItems;
    }

    return casesPageItems.filter((item) => item.theme === activeTheme);
  }, [activeTheme]);

  return (
    <div className="page pb-16 md:pb-24">
      <PageHeader
        title="Кейсы"
        breadcrumbs={[
          { label: "Главная", href: "/" },
          { label: "Кейсы" },
        ]}
      />

      <section className="mt-8 grid gap-6 xl:grid-cols-[245.7px_minmax(0,1fr)] xl:gap-[63px]">
        <aside className="-mr-[var(--layout-side-padding)] overflow-hidden xl:sticky xl:top-28 xl:self-start lg:mr-0">
          <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden xl:grid xl:gap-[18px] xl:overflow-visible xl:pb-0">
            {caseThemes.map((theme) => {
              const isActive = activeTheme === theme;

              return (
                <button
                  key={theme}
                  type="button"
                  onClick={() => setActiveTheme(theme)}
                  className={cn(
                    "flex min-h-[90px] w-[75%] shrink-0 cursor-pointer snap-start flex-col items-start justify-start rounded-[18px] px-[18px] py-4 text-left font-heading text-[28.8px] leading-[0.95] uppercase transition-colors xl:w-full",
                    isActive
                      ? "bg-[var(--accent)] text-white"
                      : "bg-[var(--card-bg)] text-[#404040] hover:bg-[#e1e0db]",
                  )}
                >
                  {theme}
                </button>
              );
            })}
          </div>
        </aside>

        <div className="space-y-[22px]">
          {visibleCases.length > 0 ? (
            visibleCases.map((item) => <CaseCard key={item.id} item={item} />)
          ) : (
            <div className="rounded-[18px] bg-[var(--card-bg)] p-4 text-[15px] leading-[1.4] text-[var(--text-muted)] md:px-4 md:py-6">
              К сожалению, для этого фильтра пока нет карточек кейсов.
            </div>
          )}
        </div>
      </section>

      <FaqSection className="mt-14 md:mt-[90px]" />

      <div className="mt-14 md:mt-[90px]">
        <RequestCta />
      </div>
    </div>
  );
}
