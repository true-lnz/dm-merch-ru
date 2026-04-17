import { Collapsible as CollapsiblePrimitive } from "@base-ui/react/collapsible";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "@/shared/lib/cn";

function Collapsible({ className, ...props }: CollapsiblePrimitive.Root.Props) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" className={cn("w-full", className)} {...props} />;
}

function CollapsibleTrigger({ className, children, ...props }: CollapsiblePrimitive.Trigger.Props) {
  return (
    <CollapsiblePrimitive.Trigger
      data-slot="collapsible-trigger"
      className={cn(
        "group/collapsible flex w-full cursor-pointer items-center justify-between gap-3 text-left text-sm text-[#404040] transition-colors hover:text-black",
        className,
      )}
      {...props}
    >
      <span>{children}</span>
      <ChevronDownIcon className="size-4 shrink-0 transition-transform duration-200 group-data-[panel-open]/collapsible:rotate-180" />
    </CollapsiblePrimitive.Trigger>
  );
}

function CollapsibleContent({ className, children, ...props }: CollapsiblePrimitive.Panel.Props) {
  return (
    <CollapsiblePrimitive.Panel
      data-slot="collapsible-content"
      className="overflow-hidden data-open:animate-accordion-down data-closed:animate-accordion-up"
      {...props}
    >
      <div className={cn("h-(--collapsible-panel-height) data-ending-style:h-0 data-starting-style:h-0", className)}>{children}</div>
    </CollapsiblePrimitive.Panel>
  );
}

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
