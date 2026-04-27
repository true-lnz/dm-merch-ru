import { cn } from "@/shared/lib/cn";
import type { CSSProperties } from "react";

type WishlistTriggerProps = {
  count: number;
  variant: "desktop" | "mobile-header" | "mobile-menu";
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
};

export function WishlistTrigger({ count, variant, onClick, className, style }: WishlistTriggerProps) {
  const isDesktop = variant === "desktop";
  const isMobileHeader = variant === "mobile-header";
  const ariaLabel = `Открыть вишлист. Элементов: ${count}`;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      style={style}
      className={cn(
        "group inline-flex items-center rounded-[9px] border bg-white transition-colors cursor-pointer",
        isDesktop
          ? "h-[38px] gap-2 px-3 text-[#404040] hover:bg-[#f4f3ee]"
          : isMobileHeader
            ? "justify-center rounded-[6px] border-transparent bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)]"
            : "h-9 gap-2 px-3 text-[#404040] hover:bg-[#f4f3ee]",
        className,
      )}
    >
      {!isMobileHeader ? <span className="text-base font-medium leading-none">Вишлист</span> : null}
      <span
        className={cn(
          "inline-flex h-[20px] w-[20px] items-center justify-center rounded-full leading-none font-semibold",
          isMobileHeader ? "bg-white text-[var(--accent)] text-xs" : "bg-[var(--accent)] text-white text-sm",
        )}
      >
        {count}
      </span>
    </button>
  );
}
