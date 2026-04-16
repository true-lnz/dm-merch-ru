import * as React from "react";

import { cn } from "@/shared/lib/cn";

type TextareaProps = React.ComponentProps<"textarea"> & {
  floatingLabel?: boolean;
  label?: string;
  floatingLabelClassName?: string;
};

function Textarea({
  className,
  floatingLabel = true,
  label,
  floatingLabelClassName,
  id,
  placeholder,
  ...props
}: TextareaProps) {
  const generatedId = React.useId();
  const resolvedId = id ?? generatedId;
  const labelText = label ?? (typeof placeholder === "string" ? placeholder : "");

  if (!floatingLabel || !labelText) {
    return (
      <textarea
        id={resolvedId}
        data-slot="textarea"
        className={cn(
          "flex field-sizing-content min-h-16 w-full rounded-lg border border-input bg-transparent px-2.5 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
          className
        )}
        placeholder={placeholder}
        {...props}
      />
    );
  }

  return (
    <div className="relative w-full">
      <textarea
        id={resolvedId}
        data-slot="textarea"
        className={cn(
          "peer flex field-sizing-content min-h-16 w-full rounded-lg border border-input bg-transparent px-2.5 text-base transition-colors outline-none placeholder:text-transparent focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
          className
        )}
        placeholder=" "
        aria-label={props["aria-label"] ?? labelText}
        {...props}
      />
      <label
        htmlFor={resolvedId}
        className={cn(
          "pointer-events-none absolute left-0 top-2 z-10 -ml-1 bg-[#f5f4ef] px-1 text-sm leading-none text-[var(--field-text)] transition-all duration-150 peer-focus:top-1 peer-focus:text-xs peer-not-placeholder-shown:top-1 peer-not-placeholder-shown:text-xs group-data-[surface=accent]/form:bg-[var(--accent)] group-data-[surface=accent]/form:text-white/60",
          floatingLabelClassName
        )}
      >
        {labelText}
      </label>
    </div>
  );
}

export { Textarea };
