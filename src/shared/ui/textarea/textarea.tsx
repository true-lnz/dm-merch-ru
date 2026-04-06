import type { TextareaHTMLAttributes } from "react";
import { cn } from "@/shared/lib/cn";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full resize-none border-0 border-b border-[var(--field-border)] bg-transparent px-0 py-2 text-sm text-[var(--text)] outline-none placeholder:text-[var(--field-text)] focus:border-[var(--accent)]",
        className,
      )}
      {...props}
    />
  );
}
