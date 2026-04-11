import { cn } from "@/shared/lib/cn";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

type SliderControlProps = {
  direction: "prev" | "next";
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  ariaLabel: string;
};

export function SliderControl({
  direction,
  onClick,
  disabled = false,
  className,
  ariaLabel,
}: SliderControlProps) {
  const Icon = direction === "prev" ? ChevronLeftIcon : ChevronRightIcon;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        "inline-flex size-[58.8px] items-center justify-center rounded-[8px] bg-[#ecebe6] text-[#2a2a2a] transition-colors",
        disabled ? "opacity-45" : "hover:bg-[#e3e1db]",
        className,
      )}
    >
      <Icon className="size-[24px]" strokeWidth={1.5} />
    </button>
  );
}
