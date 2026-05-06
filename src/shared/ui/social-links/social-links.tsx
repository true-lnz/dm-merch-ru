"use client";

import { useSiteInfo } from "@/shared/config/site-info/site-info-provider";
import { cn } from "@/shared/lib/cn";

const TG_ICON_PATH =
  "M37.3284 193.722C183.089 130.217 280.285 88.35 328.917 68.1222C467.773 10.3674 496.625 0.334815 515.431 0.00353222C519.568 -0.0693298 528.816 0.95574 534.806 5.8167C539.865 9.92121 541.257 15.4658 541.923 19.3573C542.589 23.2488 543.418 32.1138 542.759 39.0407C535.234 118.102 502.675 309.965 486.111 398.515C479.102 435.984 465.301 448.548 451.941 449.777C422.905 452.449 400.856 430.588 372.733 412.153C328.727 383.306 303.866 365.349 261.15 337.2C211.784 304.669 243.786 286.789 271.919 257.569C279.282 249.921 407.215 133.556 409.691 123C410.001 121.68 410.288 116.759 407.365 114.16C404.441 111.562 400.126 112.45 397.012 113.157C392.599 114.159 322.298 160.625 186.11 252.556C166.155 266.259 148.081 272.935 131.887 272.585C114.034 272.199 79.6928 262.491 54.1636 254.192C22.8511 244.014 -2.03552 238.632 0.131547 221.346C1.26029 212.343 13.6592 203.135 37.3284 193.722Z";

const VK_ICON_PATH =
  "M31.9141 28H28.9597C27.8413 28 27.5037 27.0949 25.4989 25.0953C23.7473 23.4115 23.0088 23.2009 22.5656 23.2009C21.9537 23.2009 21.7848 23.3693 21.7848 24.2113V26.8634C21.7848 27.5791 21.5527 28 19.6746 28C17.8521 27.8779 16.0848 27.3256 14.5181 26.3888C12.9515 25.452 11.6304 24.1573 10.6637 22.6115C8.36857 19.7622 6.77168 16.418 6 12.845C6 12.403 6.16878 12.003 7.01293 12.003H9.96727C10.727 12.003 11.0014 12.3398 11.2967 13.1187C12.7317 17.3284 15.1797 20.9908 16.1715 20.9908C16.5513 20.9908 16.7201 20.8225 16.7201 19.8753V15.5392C16.5935 13.5607 15.5384 13.3922 15.5384 12.6767C15.5523 12.4879 15.6394 12.3119 15.7812 12.1861C15.9231 12.0604 16.1085 11.9947 16.2981 12.003H20.9407C21.5738 12.003 21.7848 12.3188 21.7848 13.0765V18.9281C21.7848 19.5596 22.0591 19.77 22.2491 19.77C22.6289 19.77 22.9243 19.5596 23.6207 18.865C25.1172 17.0447 26.3399 15.0168 27.2504 12.845C27.3433 12.5837 27.5195 12.3599 27.752 12.2079C27.9844 12.0558 28.2604 11.9839 28.5377 12.003H31.4921C32.3784 12.003 32.5683 12.4451 32.3784 13.0765C31.3034 15.4777 29.9734 17.757 28.4111 19.8753C28.0946 20.3594 27.968 20.6119 28.4111 21.1803C28.7065 21.6223 29.7406 22.4852 30.437 23.3061C31.4499 24.3139 32.291 25.48 32.927 26.7582C33.1802 27.5791 32.7582 28 31.9141 28Z";

const MAX_ICON_PATH =
  "M20.2594 31.9333C17.9015 31.9333 16.8061 31.5867 14.9072 30.1995C13.6987 31.7602 9.89454 32.9744 9.72701 30.8931C9.72701 29.3337 9.3785 28.0199 8.99413 26.5739C8.52339 24.8021 8 22.8313 8 19.967C8 13.1376 13.5803 8 20.1972 8C26.8125 8 32 13.3874 32 20.0336C32 26.679 26.6471 31.9335 20.2591 31.9335L20.2594 31.9333ZM20.3549 13.905C17.1355 13.7357 14.6234 15.9781 14.0694 19.4883C13.6102 22.3953 14.4238 25.9372 15.1195 26.1154C15.4479 26.1994 16.2883 25.5169 16.8057 24.9966C17.6582 25.5512 18.6356 25.9812 19.7224 26.0377C23.0278 26.2115 25.9563 23.6149 26.1298 20.2967C26.3034 16.9782 23.6605 14.079 20.3551 13.905H20.3549Z";

const SOCIAL_ICON_CONFIG = {
  tg: {
    path: TG_ICON_PATH,
    viewBox: "0 0 560 450",
    className: "w-auto h-5",
    menuClassName: "w-auto h-5",
  },
  vk: {
    path: VK_ICON_PATH,
    viewBox: "0 0 40 40",
    className: "size-full",
    menuClassName: "size-full",
  },
  max: {
    path: MAX_ICON_PATH,
    viewBox: "0 0 40 40",
    className: "size-full",
    menuClassName: "size-full",
  },
} as const;

type SocialLinksProps = {
  className?: string;
  variant?: "default" | "white" | "footer";
  ariaLabel?: string;
  size?: "default" | "menu";
};

export function SocialLinks({ className, variant = "default", ariaLabel = "Социальные сети", size = "default" }: SocialLinksProps) {
  const siteInfo = useSiteInfo();
  const iconColor = variant === "white" || variant === "footer" ? "#0252C5" : "#FFFFFF";
  const itemSizeClassName = size === "menu" ? "size-9" : "size-[37px]";
  const itemRadiusClassName = size === "menu" ? "rounded-[9px]" : "rounded-[10px]";
  const isFooterVariant = variant === "footer";
  const visibleSocials = siteInfo.socials.filter((social) => social.icon !== "vk");

  return (
    <nav className={className} aria-label={ariaLabel}>
      <ul className="flex items-center gap-2">
        {visibleSocials.map((social) => {
          const icon = SOCIAL_ICON_CONFIG[social.icon];

          return (
            <li key={social.label} className={itemSizeClassName}>
              <a
                href={social.href}
                aria-label={social.label}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  "inline-flex items-center justify-center transition-[opacity,background-color,color]",
                  itemSizeClassName,
                  itemRadiusClassName,
                  variant === "white"
                    ? "bg-white hover:bg-[#f3f3ff]"
                    : isFooterVariant
                      ? "bg-white/50 hover:bg-white focus-visible:bg-white"
                      : "bg-[var(--accent)] hover:bg-[var(--accent-hover)]",
                )}
              >
                <svg viewBox={icon.viewBox} className={size === "menu" ? icon.menuClassName : icon.className} aria-hidden="true" fill="none">
                  <path
                    d={icon.path}
                    fill={iconColor}
                    fillRule={social.icon === "tg" ? "evenodd" : undefined}
                    clipRule={social.icon === "tg" ? "evenodd" : undefined}
                  />
                </svg>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
