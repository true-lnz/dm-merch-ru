import { cn } from "@/shared/lib/cn";

type ContactPillsProps = {
  email: string;
  phone: string;
  direction?: "row" | "column";
  variant?: "header" | "cta";
  className?: string;
};

export function ContactPills({
  email,
  phone,
  direction = "row",
  variant = "header",
  className,
}: ContactPillsProps) {
  return (
    <div
      className={cn(
        "contact-pills",
        direction === "column" && "is-column",
        `contact-pills-${variant}`,
        className,
      )}
    >
      <a
        href={`mailto:${email}`}
        className="contact-pill"
        aria-label="Написать на email"
      >
        {email}
      </a>
      <a
        href={`tel:${phone.replace(/\D+/g, "")}`}
        className="contact-pill"
        aria-label="Позвонить"
      >
        {phone}
      </a>
    </div>
  );
}
