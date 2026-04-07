import { blogPostsMock } from "@/entities/blog-post";
import { PageBreadcrumb } from "@/shared/ui/breadcrumb";
import { PageTitle } from "@/shared/ui/page-title";
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
      <PageTitle>Блог</PageTitle>
      <BlogFeed posts={blogPostsMock} />
      <BlogCta />
    </div>
  );
}
