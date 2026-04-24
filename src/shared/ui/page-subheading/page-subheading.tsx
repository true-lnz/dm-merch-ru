import { cn } from "@/shared/lib/cn";
import type { ReactNode } from "react";

type PageSubheadingProps = {
  title: ReactNode;
  description?: ReactNode;
  descriptionPlacement?: "side" | "bottom";
  sideDescriptionLayout?: "two-columns" | "three-columns-middle";
  className?: string;
  containerClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
};

export function PageSubheading({
  title,
  description,
  descriptionPlacement = "bottom",
  sideDescriptionLayout = "two-columns",
  className,
  containerClassName,
  titleClassName,
  descriptionClassName,
}: PageSubheadingProps) {
  if (!description) {
    return (
      <h2
        className={cn(
          "font-heading break-keep whitespace-pre-line text-4xl md:text-5xl xl:text-6xl uppercase leading-[0.95] tracking-[0.015em] text-[var(--heading)]",
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
        "flex gap-2",
        descriptionPlacement === "side"
          ? cn("flex-col xl:grid xl:items-end xl:gap-[27px]", sideDescriptionLayout === "three-columns-middle" ? "xl:grid-cols-3" : "xl:grid-cols-2")
          : "flex-col",
        className,
        containerClassName,
      )}
    >
      <h2
        className={cn(
          "font-heading whitespace-pre-line text-4xl sm:text-5xl md:text-6xl uppercase leading-[0.95] tracking-[0.015em] text-[var(--heading)]",
          descriptionPlacement === "side" && sideDescriptionLayout === "three-columns-middle" && "xl:col-span-2",
          titleClassName,
        )}
      >
        {title}
      </h2>
      <div
        className={cn(
          "max-w-[44rem] text-sm sm:text-lg xl:text-2xl leading-[1.35] tracking-[-0.03em] text-[#404040]",
          descriptionPlacement === "side" && "xl:mb-[10px]",
          descriptionPlacement === "side" && sideDescriptionLayout === "three-columns-middle" && "xl:col-start-3 xl:justify-self-stretch",
          descriptionClassName,
        )}
      >
        {description}
      </div>
    </div>
  );
}
