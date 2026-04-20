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
      <div className="relative -mx-[var(--layout-side-padding)] overflow-hidden rounded-none bg-[var(--accent)] p-[18px] text-white sm:-mx-0 sm:rounded-[18px] md:rounded-[22.5px] md:p-[54px]">
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

          <div className="mt-[27px] grid gap-4 xl:grid-cols-[8fr_4fr] xl:items-stretch xl:gap-5">
            <div className="grid gap-4 md:grid-cols-2 md:gap-5">
              {WORK_STAGES.map((stage, index) => {
                const isLightOnMobile = isLightWorkStageCard(index, 1);
                const isLightOnDesktop = isLightWorkStageCard(index, 2);

                return (
                  <WorkStageCard
                    key={stage.number}
                    stage={stage}
                    className={cn(
                      "rounded-[18px] p-[18px] md:p-[27px]",
                      isLightOnMobile ? "bg-[#F5F4EF] text-[var(--heading)]" : "bg-[rgba(248,246,240,0.2)] text-white",
                      isLightOnDesktop ? "md:bg-[#F5F4EF] md:text-[var(--heading)]" : "md:bg-[rgba(248,246,240,0.2)] md:text-white",
                    )}
                    numberClassName={cn(
                      "text-3xl md:text-4xl",
                      isLightOnMobile ? "text-[var(--accent)]" : "text-white",
                      isLightOnDesktop ? "md:text-[var(--accent)]" : "md:text-white",
                    )}
                    titleClassName="whitespace-pre-line mt-4 text-3xl leading-[0.94] md:mt-5 xl:text-4xl"
                    descriptionClassName={cn(
                      "mt-4 text-sm leading-[1.3] tracking-[-0.04em] md:text-base",
                      isLightOnMobile ? "text-[#404040]" : "text-[rgba(255,255,255,0.92)]",
                      isLightOnDesktop ? "md:text-[#404040]" : "md:text-[rgba(255,255,255,0.92)]",
                    )}
                  />
                );
              })}
            </div>

            <aside className="rounded-[18px] bg-[#F5F4EF] p-[18px] text-[var(--heading)] md:p-[27px]">
              <h3 className="font-heading whitespace-pre-line text-3xl leading-[0.94] uppercase tracking-[0.015em] md:text-4xl">
                Опишите нам свою идею, а&nbsp;мы&nbsp;поможем её&nbsp;реализовать
              </h3>
              <RequestForm
                formClassName="mt-6 md:mt-8"
                includeEmail={false}
                privacyCheckboxId="catalog-work-stages-privacy"
                submitClassName="h-[52px]"
              />
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
