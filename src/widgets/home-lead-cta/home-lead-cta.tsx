import { RequestForm } from "@/shared/ui/request-form";
import Image from "next/image";
import type { CSSProperties } from "react";
import { PageSubheading } from "../../shared/ui/page-subheading";

const LEAD_CTA_IMAGE = {
  src: "/home/img_lead_cta_cover2.png",
  alt: "Примеры корпоративного мерча",
};

export function HomeLeadCta() {
  return (
    <section className="my-[63px] md:my-[72px] xl:my-[90px]">
      <div className="grid grid-cols-1 xl:grid-cols-2 xl:items-stretch">
        <div className="rounded-[24px] bg-white">
          <div className="relative aspect-square overflow-hidden rounded-[20px] xl:h-full xl:min-h-[600px] xl:aspect-auto">
            <Image
              src={LEAD_CTA_IMAGE.src}
              alt={LEAD_CTA_IMAGE.alt}
              fill
              sizes="(max-width: 1279px) 100vw, 46vw"
              className="object-cover"
            />
          </div>
        </div>
        <div
          className="rounded-[24px] bg-[var(--accent)] px-5 py-5 text-white md:px-8 md:py-8 xl:px-[37px] xl:py-[43px]"
          style={
            {
              "--heading": "#ffffff",
              "--text-muted": "rgba(255,255,255,0.82)",
              "--text": "#ffffff",
              "--field-text": "rgba(255,255,255,0.64)",
              "--field-border": "rgba(255,255,255,0.3)",
              "--accent": "#0252c5",
              "--accent-hover": "#0144a3",
            } as CSSProperties
          }
        >
          <PageSubheading
            title="Отправим примеры мерча"
            description="На основе наших работ для 500+ компаний в 2025 году"
            descriptionPlacement="bottom"
            descriptionClassName="text-white"
          />
          <div className="mt-8">
            <RequestForm
              includeEmail={false}
              privacyCheckboxId="home-lead-cta-privacy"
              onAccentSurface
              submitLabel="Получить примеры мерча"
              submitClassName="border-white bg-white text-[var(--accent)] hover:bg-[#f3f7ff]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
