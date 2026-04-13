import { siteInfo } from "@/shared/config/site-info";
import { cn } from "@/shared/lib/cn";
import { buttonVariants } from "@/shared/ui/button";
import { PageHeading } from "@/shared/ui/page-heading";
import Image from "next/image";
import Link from "next/link";

const HERO_IMAGE = {
  src: "/home/img_home_hero_cover.png",
  alt: "Команда в фирменном мерче",
} as const;

const HEADING_TEMPLATE = "Спасибо за обращение,\nТУТ_ИМЯ!";
const SECONDARY_ARROW_ICON_SRC = "/icons/ic_link_arrow_button.svg";
const MAX_ICON_PATH =
  "M20.2594 31.9333C17.9015 31.9333 16.8061 31.5867 14.9072 30.1995C13.6987 31.7602 9.89454 32.9744 9.72701 30.8931C9.72701 29.3337 9.3785 28.0199 8.99413 26.5739C8.52339 24.8021 8 22.8313 8 19.967C8 13.1376 13.5803 8 20.1972 8C26.8125 8 32 13.3874 32 20.0336C32 26.679 26.6471 31.9335 20.2591 31.9335L20.2594 31.9333ZM20.3549 13.905C17.1355 13.7357 14.6234 15.9781 14.0694 19.4883C13.6102 22.3953 14.4238 25.9372 15.1195 26.1154C15.4479 26.1994 16.2883 25.5169 16.8057 24.9966C17.6582 25.5512 18.6356 25.9812 19.7224 26.0377C23.0278 26.2115 25.9563 23.6149 26.1298 20.2967C26.3034 16.9782 23.6605 14.079 20.3551 13.905H20.3549Z";

