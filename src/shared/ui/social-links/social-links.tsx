import { siteInfo } from "@/shared/config/site-info";
import { cn } from "@/shared/lib/cn";

type SocialLinksVariant = "header" | "footer" | "cta";

type SocialLinksProps = {
  className?: string;
  variant?: SocialLinksVariant;
  ariaLabel?: string;
};

type SocialVariantStyles = {
  wrapper: string;
  background: string;
  foreground: string;
};

const socialLinkVariantClassMap: Record<SocialLinksVariant, SocialVariantStyles> = {
  header: {
    wrapper: "inline-flex size-[38px] overflow-hidden rounded-[10px]",
    background: "#0252C5",
    foreground: "#FFFFFF",
  },
  footer: {
    wrapper: "inline-flex size-[38px] overflow-hidden rounded-[10px] ring-1 ring-white/20",
    background: "#FFFFFF",
    foreground: "#0252C5",
  },
  cta: {
    wrapper: "inline-flex size-[38px] overflow-hidden rounded-[10px] ring-1 ring-[var(--border)]",
    background: "#FFFFFF",
    foreground: "#0252C5",
  },
};

type SocialIconProps = {
  label: string;
  background: string;
  foreground: string;
};

function SocialIcon({ label, background, foreground }: SocialIconProps) {
  if (label === "VK") {
    return (
      <svg viewBox="0 0 40 40" className="size-full" aria-hidden="true" fill="none">
        <rect width="40" height="40" rx="10" fill={background} />
        <path
          d="M31.9141 28H28.9597C27.8413 28 27.5037 27.0949 25.4989 25.0953C23.7473 23.4115 23.0088 23.2009 22.5656 23.2009C21.9537 23.2009 21.7848 23.3693 21.7848 24.2113V26.8634C21.7848 27.5791 21.5527 28 19.6746 28C17.8521 27.8779 16.0848 27.3256 14.5181 26.3888C12.9515 25.452 11.6304 24.1573 10.6637 22.6115C8.36857 19.7622 6.77168 16.418 6 12.845C6 12.403 6.16878 12.003 7.01293 12.003H9.96727C10.727 12.003 11.0014 12.3398 11.2967 13.1187C12.7317 17.3284 15.1797 20.9908 16.1715 20.9908C16.5513 20.9908 16.7201 20.8225 16.7201 19.8753V15.5392C16.5935 13.5607 15.5384 13.3922 15.5384 12.6767C15.5523 12.4879 15.6394 12.3119 15.7812 12.1861C15.9231 12.0604 16.1085 11.9947 16.2981 12.003H20.9407C21.5738 12.003 21.7848 12.3188 21.7848 13.0765V18.9281C21.7848 19.5596 22.0591 19.77 22.2491 19.77C22.6289 19.77 22.9243 19.5596 23.6207 18.865C25.1172 17.0447 26.3399 15.0168 27.2504 12.845C27.3433 12.5837 27.5195 12.3599 27.752 12.2079C27.9844 12.0558 28.2604 11.9839 28.5377 12.003H31.4921C32.3784 12.003 32.5683 12.4451 32.3784 13.0765C31.3034 15.4777 29.9734 17.757 28.4111 19.8753C28.0946 20.3594 27.968 20.6119 28.4111 21.1803C28.7065 21.6223 29.7406 22.4852 30.437 23.3061C31.4499 24.3139 32.291 25.48 32.927 26.7582C33.1802 27.5791 32.7582 28 31.9141 28Z"
          fill={foreground}
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 40 40" className="size-full" aria-hidden="true" fill="none">
      <rect width="40" height="40" rx="10" fill={background} />
      <path
        d="M20.2594 31.9333C17.9015 31.9333 16.8061 31.5867 14.9072 30.1995C13.6987 31.7602 9.89454 32.9744 9.72701 30.8931C9.72701 29.3337 9.3785 28.0199 8.99413 26.5739C8.52339 24.8021 8 22.8313 8 19.967C8 13.1376 13.5803 8 20.1972 8C26.8125 8 32 13.3874 32 20.0336C32 26.679 26.6471 31.9335 20.2591 31.9335L20.2594 31.9333ZM20.3549 13.905C17.1355 13.7357 14.6234 15.9781 14.0694 19.4883C13.6102 22.3953 14.4238 25.9372 15.1195 26.1154C15.4479 26.1994 16.2883 25.5169 16.8057 24.9966C17.6582 25.5512 18.6356 25.9812 19.7224 26.0377C23.0278 26.2115 25.9563 23.6149 26.1298 20.2967C26.3034 16.9782 23.6605 14.079 20.3551 13.905H20.3549Z"
        fill={foreground}
      />
    </svg>
  );
}

export function SocialLinks({
  className,
  variant = "header",
  ariaLabel = "Социальные сети",
}: SocialLinksProps) {
  const styles = socialLinkVariantClassMap[variant];

  return (
    <div className={cn("inline-flex gap-2", className)} aria-label={ariaLabel}>
      {siteInfo.socials.map((social) => (
        <a
          key={social.label}
          href={social.href}
          className={styles.wrapper}
          aria-label={social.label}
        >
          <SocialIcon
            label={social.label}
            background={styles.background}
            foreground={styles.foreground}
          />
        </a>
      ))}
    </div>
  );
}