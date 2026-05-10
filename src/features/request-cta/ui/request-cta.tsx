"use client";

import { useRequestCta } from "@/shared/config/request-cta/request-cta-provider";
import { useSiteInfo } from "@/shared/config/site-info/site-info-provider";
import { ContactPills } from "@/shared/ui/contact-pills";
import { PageSubheading } from "@/shared/ui/page-subheading";
import { RequestForm } from "@/shared/ui/request-form";
import { Fragment } from "react";

function renderTitleWithBreaks(title: string) {
  return title.split("\n").map((line, index, lines) => (
    <Fragment key={`${line}-${index}`}>
      {line}
      {index < lines.length - 1 ? <br /> : null}
    </Fragment>
  ));
}

export function RequestCta() {
  const siteInfo = useSiteInfo();
  const requestCta = useRequestCta();

  return (
    <section className="relative mt-[35px] md:mt-[45px]" aria-label="Форма заявки">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.05fr] lg:grid-rows-[auto_1fr]">
        <div className="contents lg:relative lg:row-span-2 lg:flex lg:flex-col lg:justify-between">
          <img
            src="/img_cta_cover.svg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none hidden lg:block absolute bottom-0 left-[calc(var(--layout-side-padding)*-1)] z-0 h-auto w-[min(50rem,calc(100%+var(--layout-side-padding)))] max-w-none"
          />

          <div className="order-1 relative z-10 space-y-5 pb-3 lg:pb-10">
            <PageSubheading title={<>{renderTitleWithBreaks(requestCta.title)}</>} />
            <p className="max-w-[800px] text-sm sm:text-base tracking-[0.0354] text-[var(--text)] md:text-2xl">
              {requestCta.description}
            </p>
          </div>

          <ContactPills
            email={siteInfo.email}
            phone={siteInfo.phone}
            variant="cta"
            className="order-3 relative z-10 w-full lg:w-auto lg:self-start mb-[54px]"
          />
        </div>

        <RequestForm
          source="request-cta"
          formClassName="order-2 lg:row-span-2 mb-[22.5px] md:mb-[54px]"
          privacyCheckboxId="request-cta-privacy"
          submitClassName="lg:w-[440px]"
        />
      </div>
    </section>
  );
}
