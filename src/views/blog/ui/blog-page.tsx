import { blogPostsMock } from "@/entities/blog-post";
import { PageHeader } from "../../../shared/ui/page-header";
import { BlogFeed } from "@/widgets/blog-feed";
import { RequestCta } from "@/widgets/request-cta";

export function BlogPage() {
  return (
    <div className="page blog-page">
      <PageHeader
        title="Блог"
        breadcrumbs={[
          { label: "Главная", href: "/" },
          { label: "Блог" },
        ]}
      />
      <BlogFeed posts={blogPostsMock} />
      <RequestCta />
    </div>
  );
}
