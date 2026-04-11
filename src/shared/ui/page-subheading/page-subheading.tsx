import { cn } from "@/shared/lib/cn";
import type { ReactNode } from "react";

type PageSubheadingProps = {
  title: ReactNode;
  description?: ReactNode;
  descriptionPlacement?: "side" | "bottom";
  className?: string;
  containerClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
};

export function PageSubheading({
  title,
  description,
  descriptionPlacement = "bottom",
  className,
  containerClassName,
  titleClassName,
  descriptionClassName,
}: PageSubheadingProps) {
  if (!description) {
    return (
      <h2
        className={cn(
          "font-heading break-keep whitespace-pre-line text-4xl md:text-5xl xl:text-6xl uppercase leading-[0.95] tracking-[0.015em] text-[var(--heading)] md:text-[84.48px]",
          className,
          titleClassName,
        )}
      >
        {title}
      </h2>
    );
  }

  return (
    <div
      className={cn(
        "flex gap-5",
        descriptionPlacement === "side"
          ? "flex-col xl:grid xl:grid-cols-[minmax(0,1fr)_minmax(280px,0.52fr)] xl:items-end xl:gap-10"
          : "flex-col",
        className,
        containerClassName,
      )}
    >
      <h2
        className={cn(
          "font-heading whitespace-pre-line text-[56px] uppercase leading-[0.95] tracking-[0.015em] text-[var(--heading)] md:text-[84.48px]",
          titleClassName,
        )}
      >
        {title}
      </h2>
      <div
        className={cn(
          "max-w-[44rem] text-[15px] leading-[1.35] tracking-[-0.03em] text-[var(--text-muted)] md:text-[18px]",
          descriptionPlacement === "side" && "xl:justify-self-end xl:pb-2",
          descriptionClassName,
        )}
      >
        {description}
      </div>
    </div>
  );
}
