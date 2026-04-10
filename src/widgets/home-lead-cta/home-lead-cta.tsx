import Image from "next/image";
import { RequestForm } from "@/shared/ui/request-form";
import { PageSubheader } from "@/shared/ui/page-subheader";

type HomeLeadCtaProps = {
  title: string;
  description: string;
  image: {
    src: string;
    alt: string;
  };
};

export function HomeLeadCta({
  title,
  description,
  image,
}: HomeLeadCtaProps) {
  return (
    <section className="py-14 md:py-20 xl:py-[118px]">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,870px)_minmax(0,1fr)] xl:items-stretch xl:gap-[40px]">
        <div className="overflow-hidden rounded-[24px]">
          <div className="relative aspect-[340/256] md:aspect-[16/10] xl:h-full xl:min-h-[648px] xl:aspect-auto">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 1279px) 100vw, 46vw"
              className="object-cover"
            />
          </div>
        </div>
        <div className="rounded-[24px] bg-[var(--card-bg)] px-5 py-5 md:px-8 md:py-8 xl:px-[37px] xl:py-[43px]">
          <PageSubheader
            title={title}
            description={description}
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
