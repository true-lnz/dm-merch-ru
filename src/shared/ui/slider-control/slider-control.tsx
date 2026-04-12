import { cn } from "@/shared/lib/cn";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

type SliderControlProps = {
  onPrevClick: () => void;
  onNextClick: () => void;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
  className?: string;
  prevAriaLabel: string;
  nextAriaLabel: string;
};

export function SliderControl({
  onPrevClick,
  onNextClick,
  prevDisabled = false,
  nextDisabled = false,
  className,
  prevAriaLabel,
  nextAriaLabel,
}: SliderControlProps) {
  return (
    <div className={cn("flex items-center justify-center gap-[18px]", className)}>
      <button
        type="button"
        onClick={onPrevClick}
        disabled={prevDisabled}
        aria-label={prevAriaLabel}
        className={cn(
          "inline-flex size-[58.8px] items-center justify-center rounded-[8px] bg-[#ecebe6] text-[#2a2a2a] transition-colors",
          prevDisabled ? "cursor-default opacity-45" : "cursor-pointer hover:bg-[#e3e1db]",
        )}
      >
        <ChevronLeftIcon className="size-[24px]" strokeWidth={1.5} />
      </button>

      <button
        type="button"
        onClick={onNextClick}
        disabled={nextDisabled}
        aria-label={nextAriaLabel}
        className={cn(
          "inline-flex size-[58.8px] items-center justify-center rounded-[8px] bg-[#ecebe6] text-[#2a2a2a] transition-colors",
          nextDisabled ? "cursor-default opacity-45" : "cursor-pointer hover:bg-[#e3e1db]",
        )}
      >
        <ChevronRightIcon className="size-[24px]" strokeWidth={1.5} />
      </button>
    </div>
  );
}
