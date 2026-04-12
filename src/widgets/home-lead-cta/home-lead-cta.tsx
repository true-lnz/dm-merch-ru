import { RequestForm } from "@/shared/ui/request-form";
import Image from "next/image";
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
          <div className="relative aspect-square overflow-hidden rounded-[18px] md:rounded-[22.5px] xl:h-full xl:min-h-[600px] xl:aspect-auto">
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
          className="rounded-[18px] md:rounded-[22.5px] bg-[var(--accent)] text-white p-[18px] md:p-[55px] xl:p-[72px]">
          <PageSubheading
            title="Отправим примеры мерча"
						titleClassName="text-white"
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
