import { cn } from "@/shared/lib/cn";

type ContactPillsProps = {
  email: string;
  phone: string;
  direction?: "row" | "column";
  className?: string;
};

export function ContactPills({
  email,
  phone,
  direction = "row",
  className,
}: ContactPillsProps) {
  return (
    <div
      className={cn(
        "inline-flex flex-wrap gap-2",
        direction === "column" ? "flex-col items-start" : "items-center",
        className,
      )}
    >
      <a
        href={`mailto:${email}`}
        className="cta-link inline-flex min-h-10 items-center justify-center whitespace-nowrap rounded-[12px] bg-[var(--accent)] px-[0.9rem] py-[0.55rem] text-[0.88rem] text-white"
        aria-label="Написать на email"
      >
        {email}
      </a>
      <a
        href={`tel:${phone.replace(/\D+/g, "")}`}
        className="cta-link inline-flex min-h-10 items-center justify-center whitespace-nowrap rounded-[12px] bg-[var(--accent)] px-[0.9rem] py-[0.55rem] text-[0.88rem] text-white"
        aria-label="Позвонить"
      >
        {phone}
      </a>
    </div>
  );
}