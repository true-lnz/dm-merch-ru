import Image from "next/image";
import { siteInfo } from "@/shared/config/site-info";
import { cn } from "@/shared/lib/cn";
import { ContactPills } from "@/shared/ui/contact-pills";

type SiteContactsProps = {
  className?: string;
  direction?: "row" | "column";
  showSocials?: boolean;
};

export function SiteContacts({
  className,
  direction = "row",
  showSocials = true,
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
      {showSocials ? (
        <div className="inline-flex gap-2" aria-label="Социальные сети">
          {siteInfo.socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              className="inline-flex size-[38px] overflow-hidden rounded-[10px]"
              aria-label={social.label}
            >
              <Image src={social.iconSrc} alt="" width={38} height={38} aria-hidden="true" />
            </a>
          ))}
        </div>
      ) : null}
      <ContactPills email={siteInfo.email} phone={siteInfo.phone} direction={direction} />
    </div>
  );
}