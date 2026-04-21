"use client";

import { buildRequestEmail } from "@/shared/lib/request-mail/email-templates";
import type { RequestPayload } from "@/shared/lib/request-mail/types";
import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";
import { PageHeading } from "@/shared/ui/page-heading";
import { useMemo, useState } from "react";

const previewModes = [
  { id: "desktop", label: "Desktop", frameClassName: "w-full max-w-[760px]" },
  { id: "mobile", label: "Mobile", frameClassName: "w-full max-w-[390px]" },
  { id: "html", label: "HTML", frameClassName: "w-full" },
] as const;

const generalPayload: RequestPayload = {
  type: "general",
  source: "request-cta",
  pagePath: "/catalog/sweatshirt-catalog",
  pageTitle: "Толстовки для брендирования",
  name: "Алексей Иванов",
  phone: "+7 (999) 123-45-67",
  email: "alexey@example.com",
  message: "Нужен тираж к корпоративному мероприятию. Интересуют сроки, образцы и варианты нанесения.",
  quantity: 120,
  context: "Худи oversize для отдела продаж",
};

const wishlistPayload: RequestPayload = {
  type: "wishlist",
  source: "wishlist-dialog",
  pagePath: "/partner-catalog",
  pageTitle: "Каталог продукции",
  name: "Мария Смирнова",
  phone: "+7 (912) 555-44-33",
  email: "m.smirnova@example.com",
  message: "Подготовьте КП в двух вариантах: стандарт и premium. Отдельно укажите сроки поставки.",
  totalRub: 364000,
  wishlistItems: [
    {
      id: "hoodie-oversize",
      title: "Худи oversize",
      articleNumber: "HD-1024",
      productUrl: "https://dm-merch.ru/partner-catalog/hoodie-oversize",
      quantity: 80,
      unitPriceRub: 2450,
    },
    {
      id: "thermo-bottle",
      title: "Термобутылка металлическая",
      articleNumber: "TB-8841",
      productUrl: "https://dm-merch.ru/partner-catalog/thermo-bottle",
      quantity: 120,
      unitPriceRub: 890,
    },
    {
      id: "gift-box",
      title: "Подарочная коробка с вкладышем",
      articleNumber: "GB-2011",
      productUrl: "https://dm-merch.ru/partner-catalog/gift-box",
      quantity: 120,
      unitPriceRub: 510,
    },
  ],
};

const payloadOptions = [
  { id: "general", label: "Обычная заявка", payload: generalPayload },
  { id: "wishlist", label: "Вишлист", payload: wishlistPayload },
] as const;

export function EmailPreviewClient() {
  const [activePayloadId, setActivePayloadId] = useState<(typeof payloadOptions)[number]["id"]>("general");
  const [previewMode, setPreviewMode] = useState<(typeof previewModes)[number]["id"]>("desktop");

  const activePayload = payloadOptions.find((option) => option.id === activePayloadId)?.payload ?? generalPayload;
  const activeMode = previewModes.find((mode) => mode.id === previewMode) ?? previewModes[0];

  const emailPreview = useMemo(() => buildRequestEmail(activePayload), [activePayload]);

  return (
    <section className="mt-[36px] mb-[45px] space-y-8">
      <PageHeading title={"Preview\nemail шаблонов"} breadcrumb={{ labelFrom: "Главная", labelTo: "Email Preview", href: "/" }} />

      <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)] xl:items-start">
        <aside className="rounded-[18px] bg-white p-5 md:rounded-[22.5px] md:p-6">
          <div>
            <h2 className="font-heading text-3xl uppercase leading-[0.95] tracking-[0.015em] text-[var(--heading)]">Настройки</h2>
            <p className="mt-3 text-sm leading-[1.4] tracking-[-0.03em] text-[#5f5f5f]">
              Переключайте тип заявки и режим просмотра. HTML ниже можно копировать для ручной проверки в почтовых клиентах.
            </p>
          </div>

          <div className="mt-6 space-y-6">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#6b7280]">Шаблон</p>
              <div className="grid gap-2">
                {payloadOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setActivePayloadId(option.id)}
                    className={cn(
                      "rounded-[12px] border px-4 py-3 text-left text-sm font-medium tracking-[-0.03em] transition-colors",
                      activePayloadId === option.id
                        ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                        : "border-[#d7dce3] bg-[#f8fafc] text-[#1f2937] hover:border-[var(--accent)]/40",
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-[#6b7280]">Режим</p>
              <div className="grid grid-cols-3 gap-2">
                {previewModes.map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setPreviewMode(mode.id)}
                    className={cn(
                      "rounded-[10px] border px-3 py-2 text-sm font-medium tracking-[-0.03em] transition-colors",
                      previewMode === mode.id
                        ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                        : "border-[#d7dce3] bg-white text-[#1f2937] hover:border-[var(--accent)]/40",
                    )}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[14px] bg-[#f8fafc] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#6b7280]">Subject</p>
              <p className="mt-2 text-sm leading-[1.4] tracking-[-0.03em] text-[#111827]">{emailPreview.subject}</p>
            </div>
          </div>
        </aside>

        <div className="rounded-[18px] bg-white p-4 md:rounded-[22.5px] md:p-6">
          {previewMode === "html" ? (
            <div>
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="font-heading text-3xl uppercase leading-[0.95] tracking-[0.015em] text-[var(--heading)]">HTML</h2>
                <Button
                  type="button"
                  variant="white"
                  className="w-auto min-w-[160px] text-[var(--accent)]"
                  onClick={async () => {
                    await navigator.clipboard.writeText(emailPreview.html);
                  }}
                >
                  Скопировать HTML
                </Button>
              </div>
              <textarea
                readOnly
                value={emailPreview.html}
                className="min-h-[720px] w-full rounded-[16px] border border-[#d7dce3] bg-[#f8fafc] p-4 font-mono text-xs leading-[1.5] text-[#111827] outline-none"
              />
            </div>
          ) : (
            <div>
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="font-heading text-3xl uppercase leading-[0.95] tracking-[0.015em] text-[var(--heading)]">Preview</h2>
                <span className="text-sm leading-[1.4] tracking-[-0.03em] text-[#6b7280]">{activeMode.label}</span>
              </div>
              <div className="rounded-[18px] bg-[#edf2f7] p-3 md:p-5">
                <div className={cn("mx-auto overflow-hidden rounded-[20px] shadow-[0_18px_50px_rgba(15,23,42,0.12)]", activeMode.frameClassName)}>
                  <iframe
                    title="Email preview"
                    srcDoc={emailPreview.html}
                    className="block h-[820px] w-full border-0 bg-white"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
