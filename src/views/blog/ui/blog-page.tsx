import { blogPostsMock } from "@/entities/blog-post";
import { PageHeader } from "../../../shared/ui/page-header";
import { BlogCta } from "@/widgets/blog-cta";
import { BlogFeed } from "@/widgets/blog-feed";

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
      <BlogCta />
    </div>
  );
}