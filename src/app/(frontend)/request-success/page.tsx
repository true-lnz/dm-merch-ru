import { getSiteInfo } from "@/shared/config/site-info/get-site-info";
import { cn } from "@/shared/lib/cn";
import { buttonVariants } from "@/shared/ui/button";
import { PageHeading } from "@/shared/ui/page-heading";
import Image from "next/image";
import Link from "next/link";

const HERO_IMAGE = {
  src: "/home/img_home_hero_cover.webp",
  alt: "Команда в фирменном мерче",
} as const;

const HEADING_TEMPLATE = "Спасибо\nза обращение,\nТУТ_ИМЯ!";
const SECONDARY_ARROW_ICON_SRC = "/icons/ic_link_arrow_button.svg";
const HERO_HEIGHT = "clamp(520px, 62vh, 820px)";
const TG_ICON_PATH =
  "M37.3284 193.722C183.089 130.217 280.285 88.35 328.917 68.1222C467.773 10.3674 496.625 0.334815 515.431 0.00353222C519.568 -0.0693298 528.816 0.95574 534.806 5.8167C539.865 9.92121 541.257 15.4658 541.923 19.3573C542.589 23.2488 543.418 32.1138 542.759 39.0407C535.234 118.102 502.675 309.965 486.111 398.515C479.102 435.984 465.301 448.548 451.941 449.777C422.905 452.449 400.856 430.588 372.733 412.153C328.727 383.306 303.866 365.349 261.15 337.2C211.784 304.669 243.786 286.789 271.919 257.569C279.282 249.921 407.215 133.556 409.691 123C410.001 121.68 410.288 116.759 407.365 114.16C404.441 111.562 400.126 112.45 397.012 113.157C392.599 114.159 322.298 160.625 186.11 252.556C166.155 266.259 148.081 272.935 131.887 272.585C114.034 272.199 79.6928 262.491 54.1636 254.192C22.8511 244.014 -2.03552 238.632 0.131547 221.346C1.26029 212.343 13.6592 203.135 37.3284 193.722Z";
const MAX_ICON_PATH =
  "M20.2594 31.9333C17.9015 31.9333 16.8061 31.5867 14.9072 30.1995C13.6987 31.7602 9.89454 32.9744 9.72701 30.8931C9.72701 29.3337 9.3785 28.0199 8.99413 26.5739C8.52339 24.8021 8 22.8313 8 19.967C8 13.1376 13.5803 8 20.1972 8C26.8125 8 32 13.3874 32 20.0336C32 26.679 26.6471 31.9335 20.2591 31.9335L20.2594 31.9333ZM20.3549 13.905C17.1355 13.7357 14.6234 15.9781 14.0694 19.4883C13.6102 22.3953 14.4238 25.9372 15.1195 26.1154C15.4479 26.1994 16.2883 25.5169 16.8057 24.9966C17.6582 25.5512 18.6356 25.9812 19.7224 26.0377C23.0278 26.2115 25.9563 23.6149 26.1298 20.2967C26.3034 16.9782 23.6605 14.079 20.3551 13.905H20.3549Z";

type RequestSuccessPageProps = {
  searchParams?: Promise<{
    name?: string | string[];
  }>;
};

function resolveName(name: string | string[] | undefined): string {
  if (Array.isArray(name)) {
    return name[0]?.trim() || "клиент";
  }

  return name?.trim() || "клиент";
}

