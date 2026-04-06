import type { PropsWithChildren } from "react";
import { cn } from "@/shared/lib/cn";

type SectionProps = PropsWithChildren<{
  className?: string;
}>;

export function Section({ children, className }: SectionProps) {
  return <section className={cn("surface", className)}>{children}</section>;
}
