import { Input as InputPrimitive } from "@base-ui/react/input";
import * as React from "react";

import { cn } from "@/shared/lib/cn";

type InputProps = React.ComponentProps<"input"> & {
  floatingLabel?: boolean;
  label?: string;
  floatingLabelClassName?: string;
};

function Input({ className, type, floatingLabel = true, label, floatingLabelClassName, id, placeholder, ...props }: InputProps) {
  const generatedId = React.useId();
  const resolvedId = id ?? generatedId;
  const labelText = label ?? (typeof placeholder === "string" ? placeholder : "");

  if (!floatingLabel || !labelText) {
    return (
      <InputPrimitive
        id={resolvedId}
        type={type}
        data-slot="input"
        className={cn(
          "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
          className,
        )}
        placeholder={placeholder}
        {...props}
      />
    );
  }

  return (
    <div className="relative w-full">
      <InputPrimitive
        id={resolvedId}
        type={type}
        data-slot="input"
        className={cn(
          "peer h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-transparent focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
          className,
        )}
        placeholder=" "
        aria-label={props["aria-label"] ?? labelText}
        {...props}
      />
      <label
        htmlFor={resolvedId}
        className={cn(
          "pointer-events-none tracking-[-0.03em] absolute left-0 top-1/2 z-10 -translate-y-1/2 px-0 text-sm text-[var(--field-text)] transition-all duration-150 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:translate-y-0 peer-focus:text-xs peer-not-placeholder-shown:top-1 peer-not-placeholder-shown:translate-y-0 peer-not-placeholder-shown:text-xs group-data-[surface=accent]/form:text-white/60",
          floatingLabelClassName,
        )}
      >
        {labelText}
      </label>
    </div>
  );
}

export { Input };
