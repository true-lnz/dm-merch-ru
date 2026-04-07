import Image from "next/image";
import Link from "next/link";
import { cn } from "@/shared/lib/cn";
import { Card, CardContent, CardFooter } from "@/shared/ui/card";

type ContentCardProps = {
  title: string;
  excerpt?: string | null;
  href: string;
  image: {
    url: string;
    alt: string;
    width: number;
    height: number;
  };
  ctaLabel?: string;
  className?: string;
  ariaLabel?: string;
};

export function ContentCard({
  title,
  excerpt,
  href,
  image,
  ctaLabel = "Перейти",
  className,
  ariaLabel,
}: ContentCardProps) {
  const hasExcerpt = excerpt?.trim();
  return (
    <Card className={cn("h-full", className)}>
      <div className="relative aspect-[553/250] w-full overflow-hidden bg-[var(--surface)]">
        <Image
          src={image.url}
          alt={image.alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <CardContent className="space-y-2">
        <h3 className="font-heading text-[36px] leading-[0.95] tracking-[-0.03em] text-[var(--heading)]">
          {title}
        </h3>
        {hasExcerpt ? (
          <p className="text-sm text-[var(--text-muted)]">{hasExcerpt}</p>
        ) : null}
      </CardContent>
      <CardFooter>
        <Link
          href={href}
          aria-label={ariaLabel ?? `Открыть: ${title}`}
          className="cta-link inline-flex h-11 w-full items-center justify-center rounded-lg bg-[var(--accent)] px-5 tracking-[-0.02em] transition-colors hover:bg-[var(--accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          {ctaLabel}
        </Link>
      </CardFooter>
    </Card>
  );
}
