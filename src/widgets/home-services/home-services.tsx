"use client";

import { RequestDialog } from "@/features/request-dialog";
import { cn } from "@/shared/lib/cn";
import type { HomeServicesData } from "@/shared/lib/payload/home-page";
import { PageSubheading } from "@/shared/ui/page-subheading";
import Image from "next/image";

function ServiceRequestDialog({ label, title }: { title: string; label: string }) {
  return (
    <RequestDialog source="home-services" context={title} privacyCheckboxId="home-services-request-privacy">
      <button
        type="button"
        className="cursor-pointer text-left font-medium text-base md:text-lg leading-[1.3] tracking-[-0.02em] text-[var(--accent)] transition-opacity hover:opacity-80"
      >
        {label}
      </button>
    </RequestDialog>
  );
}

type ServiceCardProps = {
  title: string;
  description: string;
  ctaLabel: string;
};

function ServiceCard({ title, description, ctaLabel }: ServiceCardProps) {
  return (
    <article className="relative flex flex-col gap-4 rounded-[18px] md:rounded-[22.5px] bg-[var(--card-bg)] p-[18px] md:p-[27px]">
      <Image
        src="/icons/ic_feature.svg"
        alt=""
        width={32}
        height={32}
        aria-hidden="true"
        className="feature-icon-rotate-hover absolute right-5 top-5 size-7 md:right-[30px] md:top-[30px] md:size-8"
      />

      <h3 className="font-heading max-w-[80%] text-3xl leading-[0.95] tracking-[0.015em] uppercase text-[var(--heading)] md:text-4xl">{title}</h3>
      <p className="max-w-[90%] text-sm leading-[1.3] tracking-[-0.03em] text-[var(--text-muted)] md:text-base">{description}</p>

      <div className="mt-auto">
        <ServiceRequestDialog title={title} label={ctaLabel} />
      </div>
    </article>
  );
}

export function HomeServices({ data }: { data: HomeServicesData }) {
  return (
    <section className="my-[35px] md:my-[45px]">
      <PageSubheading title={data.title} />

      <div className="mt-8 grid grid-cols-1 gap-4 xl:grid-cols-[8.075fr_3.925fr] xl:grid-rows-1 xl:gap-5">
        <div className="grid grid-cols-1 xl:grid-cols-2 3xl:grid-cols-1 gap-4 xl:gap-5">
          {data.items.map((item) => (
            <ServiceCard key={item.title} title={item.title} description={item.description} ctaLabel={item.ctaLabel} />
          ))}
        </div>

        <div className="rounded-[18px] md:rounded-[22.5px] bg-white xl:self-stretch">
          <div className="relative overflow-hidden rounded-[18px] md:rounded-[22.5px] bg-white aspect-square xl:aspect-auto xl:h-full">
            <Image
              src={data.image.url}
              alt={data.image.alt}
              fill
              sizes="(max-width: 1279px) 100vw, 52vw"
              className={cn("object-cover image-hover-scale")}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
