import { RequestDialog, RequestDialogButton } from "@/features/request-dialog";
import { PageHeading } from "@/shared/ui/page-heading";
import Image from "next/image";

const HERO_FEATURES = [
  { text: "Цена ниже рынка на ~ 25% за счет собственного производства и прямой логистики с Турции" },
  { text: "Сроки от 7 до 14 рабочих дней. Под ключ - быстрее конкурентов на 33%" },
  { text: "Логистика по всей России. 3 склада: Москва, Санкт-Петербург и Уфа" },
] as const;

const FEATURE_ICON_SRC = "/icons/ic_feature.svg";

type CatalogHeroProps = {
  heroTitle: string;
  heroImage: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
};

export function CatalogHero({ heroImage, heroTitle }: CatalogHeroProps) {
  return (
    <section className="relative mb-[63px] w-full md:mb-[72px] xl:mb-[90px]">
      <div className="relative" style={{ minHeight: "clamp(620px, 85vh, 860px)" }}>
        {/* desktop background image */}
        <div className="pointer-events-none absolute inset-y-0 left-[48%] right-0 hidden overflow-visible xl:block 2xl:left-[48%]">
          <img src={heroImage.src} alt={heroImage.alt} className="absolute bottom-0 left-0 h-full w-auto max-w-none" />
        </div>

        {/* content */}
        <div className="relative z-10 w-full xl:max-w-[760px] 2xl:max-w-[820px] xl:pb-[75px]">
          <div className="flex flex-col gap-8 pt-5 xl:gap-10 xl:rounded-[22px]">
            <div className="flex flex-col gap-5 xl:gap-6">
              <PageHeading
                title={heroTitle}
                breadcrumb={{
                  labelFrom: "Главная",
                  labelTo: "Каталог",
                  href: "/",
                }}
              />

              <p className="max-w-[340px] text-sm leading-[1.3] tracking-[-0.03em] text-[#2a2a2a] md:max-w-[38rem] md:text-[18px] xl:max-w-[532px] xl:text-[21px]">
                Выберите формат мерча под ваши задачи
              </p>
            </div>

            {/* mobile / tablet image */}
            <div className="relative aspect-[340/314] w-full overflow-hidden md:aspect-[16/12] xl:hidden -mb-8">
              <Image
                src={heroImage.src}
                alt={heroImage.alt}
                fill
                quality={80}
                sizes="(max-width: 767px) calc(100vw - 60px), (max-width: 1279px) 70vw, 0px"
                className="object-cover object-top"
              />
            </div>

            <div className="grid gap-[9px] md:gap-[18px] lg:grid-cols-2 2xl:grid-cols-3 2xl:gap-6">
              {HERO_FEATURES.map((feature) => (
                <div key={feature.text} className="rounded-[9px] bg-[#e8e7e2] p-[18px] 2xl:min-h-[120px]">
                  <div className="flex items-start gap-5 2xl:block">
                    <Image
                      src={FEATURE_ICON_SRC}
                      alt=""
                      width={21}
                      height={21}
                      aria-hidden="true"
                      className="mt-[5px] size-[21px] shrink-0 2xl:mb-[15px] 2xl:mt-0"
                    />
                    <p className="text-xs font-medium leading-[1.3] tracking-[-0.04em] text-[#2a2a2a] md:text-sm 2xl:text-[#404040]">
                      {feature.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto flex flex-col gap-[10px] pt-2 md:flex-row">
              <RequestDialog>
                <RequestDialogButton className="w-full md:w-auto" label="Обсудить задачу" />
              </RequestDialog>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
