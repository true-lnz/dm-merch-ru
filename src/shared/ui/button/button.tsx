import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const buttonVariantClassMap: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] focus-visible:outline-[var(--accent)]",
  secondary:
    "bg-transparent text-[var(--text)] border border-[var(--border)] hover:bg-[var(--surface)] focus-visible:outline-[var(--accent)]",
  ghost:
    "bg-transparent text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface)] focus-visible:outline-[var(--accent)]",
};

export function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex h-11 items-center justify-center rounded-lg px-5 text-sm font-semibold tracking-[-0.02em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50",
        buttonVariantClassMap[variant],
        className,
      )}
      {...props}
    />
  );
}
