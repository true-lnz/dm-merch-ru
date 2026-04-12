import Link from "next/link";
import { siteNavigation } from "@/shared/config/navigation";
import { siteInfo } from "@/shared/config/site-info";
import { SocialLinks } from "@/shared/ui/social-links";

const footerNavigation = siteNavigation.filter((item) => item.href !== "/");

export function Footer() {
  return (
    <footer className="mt-auto bg-[var(--accent)] px-[var(--layout-side-padding)] text-white">
      <div className="grid gap-12 pt-14 pb-16 lg:grid-cols-[1fr_auto_auto] lg:items-start lg:gap-[11.5rem] lg:pt-[90px] lg:pb-[88px]">
        <SocialLinks variant="white" className="self-start" />

        <div className="min-w-[190px]">
          <h2 className="mb-[22px] text-sm font-medium uppercase leading-[1.0835] text-[#e4e4e4] md:text-xl">
            Навигация
          </h2>
          <nav aria-label="Навигация в футере" className="grid gap-[10px] text-xs leading-normal text-white md:text-sm">
            {footerNavigation.map((item) => (
              <Link key={item.href} href={item.href} className="w-fit transition-opacity hover:opacity-80">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <address className="min-w-[292px] not-italic">
          <h2 className="mb-[22px] text-lg font-medium uppercase leading-[1.0835] text-[#e4e4e4]">
            Адрес
          </h2>
          <p className="max-w-[292px] text-xs leading-normal text-white md:text-sm">{siteInfo.address}</p>
        </address>
      </div>

      <div className="flex flex-col gap-4 text-[#e4e4e4]/50 lg:min-h-[114px] lg:flex-row lg:items-center lg:justify-between">
        <p className="order-2 mb-6 text-xs leading-normal md:mb-0 md:text-lg lg:order-1">
          {siteInfo.copyright}
        </p>
        <Link href="/privacy" className="order-1 w-fit text-xs leading-normal transition-opacity hover:opacity-80 md:text-lg lg:order-2">
          {siteInfo.privacyLabel}
        </Link>
      </div>
    </footer>
  );
}
