import Image from "next/image";
import { PageSubheading } from "../../shared/ui/page-subheading";
import { RequestForm } from "@/shared/ui/request-form";

const LEAD_CTA_IMAGE = {
  src: "/contacts/img_contacts_cover.png",
  alt: "Примеры корпоративного мерча",
};

export function HomeLeadCta() {
  return (
    <section className="py-14 md:py-20 xl:py-[118px]">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,870px)_minmax(0,1fr)] xl:items-stretch xl:gap-[40px]">
        <div className="overflow-hidden rounded-[24px]">
          <div className="relative aspect-[340/256] md:aspect-[16/10] xl:h-full xl:min-h-[648px] xl:aspect-auto">
            <Image
              src={LEAD_CTA_IMAGE.src}
              alt={LEAD_CTA_IMAGE.alt}
              fill
              sizes="(max-width: 1279px) 100vw, 46vw"
              className="object-cover"
            />
          </div>
        </div>
        <div className="rounded-[24px] bg-[var(--card-bg)] px-5 py-5 md:px-8 md:py-8 xl:px-[37px] xl:py-[43px]">
          <PageSubheading
            title="Отправим примеры мерча"
            description="На основе наших работ для 500+ компаний покажем реальные форматы, материалы и связки под вашу задачу."
            descriptionPlacement="bottom"
            titleClassName="md:text-[72px] xl:text-[84px]"
            descriptionClassName="max-w-[34rem]"
          />
          <div className="mt-8">
            <RequestForm
              includeEmail={false}
              privacyCheckboxId="home-lead-cta-privacy"
              submitLabel="Получить примеры мерча"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