export default async function RequestSuccessPage({ searchParams }: RequestSuccessPageProps) {
  const resolvedSearchParams = await searchParams;
  const siteInfo = await getSiteInfo();
  const maxSocialHref = siteInfo.socials.find((social) => social.icon === "max")?.href ?? "#";
  const tgSocialHref = siteInfo.socials.find((social) => social.icon === "tg")?.href ?? "#";
  const heading = HEADING_TEMPLATE.replace("ТУТ_ИМЯ", resolveName(resolvedSearchParams?.name));

  return (
    <section className="relative mt-[35px] mb-[70px] md:mb-[90px]">
      <div className="grid grid-cols-1 items-stretch gap-8 xl:grid-cols-2 xl:gap-10" style={{ minHeight: HERO_HEIGHT }}>
        <div className="relative z-10 min-w-0 xl:mb-0 h-full">
          <div className="flex h-full flex-col gap-8 rounded-[18px] md:rounded-[22.5px] xl:bg-[rgba(232,231,226,0.72)] xl:px-10 xl:py-10 xl:backdrop-blur-[8px] 2xl:gap-10 2xl:px-12 2xl:py-12">
            <div className="flex flex-col gap-4 xl:gap-5">
              <PageHeading title={heading} />
              <p className="max-w-[340px] text-sm leading-[1.3] tracking-[-0.03em] text-[#2a2a2a] md:max-w-[38rem] md:text-[18px] xl:max-w-[532px] xl:text-[21px]">
                Ваша заявка уже у нас в работе.
              </p>
              <p className="max-w-[340px] text-sm leading-[1.3] tracking-[-0.03em] text-[#2a2a2a] md:max-w-[38rem] md:text-[18px] xl:max-w-[532px] xl:text-[21px]">
                Поможем подобрать продукцию, которая будет полезна бизнесу, понравится сотрудникам и усилит бренд.
              </p>
            </div>

            <div className="relative -mb-8 aspect-[340/314] w-full overflow-hidden md:aspect-[16/12] xl:hidden">
              <Image
                src={HERO_IMAGE.src}
                alt={HERO_IMAGE.alt}
                fill
                preload={true}
                sizes="(max-width: 767px) calc(100vw - 60px), (max-width: 1279px) 70vw, 0px"
                className="object-cover object-top"
              />
            </div>

            <div className="md:mt-auto flex flex-col gap-[10px] md:pt-2 md:flex-row xl:flex-wrap 2xl:flex-nowrap">
              <Link
                href="/"
                className="group flex h-[60px] w-full items-center justify-between rounded-[9px] bg-[var(--accent)] px-5 text-lg font-normal tracking-[-0.04em] text-white transition-colors duration-200 hover:bg-white hover:text-[var(--accent)] md:w-auto md:min-w-[284px] xl:flex-1 2xl:w-[283px] 2xl:flex-none"
              >
                <span className="self-start pt-2">На главную</span>
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-[5px] bg-white transition-colors duration-200 group-hover:bg-[var(--accent)]">
                  <Image
                    src={SECONDARY_ARROW_ICON_SRC}
                    alt=""
                    width={17}
                    height={17}
                    aria-hidden="true"
                    className="size-[17px] transition-[transform,filter] duration-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:brightness-0 group-hover:invert"
                  />
                </span>
              </Link>
              <Link
                href={tgSocialHref}
                aria-label="Telegram"
                target="_blank"
                rel="noreferrer"
                className={cn(
                  buttonVariants({ variant: "white" }),
                  "group hidden h-[60px] w-[60px] items-center justify-center rounded-[9px] border-transparent bg-white p-0 text-[var(--accent)] transition-colors duration-200 hover:bg-[var(--accent)] xl:flex",
                )}
              >
                <svg viewBox="0 0 560 450" className="size-[27px]" aria-hidden="true">
                  <path
                    d={TG_ICON_PATH}
                    className="fill-[var(--accent)] transition-colors duration-200 group-hover:fill-white"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
              <Link
                href={maxSocialHref}
                aria-label="MAX"
                target="_blank"
                rel="noreferrer"
                className={cn(
                  buttonVariants({ variant: "white" }),
                  "group hidden h-[60px] w-[60px] items-center justify-center rounded-[9px] border-transparent bg-white p-0 text-[var(--accent)] transition-colors duration-200 hover:bg-[var(--accent)] xl:flex",
                )}
              >
                <svg viewBox="0 0 40 40" className="size-[40px]" aria-hidden="true" fill="none">
                  <path d={MAX_ICON_PATH} className="fill-[var(--accent)] transition-colors duration-200 group-hover:fill-white" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        <div className="relative hidden xl:block h-full overflow-visible 2xl:overflow-hidden">
          <img
            loading="eager"
            src={HERO_IMAGE.src}
            alt={HERO_IMAGE.alt}
            className="absolute right-0 2xl:right-auto top-0 h-full 2xl:h-auto w-auto 2xl:w-full max-w-none"
          />
        </div>
      </div>
    </section>
  );
}
