import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { MinusIcon, PlusIcon } from "lucide-react";

import { cn } from "@/shared/lib/cn";

function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  );
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("not-last:border-b", className)}
      {...props}
    />
  );
}

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger relative flex min-h-[48px] flex-1 cursor-pointer items-center justify-between gap-4 rounded-lg border border-transparent py-2 text-left text-sm font-medium transition-all outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
        <span className="ml-auto flex h-6 w-6 md:h-9 md:w-9 shrink-0 items-center justify-center rounded-full bg-transparent text-[var(--accent)] transition-colors group-hover/accordion-trigger:bg-[var(--card-bg)]">
          <PlusIcon
            data-slot="accordion-trigger-icon"
            className="pointer-events-none size-5 md:size-8 shrink-0 transition-transform duration-300 group-aria-expanded/accordion-trigger:scale-0"
          />
          <MinusIcon
            data-slot="accordion-trigger-icon"
            className="pointer-events-none absolute size-5 md:size-8 shrink-0 scale-0 transition-transform duration-300 group-aria-expanded/accordion-trigger:scale-100"
          />
        </span>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className="overflow-hidden text-sm data-open:animate-accordion-down data-closed:animate-accordion-up"
      {...props}
    >
      <div
        className={cn(
          "h-(--accordion-panel-height) pt-0 pb-2.5 data-ending-style:h-0 data-starting-style:h-0 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Panel>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
