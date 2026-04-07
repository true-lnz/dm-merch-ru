import { blogPostsMock } from "@/entities/blog-post";
import { PageBreadcrumb } from "@/shared/ui/breadcrumb";
import { PageHeader } from "../../../shared/ui/page-header";
import { BlogCta } from "@/widgets/blog-cta";
import { BlogFeed } from "@/widgets/blog-feed";

export function BlogPage() {
  return (
    <div className="page blog-page">
      <PageBreadcrumb
        items={[
          { label: "Главная", href: "/" },
          { label: "Блог" },
        ]}
      />
      <PageHeader>Блог</PageHeader>
      <BlogFeed posts={blogPostsMock} />
      <BlogCta />
    </div>
  );
}
