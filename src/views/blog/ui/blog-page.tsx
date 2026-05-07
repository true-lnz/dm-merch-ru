import { getBlogPosts } from "@/entities/blog-post";
import { RequestCta } from "@/features/request-cta";
import { PageHeading } from "@/shared/ui/page-heading";
import { WidowFix } from "@/shared/ui/widow-fix";
import { BlogFeed } from "@/widgets/blog-feed";

type BlogPageProps = {
  title?: string;
};

export async function BlogPage({ title = "Блог" }: BlogPageProps) {
  const posts = await getBlogPosts();

  return (
    <>
      <WidowFix />
      <PageHeading
        title={title}
        breadcrumb={{
          labelFrom: "Главная",
          labelTo: title,
          href: "/",
        }}
      />
      <BlogFeed posts={posts} />
      <RequestCta />
    </>
  );
}
