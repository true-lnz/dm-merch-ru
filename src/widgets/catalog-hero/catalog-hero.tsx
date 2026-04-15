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
  };
};

export function CatalogHero({ heroImage, heroTitle }: CatalogHeroProps) {
  return (
    <section className="mb-[63px] md:mb-[72px] xl:mb-[90px] relative w-full overflow-visible">
      <div className="flex min-h-0 w-full justify-start mdLh- xl:h-[90vh] xl:justify-start 2xl:h-[90дvh]">
        <div className="pointer-events-none absolute inset-y-0 hidden right-[calc(var(--layout-side-padding)*-1)] w-[65%] xl:block 2xl:w-[55%]">
          <Image src={heroImage.src} alt={heroImage.alt} fill unoptimized sizes="42vw" className="object-cover object-[130%_top]" />
        </div>

        <div className="relative z-10 mb-16 flex w-full justify-center xl:block xl:w-1/2 xl:max-w-[50%]">
          <div className="flex w-full flex-col pt-5 xl:h-full xl:max-w-none xl:justify-between">
            <div className="flex flex-col gap-5 xl:gap-[30px]">
              <PageHeading
                title={heroTitle}
                breadcrumb={{
                  labelFrom: "Главная",
                  labelTo: "Каталог",
                  href: "/",
                }}
              />
              <p className="max-w-[340px] text-sm md:text-lg xl:text-2xl leading-[1.3] tracking-[-0.03em] text-[#2a2a2a] md:max-w-[38rem] md:text-[18px] xl:max-w-[532px] xl:text-[21.6px]">
                Выберите формат мерча под ваши задачи
              </p>
            </div>

            <div className="relative aspect-[340/314] w-full overflow-hidden mt-4 md:aspect-[16/12] xl:hidden">
              <Image
                src={heroImage.src}
                alt={heroImage.alt}
                fill
                sizes="(max-width: 767px) calc(100vw - 60px), 420px"
                className="object-cover object-top"
              />
            </div>

            <div className="grid gap-[9px] md:gap-[18px] xl:grid-cols-3 my-0 mb-8 xl:my-[65px]">
              {HERO_FEATURES.map((feature) => (
                <div key={feature.text} className="rounded-[9px] bg-[#e8e7e2] p-[18px] xl:min-h-[120px]">
                  <div className="flex items-start gap-5 xl:block">
                    <Image
                      src={FEATURE_ICON_SRC}
                      alt=""
                      width={21}
                      height={21}
                      aria-hidden="true"
                      className="mt-[5px] size-[21px] shrink-0 xl:mb-[15px] xl:mt-0"
                    />
                    <p className="text-xs md:text-sm font-medium leading-[1.3] tracking-[-0.04em] text-[#2a2a2a] xl:text-[#404040]">{feature.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-[10px] md:flex-row">
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
