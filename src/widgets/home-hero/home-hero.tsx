import Image from "next/image";
import Link from "next/link";
import { RequestDialog } from "@/features/request-dialog";
import { cn } from "@/shared/lib/cn";
import { buttonVariants } from "@/shared/ui/button";
import {PageHeading} from "../../shared/ui/page-heading";

const HERO_IMAGE = {
  src: "/home/img_home_hero_cover.png",
  alt: "Команда в фирменном мерче",
} as const;

const HERO_FEATURES = [
  { text: "Цена ниже рынка на ~ 25% за счет собственного производства и прямой логистики с Турции" },
  { text: "Мерч у вас за 14 рабочих дней от идеи и дизайна до готовых вещей у вас в офисе" },
  { text: "Отправляем образцы по всей России: покажем материалы, посадку и качество до запуска основного тиража" },
] as const;

const FEATURE_ICON_SRC = "/icons/ic_feature.svg";
const SECONDARY_ARROW_ICON_SRC = "/icons/ic_link_arrow_button.svg";

export function HomeHero() {
  return (
    <section className="mb-[63px] md:mb-[72px] xl:mb-[90px] relative w-full overflow-visible">
      <div
        className="flex min-h-0 w-full justify-start xl:h-[80vh] xl:justify-start 2xl:h-[90vh]"
      >
        <div className="pointer-events-none absolute inset-y-0 hidden right-[calc(var(--layout-side-padding)*-1)] w-[65%] xl:block 2xl:w-[55%]">
          <Image
            src={HERO_IMAGE.src}
            alt={HERO_IMAGE.alt}
            fill
            priority
            unoptimized
            sizes="42vw"
            className="object-cover object-[130%_top]"
          />
        </div>

        <div className="relative z-10 mb-16 flex w-full justify-center xl:block xl:w-1/2 xl:max-w-[50%]">
          <div className="flex w-full flex-col gap-8 px-[0px] pb-[0px] pt-5 xl:h-full xl:max-w-none xl:justify-between xl:rounded-[20px] xl:bg-[rgba(232,231,226,0.7)] xl:px-[50px] xl:pb-[50px] xl:pt-[50px] xl:backdrop-blur-[8px]">
            <div className="flex flex-col gap-5 xl:gap-[30px]">
              <PageHeading title="Мерч, который работает на бизнес" />
              <p className="max-w-[340px] text-[14px] leading-[1.3] tracking-[-0.04em] text-[#2a2a2a] md:max-w-[38rem] md:text-[18px] xl:max-w-[532px] xl:text-[21.6px]">
                Создаём корпоративный мерч и подарки, которые носят, помнят и связывают с брендом.
              </p>
            </div>

            <div className="relative aspect-[340/314] mb-[calc(24px*-1)] sm:mb-[calc(20px*-1)]  w-full overflow-hidden md:aspect-[16/12] xl:hidden">
              <Image
                src={HERO_IMAGE.src}
                alt={HERO_IMAGE.alt}
                fill
                priority
                sizes="(max-width: 767px) calc(100vw - 60px), 420px"
                className="object-contain object-center"
              />
            </div>

            <div className="grid gap-[10px] md:gap-4 xl:grid-cols-3 xl:gap-[24px]">
              {HERO_FEATURES.map((feature, index) => (
                <div
                  key={feature.text}
                  className={cn(
                    "rounded-[10px] bg-[#e8e7e2] px-5 py-5 md:px-6 md:py-5",
                    index < HERO_FEATURES.length - 1 && "xl:border-r xl:border-[rgba(64,64,64,0.12)] xl:pr-[24px]",
                    "xl:min-h-[120px] xl:rounded-none xl:bg-transparent xl:px-0 xl:py-0",
                  )}
                >
                  <div className="flex items-start gap-5 xl:block">
                    <Image
                      src={FEATURE_ICON_SRC}
                      alt=""
                      width={21}
                      height={21}
                      aria-hidden="true"
                      className="mt-[5px] size-[21px] shrink-0 xl:mb-[15px] xl:mt-0"
                    />
                    <p className="text-[14px] leading-[1.3] tracking-[-0.04em] text-[#2a2a2a] md:text-[16px] xl:text-[14.4px] xl:font-light xl:text-[#404040]">
                      {feature.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-[10px] md:flex-row">
              <RequestDialog className="w-full" />
              <Link
                href="/cases"
                className={cn(
                  buttonVariants({ variant: "white" }),
                  "group hidden h-[60px] justify-between rounded-[10px] border-transparent bg-white px-5 text-[16px] font-normal tracking-[-0.04em] text-[var(--accent)] transition-colors duration-200 hover:bg-[var(--accent)] hover:text-white md:w-[284px] xl:flex xl:w-[283.6px] xl:rounded-[8px] xl:text-[19.46px] xl:tracking-[-0.04em]",
                )}
              >
                <span className="self-start pt-2">К кейсам</span>
                <span className="inline-flex size-10 items-center justify-center rounded-[5px] bg-[var(--accent)] transition-colors duration-200 group-hover:bg-white xl:size-[39.52px] xl:rounded-[4px]">
                  <Image
                    src={SECONDARY_ARROW_ICON_SRC}
                    alt=""
                    width={17}
                    height={17}
                    aria-hidden="true"
                    className="size-[17px] brightness-0 invert-100 transition-[transform,filter] duration-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:brightness-100 group-hover:invert-0 xl:size-[13.55px]"
                  />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
