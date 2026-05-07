import { getBlogPosts } from "@/entities/blog-post";
import { RequestCta } from "@/features/request-cta";
import { PageHeading } from "@/shared/ui/page-heading";
import { WidowFix } from "@/shared/ui/widow-fix";
import { BlogFeed } from "@/widgets/blog-feed";

export async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <>
      <WidowFix />
      <PageHeading
        title="Блог"
        breadcrumb={{
          labelFrom: "Главная",
          labelTo: "Блог",
          href: "/",
        }}
      />
      <BlogFeed posts={posts} />
      <RequestCta />
    </>
  );
}
