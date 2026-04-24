import { cn } from "@/shared/lib/cn";

type ArticleMiniCardProps = {
  title?: string;
  text: string;
  number?: string;
  variant?: "light" | "accent";
  showAccentBackground?: boolean;
  className?: string;
  numberClassName?: string;
  titleClassName?: string;
  textClassName?: string;
};

export function ArticleMiniCard({
  title,
  text,
  number,
  variant = "light",
  showAccentBackground = true,
  className,
  numberClassName,
  titleClassName,
  textClassName,
}: ArticleMiniCardProps) {
  const isAccent = variant === "accent";

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-[18px] p-5 md:rounded-[22.5px] md:p-[27px]",
        isAccent ? "bg-[var(--accent)] text-white" : "bg-[var(--card-bg)] text-[var(--heading)]",
        className,
      )}
    >
      {isAccent && showAccentBackground ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[url('/blog/img_feature_card_cover.svg')] bg-cover bg-center bg-no-repeat opacity-100"
        />
      ) : null}

      <div className="relative z-10 flex h-full flex-col gap-3 md:gap-4">
        {number ? (
          <span
            className={cn(
              "font-heading text-3xl leading-none tracking-[0.01em] md:text-4xl",
              isAccent ? "text-white" : "text-[var(--accent)]",
              numberClassName,
            )}
          >
            {number}
          </span>
        ) : null}
        {title ? (
          <h3
            className={cn(
              "font-heading whitespace-pre-line text-2xl leading-[0.95] tracking-[0.015em] uppercase md:text-4xl",
              isAccent ? "text-white" : "text-[var(--heading)]",
              titleClassName,
            )}
          >
            {title}
          </h3>
        ) : null}
        <p
          className={cn(
            "whitespace-pre-line text-sm leading-[1.3] tracking-[-0.03em] md:text-base xl:text-lg",
            isAccent ? "text-white/80" : "text-[var(--text-muted)]",
            textClassName,
          )}
        >
          {text}
        </p>
      </div>
    </article>
  );
}
