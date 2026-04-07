import Image from "next/image";
import Link from "next/link";

type ContentCardImage = {
  url: string;
  alt: string;
  width: number;
  height: number;
};

export type ContentCardProps = {
  title: string;
  excerpt?: string | null;
  href: string;
  image: ContentCardImage;
};

export function ContentCard({ title, excerpt, href, image }: ContentCardProps) {
  const hasExcerpt = excerpt?.trim();

  return (
    <article className="h-full overflow-hidden rounded-[20px] bg-[var(--card-bg)]">
      <div className="relative aspect-[553/250] w-full overflow-hidden bg-[var(--surface)]">
        <Image
          src={image.url}
          alt={image.alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="space-y-2 p-4 md:p-5">
        <h3 className="font-heading text-[36px] leading-[0.95] tracking-[-0.03em] text-[var(--heading)]">
          {title}
        </h3>
        {hasExcerpt ? <p className="text-sm text-[var(--text-muted)]">{hasExcerpt}</p> : null}
      </div>
      <div className="p-4 pt-0 md:p-5 md:pt-0">
        <Link
          href={href}
          aria-label={`Открыть: ${title}`}
          className="cta-link inline-flex h-11 w-full items-center justify-center bg-[var(--accent)] px-5 tracking-[-0.02em] transition-colors hover:bg-[var(--accent-hover)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
        >
          Перейти
        </Link>
      </div>
    </article>
  );
}