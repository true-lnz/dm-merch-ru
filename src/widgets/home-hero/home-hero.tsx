import { RequestDialog, RequestDialogButton } from "@/features/request-dialog";
import { cn } from "@/shared/lib/cn";
import type { HomeHeroData } from "@/shared/lib/payload/home-page";
import { buttonVariants } from "@/shared/ui/button";
import Image from "next/image";
import Link from "next/link";
import { PageHeading } from "../../shared/ui/page-heading";

const FEATURE_ICON_SRC = "/icons/ic_feature.svg";
const SECONDARY_ARROW_ICON_SRC = "/icons/ic_link_arrow_button.svg";

const HERO_HEIGHT = "clamp(520px, 66vh, 820px)";

export function HomeHero({ data }: { data: HomeHeroData }) {
  return (
    <section className="relative mt-[35px] mb-[35px] md:mb-[45px]">
      <div className="grid grid-cols-1 xl:grid-cols-2 items-stretch gap-8 xl:gap-10" style={{ minHeight: HERO_HEIGHT }}>
        {/* Content */}
        <div className="relative z-10 min-w-0 xl:mb-0 h-full">
          <div className="flex h-full flex-col gap-8 rounded-[18px] md:rounded-[22.5px] xl:bg-[rgba(232,231,226,0.72)] xl:px-10 xl:py-10 xl:backdrop-blur-[8px] 2xl:gap-10 2xl:px-12 2xl:py-12">
            <div className="flex flex-col gap-4 xl:gap-5">
              <PageHeading title={data.title} />
              <p className="max-w-[340px] text-sm leading-[1.3] tracking-[-0.03em] text-[#2a2a2a] md:max-w-[38rem] md:text-[18px] xl:max-w-[532px] xl:text-[21px]">{data.description}</p>
            </div>

            {/* Mobile / tablet image */}
            <div className="relative -mb-8 aspect-[340/314] w-full overflow-hidden md:aspect-[16/12] xl:hidden">
              <Image
                src={data.image.url}
                alt={data.image.alt}
                fill
                sizes="(max-width: 767px) calc(100vw - 60px), (max-width: 1279px) 70vw, 0px"
                className="object-cover object-top"
              />
            </div>

            <div className="grid gap-[10px] md:grid-cols-1 md:gap-4 2xl:grid-cols-3 2xl:gap-6">
              {data.features.map((feature, index) => (
                <div
                  key={feature.text}
                  className={cn(
                    "rounded-[9px] bg-[#e8e7e2] px-5 py-5 md:px-6 md:py-5",
                    "xl:rounded-none xl:bg-transparent xl:px-0 xl:py-0",
                    index < data.features.length - 1 && "2xl:border-r 2xl:border-[rgba(64,64,64,0.12)] 2xl:pr-6",
                  )}
                >
                  <div className="flex items-start gap-5 2xl:block">
                    <Image
                      src={FEATURE_ICON_SRC}
                      alt=""
                      width={21}
                      height={21}
                      aria-hidden="true"
                      className="feature-icon-rotate-hover mt-[5px] size-[21px] shrink-0 2xl:mb-[15px] 2xl:mt-0"
                    />
                    <p className="text-sm leading-[1.3] tracking-[-0.04em] text-[#2a2a2a] md:text-base 2xl:font-light 2xl:text-[#404040]">
                      {feature.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto flex flex-col gap-[10px] pt-2 md:flex-row xl:flex-wrap 2xl:flex-nowrap">
              <RequestDialog source="home-hero">
                <RequestDialogButton className="w-full md:w-auto" />
              </RequestDialog>

              {data.showCasesButton ? (
                <Link
                  href="/cases"
                  className={cn(
                    buttonVariants({ variant: "white" }),
                    "group hidden h-[60px] min-w-0 justify-between rounded-[9px] border-transparent bg-white px-5 text-lg font-normal tracking-[-0.04em] text-[var(--accent)] transition-colors duration-200 hover:bg-[var(--accent)] hover:text-white xl:flex xl:flex-1 2xl:w-[260px] 2xl:flex-none",
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
              ) : null}
            </div>
          </div>
        </div>

        {/* Desktop image */}
        <div className="relative hidden xl:block h-full overflow-visible 2xl:overflow-hidden">
          <Image
            src={data.image.url}
            alt={data.image.alt}
            width={1200}
            height={900}
            className="absolute right-0 2xl:right-auto top-0 h-full 2xl:h-auto w-auto 2xl:w-full max-w-none"
            preload={true}
          />
        </div>
      </div>
    </section>
  );
}
