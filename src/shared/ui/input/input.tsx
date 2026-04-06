import type { InputHTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-11 w-full border-0 border-b border-[var(--field-border)] bg-transparent px-0 py-2 text-sm text-[var(--text)] outline-none placeholder:text-[var(--field-text)] focus:border-[var(--accent)]",
        className,
      )}
      {...props}
    />
  );
}
