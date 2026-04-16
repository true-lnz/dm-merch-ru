import { RequestDialog, RequestDialogButton } from "@/features/request-dialog";
import { cn } from "@/shared/lib/cn";
import { buttonVariants } from "@/shared/ui/button";
import Image from "next/image";
import Link from "next/link";
import { PageHeading } from "../../shared/ui/page-heading";

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
    <section className="relative mt-[36px] mb-[63px] md:mb-[72px] xl:mb-[90px]">
      <div className="relative w-full overflow-visible" style={{ minHeight: "clamp(620px, 85vh, 820px)" }}>
        {/* Desktop image background */}
        <div className="pointer-events-none absolute inset-y-0 left-[42%] right-[calc(var(--layout-side-padding)*-1)] hidden xl:block">
          <Image
            src={HERO_IMAGE.src}
            alt={HERO_IMAGE.alt}
            fill
            quality={80}
            sizes="(min-width: 1536px) 50vw, (min-width: 1280px) 56vw, 0px"
            className="object-cover object-[68%_top]"
          />
        </div>

        {/* Content layer */}
        <div className="relative z-10 w-full xl:flex xl:min-h-[inherit] xl:items-stretch">
          <div className="w-full xl:max-w-[800px] xl:mb-[75px]">
            <div className="flex h-full flex-col gap-8 rounded-[18px] md:rounded-[22.5px] xl:bg-[rgba(232,231,226,0.72)] xl:px-10 xl:py-10 xl:backdrop-blur-[8px] 2xl:gap-10 2xl:px-12 2xl:py-12">
              <div className="flex flex-col gap-5 xl:gap-6">
                <PageHeading title="Мерч, который работает на бизнес" />
                <p className="max-w-[340px] text-sm leading-[1.3] tracking-[-0.03em] text-[#2a2a2a] md:max-w-[38rem] md:text-[18px] xl:max-w-[532px] xl:text-[21px]">
                  Создаём корпоративный мерч и подарки, которые носят, помнят и связывают с брендом.
                </p>
              </div>

              {/* Mobile / tablet image */}
              <div className="relative aspect-[340/314] w-full overflow-hidden md:aspect-[16/12] xl:hidden -mb-8">
                <Image
                  src={HERO_IMAGE.src}
                  alt={HERO_IMAGE.alt}
                  fill
                  sizes="(max-width: 767px) calc(100vw - 60px), (max-width: 1279px) 70vw, 0px"
                  className="object-cover object-top"
                />
              </div>

              <div className="grid gap-[10px] md:gap-4 lg:grid-cols-2 2xl:grid-cols-3 2xl:gap-6">
                {HERO_FEATURES.map((feature, index) => (
                  <div
                    key={feature.text}
                    className={cn(
                      "rounded-[9px] bg-[#e8e7e2] px-5 py-5 md:px-6 md:py-5",
                      "2xl:rounded-none 2xl:bg-transparent 2xl:px-0 2xl:py-0",
                      index < HERO_FEATURES.length - 1 && "2xl:border-r 2xl:border-[rgba(64,64,64,0.12)] 2xl:pr-6",
                    )}
                  >
                    <div className="flex items-start gap-5 2xl:block">
                      <Image
                        src={FEATURE_ICON_SRC}
                        alt=""
                        width={21}
                        height={21}
                        aria-hidden="true"
                        className="mt-[5px] size-[21px] shrink-0 2xl:mb-[15px] 2xl:mt-0"
                      />
                      <p className="text-sm leading-[1.3] tracking-[-0.04em] text-[#2a2a2a] md:text-base 2xl:font-light 2xl:text-[#404040]">
                        {feature.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-auto flex flex-col gap-[10px] pt-2 md:flex-row">
                <RequestDialog>
                  <RequestDialogButton className="w-full md:w-auto" />
                </RequestDialog>

                <Link
                  href="/cases"
                  className={cn(
                    buttonVariants({ variant: "white" }),
                    "group hidden h-[60px] justify-between rounded-[9px] border-transparent bg-white px-5 text-[16px] font-normal tracking-[-0.04em] text-[var(--accent)] transition-colors duration-200 hover:bg-[var(--accent)] hover:text-white xl:flex xl:w-[260px]",
                  )}
                >
                  <span className="self-start pt-2">К кейсам</span>
                  <span className="inline-flex size-10 items-center justify-center rounded-[5px] bg-[var(--accent)] transition-colors duration-200 group-hover:bg-white">
                    <Image
                      src={SECONDARY_ARROW_ICON_SRC}
                      alt=""
                      width={17}
                      height={17}
                      aria-hidden="true"
                      className="size-[17px] brightness-0 invert-100 transition-[transform,filter] duration-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:brightness-100 group-hover:invert-0"
                    />
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
