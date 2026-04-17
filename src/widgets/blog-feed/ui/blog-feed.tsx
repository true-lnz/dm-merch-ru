import type { BlogPost } from "@/entities/blog-post";
import { ContentCard } from "@/shared/ui/content-card";

type BlogFeedProps = {
  posts: BlogPost[];
};

export function BlogFeed({ posts }: BlogFeedProps) {
  return (
    <section className="mb-[43px] md:mb-[52px] xl:mb-[70px] mt-[28.8px] xl:mt-[36px]" aria-label="Список статей блога">
      <div className="grid gap-9 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <ContentCard
            key={post.id}
            title={post.title}
            excerpt={post.excerpt}
            href="/blog/soon"
            image={post.image}
            imageContainerClassName="aspect-18/9 object-top"
          />
        ))}
      </div>
    </section>
  );
}