const VK_ICON_PATH =
  "M31.9141 28H28.9597C27.8413 28 27.5037 27.0949 25.4989 25.0953C23.7473 23.4115 23.0088 23.2009 22.5656 23.2009C21.9537 23.2009 21.7848 23.3693 21.7848 24.2113V26.8634C21.7848 27.5791 21.5527 28 19.6746 28C17.8521 27.8779 16.0848 27.3256 14.5181 26.3888C12.9515 25.452 11.6304 24.1573 10.6637 22.6115C8.36857 19.7622 6.77168 16.418 6 12.845C6 12.403 6.16878 12.003 7.01293 12.003H9.96727C10.727 12.003 11.0014 12.3398 11.2967 13.1187C12.7317 17.3284 15.1797 20.9908 16.1715 20.9908C16.5513 20.9908 16.7201 20.8225 16.7201 19.8753V15.5392C16.5935 13.5607 15.5384 13.3922 15.5384 12.6767C15.5523 12.4879 15.6394 12.3119 15.7812 12.1861C15.9231 12.0604 16.1085 11.9947 16.2981 12.003H20.9407C21.5738 12.003 21.7848 12.3188 21.7848 13.0765V18.9281C21.7848 19.5596 22.0591 19.77 22.2491 19.77C22.6289 19.77 22.9243 19.5596 23.6207 18.865C25.1172 17.0447 26.3399 15.0168 27.2504 12.845C27.3433 12.5837 27.5195 12.3599 27.752 12.2079C27.9844 12.0558 28.2604 11.9839 28.5377 12.003H31.4921C32.3784 12.003 32.5683 12.4451 32.3784 13.0765C31.3034 15.4777 29.9734 17.757 28.4111 19.8753C28.0946 20.3594 27.968 20.6119 28.4111 21.1803C28.7065 21.6223 29.7406 22.4852 30.437 23.3061C31.4499 24.3139 32.291 25.48 32.927 26.7582C33.1802 27.5791 32.7582 28 31.9141 28Z";

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
  const maxSocialHref = siteInfo.socials.find((social) => social.icon === "max")?.href ?? "#";
  const vkSocialHref = siteInfo.socials.find((social) => social.icon === "vk")?.href ?? "#";
  const heading = HEADING_TEMPLATE.replace("ТУТ_ИМЯ", resolveName(resolvedSearchParams?.name));

  return (
    <section className="mt-[36px] relative w-full overflow-visible">
      <div className="flex min-h-0 w-full justify-start xl:h-[80vh] 2xl:h-[90vh]">
        <div className="pointer-events-none absolute inset-y-0 hidden right-[calc(var(--layout-side-padding)*-1)] w-[65%] xl:block 2xl:w-[55%]">
          <Image src={HERO_IMAGE.src} alt={HERO_IMAGE.alt} fill priority unoptimized sizes="42vw" className="object-cover object-[130%_top]" />
        </div>

        <div className="relative z-10 mb-16 flex w-full justify-center xl:block xl:w-1/2 xl:max-w-[50%]">
          <div className="flex w-full flex-col px-[0px] pb-[0px] pt-5 xl:h-full xl:max-w-none xl:justify-between rounded-[18px] md:rounded-[22.5px] xl:bg-[rgba(232,231,226,0.7)] xl:px-[50px] xl:pb-[50px] xl:pt-[50px] xl:backdrop-blur-[8px]">
            <div className="flex flex-col gap-5 xl:gap-[30px]">
              <PageHeading title={heading} />
              <p className="max-w-[340px] text-sm md:text-lg xl:text-2xl leading-[1.3] tracking-[-0.03em] text-[#2a2a2a] md:max-w-[38rem] md:text-[18px] xl:max-w-[532px] xl:text-[21.6px]">Ваша заявка уже у нас в работе.</p>
              <p className="max-w-[340px] text-sm md:text-lg xl:text-2xl leading-[1.3] tracking-[-0.03em] text-[#2a2a2a] md:max-w-[38rem] md:text-[18px] xl:max-w-[532px] xl:text-[21.6px]">Поможем подобрать продукцию, которая будет полезна бизнесу, понравится сотрудникам и усилит бренд.</p>
            </div>

            <div className="relative aspect-[340/314] w-full overflow-hidden md:aspect-[16/12] xl:hidden">
              <Image src={HERO_IMAGE.src} alt={HERO_IMAGE.alt} fill priority sizes="(max-width: 767px) calc(100vw - 60px), 420px" className="object-cover object-center" />
            </div>

            <div className="mt-8 sm:mt-0 flex flex-col gap-[10px] md:flex-row">
              <Link
                href="/"
                className="group flex h-[60px] w-full items-center justify-between rounded-[9px] bg-[var(--accent)] px-5 text-[16px] font-normal tracking-[-0.04em] text-white transition-colors duration-200 hover:bg-white hover:text-[var(--accent)] md:w-[284px] xl:w-[283.6px] xl:text-[19.46px]"
              >
                <span className="self-start pt-2">На главную</span>
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-[5px] bg-white transition-colors duration-200 group-hover:bg-[var(--accent)] xl:size-[39.52px] xl:rounded-[4px]">
                  <Image src={SECONDARY_ARROW_ICON_SRC} alt="" width={17} height={17} aria-hidden="true" className="size-[17px] transition-[transform,filter] duration-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:brightness-0 group-hover:invert xl:size-[13.55px]" />
                </span>
              </Link>
              <Link
                href={vkSocialHref}
                aria-label="MAX"
                target="_blank"
                rel="noreferrer"
                className={cn(buttonVariants({ variant: "white" }), "group hidden h-[60px] w-[60px] items-center justify-center rounded-[9px] border-transparent bg-white p-0 text-[var(--accent)] transition-colors duration-200 hover:bg-[var(--accent)] xl:flex")}
              >
                <svg viewBox="0 0 40 40" className="size-[40px] xl:size-[48px]" aria-hidden="true" fill="none">
                  <path d={VK_ICON_PATH} className="fill-[var(--accent)] transition-colors duration-200 group-hover:fill-white" />
                </svg>
              </Link>
              <Link
                href={maxSocialHref}
                aria-label="MAX"
                target="_blank"
                rel="noreferrer"
                className={cn(buttonVariants({ variant: "white" }), "group hidden h-[60px] w-[60px] items-center justify-center rounded-[9px] border-transparent bg-white p-0 text-[var(--accent)] transition-colors duration-200 hover:bg-[var(--accent)] xl:flex")}
              >
                <svg viewBox="0 0 40 40" className="size-[40px] xl:size-[48px]" aria-hidden="true" fill="none">
                  <path d={MAX_ICON_PATH} className="fill-[var(--accent)] transition-colors duration-200 group-hover:fill-white" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
