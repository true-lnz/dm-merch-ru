import { blogPostsMock } from "@/entities/blog-post";
import { PageHeading } from "../../../shared/ui/page-heading";
import { BlogFeed } from "@/widgets/blog-feed";
import { RequestCta } from "@/features/request-cta";

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
      <BlogFeed posts={blogPostsMock} />
      <RequestCta />
    </>
  );
}
