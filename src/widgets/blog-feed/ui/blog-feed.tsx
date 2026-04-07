import type { BlogPost } from "@/entities/blog-post";
import { ContentCard } from "@/shared/ui/content-card";

type BlogFeedProps = {
  posts: BlogPost[];
};

export function BlogFeed({ posts }: BlogFeedProps) {
  return (
    <section aria-label="Список статей блога">
      <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">
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
