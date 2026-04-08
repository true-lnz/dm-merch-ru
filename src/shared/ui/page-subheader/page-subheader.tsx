import type { ReactNode } from "react";
import {cn} from "@/shared/lib/cn";

type PageSubheaderProps = {
  title: ReactNode;
  className?: string;
};

export function PageSubheader({
  title,
  className,
}: PageSubheaderProps) {
  return (
    <h2 className={cn("font-heading text-[56px] uppercase leading-[0.95] tracking-[0.015em] text-[var(--heading)] md:text-[84.48px]", className)}>
      {title}
    </h2>
  );
}
