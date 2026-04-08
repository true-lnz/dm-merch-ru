import { siteInfo } from "@/shared/config/site-info";
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