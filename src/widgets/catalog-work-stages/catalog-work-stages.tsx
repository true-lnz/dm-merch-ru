import { WORK_STAGES } from "@/shared/config/work-stages";
import { cn } from "@/shared/lib/cn";
import { isLightWorkStageCard } from "@/shared/lib/work-stage-tone";
import { PageSubheading } from "@/shared/ui/page-subheading";
import { RequestForm } from "@/shared/ui/request-form";
import { WorkStageCard } from "@/shared/ui/work-stage-card";
import Image from "next/image";

const CATALOG_STAGES_TITLE = "от разработки\nдизайна до отправки";

export function CatalogWorkStages() {
  return (
    <section className="my-[43px] md:my-[55px]">
      <div className="relative -mx-[var(--layout-side-padding)] overflow-hidden rounded-none bg-[var(--accent)] px-[26px] py-[28px] text-white sm:-mx-0 sm:rounded-[18px] md:rounded-[22.5px] md:px-[38px] md:py-[44px] xl:px-[80px] xl:py-[72px]">
        <Image
          src="/catalog/img_card_cover_main.svg"
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          className="pointer-events-none select-none object-cover object-[68%_35%] opacity-95"
        />

        <div className="relative z-10">
          <PageSubheading title={CATALOG_STAGES_TITLE} titleClassName="text-white" />

          <div className="mt-7 grid gap-4 lg:gap-5 xl:mt-[74px] xl:grid-cols-[minmax(0,1fr)_484px] xl:items-stretch xl:gap-9">
            <div className="grid gap-4 md:grid-cols-2 md:gap-5">
              {WORK_STAGES.map((stage, index) => {
                const isLightOnMobile = isLightWorkStageCard(index, 1);
                const isLightOnDesktop = isLightWorkStageCard(index, 2);

                return (
                  <WorkStageCard
                    key={stage.number}
                    stage={stage}
                    className={cn(
                      "min-h-[210px] rounded-[18px] p-[18px] md:min-h-[320px] md:p-[27px]",
                      isLightOnMobile ? "bg-[#F5F4EF] text-[var(--heading)]" : "bg-[rgba(248,246,240,0.2)] text-white",
                      isLightOnDesktop ? "md:bg-[#F5F4EF] md:text-[var(--heading)]" : "md:bg-[rgba(248,246,240,0.2)] md:text-white",
                    )}
                    numberClassName={cn(
                      "text-3xl md:text-5xl",
                      isLightOnMobile ? "text-[var(--accent)]" : "text-white",
                      isLightOnDesktop ? "md:text-[var(--accent)]" : "md:text-white",
                    )}
                    titleClassName="whitespace-pre-line mt-4 text-3xl leading-[0.94] md:mt-5 xl:text-5xl"
                    descriptionClassName={cn(
                      "mt-4 text-xs leading-[1.3] tracking-[-0.04em] md:text-base",
                      isLightOnMobile ? "text-[#404040]" : "text-[rgba(255,255,255,0.92)]",
                      isLightOnDesktop ? "md:text-[#404040]" : "md:text-[rgba(255,255,255,0.92)]",
                    )}
                  />
                );
              })}
            </div>

            <aside className="rounded-[18px] bg-[#F5F4EF] p-[18px] text-[var(--heading)] md:p-[27px]">
              <h3 className="font-heading whitespace-pre-line text-3xl leading-[0.94] uppercase tracking-[0.015em] md:text-5xl">
                {"Опишите нам свою\nидею, а мы поможем\nеё реализовать"}
              </h3>
              <RequestForm formClassName="mt-6 md:mt-8" privacyCheckboxId="catalog-work-stages-privacy" submitClassName="h-[52px]" />
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
