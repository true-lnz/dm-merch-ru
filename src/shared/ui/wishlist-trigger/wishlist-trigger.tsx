import { cn } from "@/shared/lib/cn";

type WishlistTriggerProps = {
  count: number;
  variant: "desktop" | "mobile";
  onClick?: () => void;
  className?: string;
};

export function WishlistTrigger({ count, variant, onClick, className }: WishlistTriggerProps) {
  const isDesktop = variant === "desktop";
  const ariaLabel = `Открыть вишлист. Элементов: ${count}`;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        "group inline-flex items-center rounded-[9px] border bg-white transition-colors",
        isDesktop
          ? "h-[38px] gap-2 px-3 text-[#404040] hover:bg-[#f4f3ee]"
          : "h-[34px] w-[34px] justify-center bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]",
        className,
      )}
    >
      {isDesktop ? <span className="text-base font-medium leading-none">Вишлист</span> : null}
      <span
        className={cn(
          "inline-flex w-[20px] h-[20px] items-center justify-center rounded-full text-sm leading-[-1] font-semibold",
          isDesktop ? "bg-[var(--accent)] text-white" : "bg-white text-[var(--accent)]",
        )}
      >
        {count}
      </span>
    </button>
  );
}
