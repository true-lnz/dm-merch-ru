import { getBlogPosts } from "@/entities/blog-post";
import { RequestCta } from "@/features/request-cta";
import { PageHeading } from "@/shared/ui/page-heading";
import { BlogFeed } from "@/widgets/blog-feed";

export function BlogPage() {
  return (
    <>
      <PageHeading
        title="Блог"
        breadcrumb={{
          labelFrom: "Главная",
          labelTo: "Блог",
          href: "/",
        }}
      />
      <BlogFeed posts={getBlogPosts()} />
      <RequestCta />
    </>
  );
}
