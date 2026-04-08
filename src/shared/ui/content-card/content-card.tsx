import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/shared/ui/button";

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
    <article className="flex flex-col h-full overflow-hidden rounded-[20px] bg-[var(--card-bg)]">
      <div className="relative aspect-[553/250] w-full overflow-hidden bg-[var(--surface)]">
        <Image
          src={image.url}
          alt={image.alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="space-y-2 p-5 md:p-7">
        <h3 className="font-heading text-[42px] leading-[0.95] tracking-[0.01em] text-[var(--heading)]">
          {title}
        </h3>
        {hasExcerpt ? <p className="text-sm text-[var(--text-muted)]">{hasExcerpt}</p> : null}
      </div>
      <div className="p-4 pt-0 md:p-5 md:pt-0 mt-auto">
        <Link
          href={href}
          aria-label={`Открыть: ${title}`}
          className={buttonVariants()}
        >
          Перейти
        </Link>
      </div>
    </article>
  );
}
