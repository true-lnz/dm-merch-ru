import { RequestDialog, RequestDialogButton } from "@/features/request-dialog";
import { PageHeading } from "@/shared/ui/page-heading";
import Image from "next/image";

const HERO_FEATURES = [
  { text: "Цена ниже рынка на ~ 25% за счет собственного производства и прямой логистики с Турции" },
  { text: "Сроки от 7 до 14 рабочих дней. Под ключ - быстрее конкурентов на 33%" },
  { text: "Логистика по всей России. 3 склада: Москва, Санкт-Петербург и Уфа" },
] as const;

const FEATURE_ICON_SRC = "/icons/ic_feature.svg";
const HERO_MIN_HEIGHT = "clamp(620px, 72vh, 860px)";

type CatalogHeroProps = {
  heroTitle: string;
  heroImage: {
    src: string;
    alt: string;
  };
};

export function CatalogHero({ heroImage, heroTitle }: CatalogHeroProps) {
  return (
    <section className="relative mb-[43px] md:mb-[55px]">
      <div className="grid grid-cols-1 xl:grid-cols-2" style={{ minHeight: HERO_MIN_HEIGHT }}>
        {/* content */}
        <div className="relative z-10 min-w-0 xl:pb-[75px]">
          <div className="flex h-full flex-col gap-8 pt-5 xl:gap-10 xl:rounded-[22px]">
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
            <div className="relative -mb-8 aspect-[340/314] w-full overflow-hidden md:aspect-[16/12] xl:hidden">
              <Image
                src={heroImage.src}
                alt={heroImage.alt}
                fill
                quality={80}
                sizes="(max-width: 767px) calc(100vw - 60px), (max-width: 1279px) 70vw, 0px"
                className="object-contain object-top"
              />
            </div>

            <div className="grid gap-[9px] md:gap-[18px] lg:max-w-[600px] lg:grid-cols-2 2xl:max-w-none 2xl:grid-cols-3 2xl:gap-6">
              {HERO_FEATURES.map((feature) => (
                <div key={feature.text} className="rounded-[9px] bg-[rgba(232,231,226,0.7)] backdrop-blur-[6px] p-[18px] 2xl:min-h-[120px]">
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

        {/* desktop image */}
        <div className="relative hidden min-w-0 xl:flex xl:items-end xl:justify-end">
          <div className="relative h-full w-full">
            <img src={heroImage.src} alt={heroImage.alt} className="absolute right-0 bottom-0 h-full w-auto max-w-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
