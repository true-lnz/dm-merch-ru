import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/shared/lib/cn";

const buttonVariants = cva(
  "group/button inline-flex h-[47px] w-full rounded-[7px] shrink-0 items-center justify-center border border-[var(--accent)] px-5 text-base md:text-lg font-medium whitespace-nowrap tracking-[-0.02em] transition-colors outline-none select-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        blue: "bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]",
        white: "bg-white text-[var(--accent)] hover:bg-[#f3f7ff]",
      },
    },
    defaultVariants: {
      variant: "blue",
    },
  }
);

function Button({
  className,
  variant = "blue",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
