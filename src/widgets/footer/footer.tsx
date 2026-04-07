import Link from "next/link";
import { siteNavigation } from "@/shared/config/navigation";
import { siteInfo } from "@/shared/config/site-info";
import { SocialLinks } from "@/shared/ui/social-links";

const footerNavigation = siteNavigation.filter((item) => item.href !== "/");

export function Footer() {
  return (
    <footer className="site-footer mt-auto bg-[var(--accent)] text-white">
      <div className="footer-main">
        <SocialLinks variant="footer" />

        <div className="footer-column">
          <h2 className="footer-title">Навигация</h2>
          <nav aria-label="Навигация в футере" className="footer-links">
            {footerNavigation.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <address className="footer-column not-italic">
          <h2 className="footer-title">Адрес</h2>
          <p>{siteInfo.address}</p>
        </address>
      </div>

      <div className="footer-bottom">
        <p>{siteInfo.copyright}</p>
        <Link href="/privacy">{siteInfo.privacyLabel}</Link>
      </div>
    </footer>
  );
}