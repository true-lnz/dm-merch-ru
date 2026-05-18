import { RequestForm } from "@/shared/ui/request-form";
import type { HomeLeadCtaData } from "@/shared/lib/payload/home-page";
import Image from "next/image";
import { PageSubheading } from "../../shared/ui/page-subheading";

export function HomeLeadCta({ data }: { data: HomeLeadCtaData }) {
  return (
    <section className="my-[35px] md:my-[45px]">
      <div className="grid grid-cols-1 xl:grid-cols-2 xl:items-stretch">
        <div className="rounded-[18px] md:rounded-[22.5px] bg-white">
          <div className="relative aspect-square overflow-hidden rounded-[18px] md:rounded-[22.5px] xl:h-full xl:min-h-[600px] xl:aspect-auto">
            <Image src={data.image.url} alt={data.image.alt} fill sizes="100vw" className="object-cover object-top image-hover-scale" />
          </div>
        </div>
        <div className="rounded-[18px] md:rounded-[22.5px] bg-[var(--accent)] text-white p-[18px] md:p-[54px]">
          <PageSubheading
            title={data.title}
            titleClassName="text-white"
            description={data.description}
            descriptionPlacement="bottom"
            descriptionClassName="text-white"
          />
          <div className="mt-8">
            <RequestForm
              source="home-lead-cta"
              includeEmail={false}
              privacyCheckboxId="home-lead-cta-privacy"
              onAccentSurface
              submitLabel={data.submitLabel}
              submitClassName="border-white bg-white text-[var(--accent)] hover:bg-[#f3f7ff]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
