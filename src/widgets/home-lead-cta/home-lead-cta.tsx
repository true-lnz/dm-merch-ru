import { RequestForm } from "@/shared/ui/request-form";
import Image from "next/image";
import { PageSubheading } from "../../shared/ui/page-subheading";

const LEAD_CTA_IMAGE = {
  src: "/home/img_lead_cta_cover.png",
  alt: "Примеры корпоративного мерча",
};

export function HomeLeadCta() {
  return (
    <section className="my-[45px]">
      <div className="grid grid-cols-1 xl:grid-cols-2 xl:items-stretch">
        <div className="rounded-[18px] md:rounded-[22.5px] bg-white">
          <div className="relative aspect-square overflow-hidden rounded-[18px] md:rounded-[22.5px] xl:h-full xl:min-h-[600px] xl:aspect-auto">
            <Image
              src={LEAD_CTA_IMAGE.src}
              alt={LEAD_CTA_IMAGE.alt}
              fill
              sizes="(max-width: 1279px) 100vw, 46vw"
              className="object-cover object-top image-hover-scale"
            />
          </div>
        </div>
        <div className="rounded-[18px] md:rounded-[22.5px] bg-[var(--accent)] text-white p-[18px] md:p-[54px]">
          <PageSubheading
            title="Отправим примеры мерча"
            titleClassName="text-white"
            description="На&nbsp;основе наших работ для 500+ компаний в&nbsp;2025 году"
            descriptionPlacement="bottom"
            descriptionClassName="text-white"
          />
          <div className="mt-8">
            <RequestForm
              source="home-lead-cta"
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
