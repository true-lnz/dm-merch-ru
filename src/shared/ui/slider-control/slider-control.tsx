import { cn } from "@/shared/lib/cn";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

type SliderControlProps = {
  onPrevClick: () => void;
  onNextClick: () => void;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
  mini?: boolean;
  className?: string;
  prevAriaLabel: string;
  nextAriaLabel: string;
};

export function SliderControl({
  onPrevClick,
  onNextClick,
  prevDisabled = false,
  nextDisabled = false,
  mini = false,
  className,
  prevAriaLabel,
  nextAriaLabel,
}: SliderControlProps) {
  return (
    <div className={cn("flex items-center", mini ? "gap-2.5" : "gap-[18px]", className)}>
      <button
        type="button"
        onClick={onPrevClick}
        disabled={prevDisabled}
        aria-label={prevAriaLabel}
        className={cn(
          "inline-flex items-center justify-center rounded-[7px] bg-[#ecebe6] text-[#2a2a2a] transition-colors",
          mini ? "size-9" : "size-[55px]",
          prevDisabled ? "cursor-default opacity-45" : "cursor-pointer hover:bg-[#e3e1db]",
        )}
      >
        <ChevronLeftIcon className={mini ? "size-4" : "size-[24px]"} strokeWidth={1.5} />
      </button>

      <button
        type="button"
        onClick={onNextClick}
        disabled={nextDisabled}
        aria-label={nextAriaLabel}
        className={cn(
          "inline-flex items-center justify-center rounded-[7px] bg-[#ecebe6] text-[#2a2a2a] transition-colors",
          mini ? "size-9" : "size-[55px]",
          nextDisabled ? "cursor-default opacity-45" : "cursor-pointer hover:bg-[#e3e1db]",
        )}
      >
        <ChevronRightIcon className={mini ? "size-4" : "size-[24px]"} strokeWidth={1.5} />
      </button>
    </div>
  );
}
