import { cn } from "@/shared/lib/cn";
import Image from "next/image";

type FeatureCardProps = {
  title: string;
  description: string;
  backgroundImageUrl: string;
  accent?: boolean;
  className?: string;
};

export function FeatureCard({
  title,
  description,
  backgroundImageUrl,
  accent = false,
  className,
}: FeatureCardProps) {
  const hasBackground = backgroundImageUrl.trim().length > 0;

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-[18px] md:rounded-[22.5px] p-5 md:p-[27px]",
        accent ? "bg-[var(--accent)]" : "bg-[var(--card-bg)]",
        className,
      )}
    >
      {hasBackground ? (
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-right-bottom bg-no-repeat"
          style={{ backgroundImage: `url("${backgroundImageUrl}")` }}
          aria-hidden="true"
        />
      ) : null}

      <div className="relative z-10 flex flex-col gap-[22px]">
        <Image
          src="/icons/ic_feature.svg"
          alt=""
          width={36}
          height={36}
          aria-hidden="true"
          className={cn("size-[36px]", accent && "brightness-0 invert")}
        />
        <h3
          className={cn(
            "font-heading text-3xl whitespace-pre-line leading-[0.95] tracking-[0.015em] uppercase md:text-5xl w-[95%]",
            accent ? "text-white" : "text-[var(--heading)]",
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            "text-[15px] leading-[1.35] tracking-[-0.03em] md:text-[18px]",
            accent ? "text-white/80" : "text-[var(--text-muted)]",
          )}
        >
          {description}
        </p>
      </div>
    </article>
  );
}
