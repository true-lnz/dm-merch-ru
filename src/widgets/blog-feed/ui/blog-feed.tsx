import type { BlogPost } from "@/entities/blog-post";
import { ContentCard } from "@/shared/ui/content-card";

type BlogFeedProps = {
  posts: BlogPost[];
};

export function BlogFeed({ posts }: BlogFeedProps) {
  return (
    <section className="mb-[63px] md:mb-[72px] xl:mb-[90px]" aria-label="Список статей блога">
      <div className="grid gap-9 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <ContentCard
            key={post.id}
            title={post.title}
            excerpt={post.excerpt}
            href={post.href}
            image={post.image}
          />
        ))}
      </div>
    </section>
  );
}
