import { blogPostsMock } from "@/entities/blog-post";
import { BlogCta } from "@/widgets/blog-cta";
import { BlogFeed } from "@/widgets/blog-feed";

export function BlogPage() {
  return (
    <div className="page blog-page">
      <nav aria-label="Хлебные крошки" className="mb-8 text-sm text-[var(--text-muted)]">
        Главная / Блог
      </nav>
      <h1 className="font-heading mb-12 text-[80px] uppercase leading-[0.95] tracking-[-0.03em] text-[var(--heading)] md:text-[112px]">
        Блог
      </h1>
      <BlogFeed posts={blogPostsMock} />
      <BlogCta />
    </div>
  );
}
