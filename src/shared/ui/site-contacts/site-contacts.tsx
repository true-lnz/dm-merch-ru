"use client";

import { useSiteInfo } from "@/shared/config/site-info/site-info-provider";
import { cn } from "@/shared/lib/cn";
import { ContactPills } from "@/shared/ui/contact-pills";
import { SocialLinks } from "@/shared/ui/social-links";

type SiteContactsProps = {
  className?: string;
  direction?: "row" | "column";
  showSocials?: boolean;
  socialVariant?: "default" | "white";
};

export function SiteContacts({
  className,
  direction = "row",
  showSocials = true,
  socialVariant = "default",
}: SiteContactsProps) {
  const siteInfo = useSiteInfo();
  const isColumn = direction === "column";

  return (
    <div
      className={cn(
        "flex flex-wrap gap-2",
        isColumn ? "items-start" : "items-center justify-end",
        className,
      )}
    >
      {showSocials ? <SocialLinks variant={socialVariant} /> : null}
      <ContactPills email={siteInfo.email} phone={siteInfo.phone} direction={direction} />
    </div>
  );
}
