import { siteNavigation } from "@/shared/config/navigation";
import { siteInfo } from "@/shared/config/site-info";
import { SocialLinks } from "@/shared/ui/social-links";
import Image from "next/image";
import Link from "next/link";

const footerNavigation = siteNavigation.filter((item) => item.href !== "/");
const footerDescription = "Создаём корпоративный мерч и подарки, которые носят, помнят и связывают с брендом.";

export function Footer() {
  return (
    <footer className="relative mt-auto overflow-hidden bg-[var(--accent)] px-[var(--layout-side-padding)] pt-12 pb-24 text-white md:pt-16 md:pb-32 xl:pt-[69px] xl:pb-[135px]">
      <div className="relative z-10">
        <div className="grid gap-10 md:gap-12 xl:grid-cols-[minmax(0,1fr)_190px_292px] xl:items-start xl:gap-12">
          <div className="max-w-[480px] flex flex-col gap-[36px] md:gap-[48px]">
            <Link href="/" aria-label={siteInfo.brandName} className="inline-flex w-[220px] md:w-[260px] xl:w-[380px]">
              <Image src="/logo-dm-white.svg" alt={siteInfo.brandName} width={300} height={40} priority className="h-auto w-full" />
            </Link>

            <p className="max-w-[480px] text-base leading-[1.3] tracking-[-0.03em] text-white/50 md:text-lg xl:text-xl">{footerDescription}</p>

            <SocialLinks variant="footer" />
          </div>

          <div className="min-w-0 xl:pt-[2px]">
            <h2 className="text-sm font-medium uppercase leading-[1.0835] text-[#e4e4e4] md:text-lg xl:text-xl">Навигация</h2>
            <nav aria-label="Навигация в футере" className="mt-5 grid gap-2 text-sm leading-normal text-white md:text-base xl:mt-[18px] xl:text-sm">
              {footerNavigation.map((item) => (
                <Link key={item.href} href={item.href} className="w-fit transition-opacity hover:opacity-70">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <address className="min-w-0 not-italic xl:pt-[2px]">
            <h2 className="text-sm font-medium uppercase leading-[1.0835] text-[#e4e4e4] md:text-lg xl:text-xl">Адрес</h2>
            <p className="mt-5 max-w-[292px] text-sm leading-normal text-white md:text-base xl:mt-[18px] xl:text-sm">{siteInfo.address}</p>
          </address>
        </div>

        <div className="mt-12 flex flex-col gap-4 pt-6 text-white/50 md:mt-14 md:pt-8 xl:mt-[66px] xl:min-h-[114px] xl:flex-row xl:items-start xl:justify-between xl:pt-[26px]">
          <p className="text-sm leading-normal md:text-base xl:text-xl xl:tracking-[-0.02em]">{siteInfo.copyright}</p>
          <Link
            href={siteInfo.privacyHref}
            target="_blank"
            rel="noopener noreferrer"
            className="w-fit text-sm leading-normal transition-opacity hover:opacity-80 md:text-base xl:pt-[2px] xl:text-xl"
          >
            {siteInfo.privacyLabel}
          </Link>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden" aria-hidden="true">
        <Image src="/img_footer_cover.png" alt="" width={1920} height={220} className="relative w-full" />
      </div>
    </footer>
  );
}
