import type { BlogArticle } from "@/entities/blog-post";
import { PageBreadcrumb } from "@/shared/ui/breadcrumb";
import { PageHeading } from "@/shared/ui/page-heading";
import Image from "next/image";

type ArticleHeroProps = {
  article: BlogArticle;
};

export function ArticleHero({ article }: ArticleHeroProps) {
  return (
    <section>
      <PageBreadcrumb
        items={[
          { label: "Главная", href: "/" },
          { label: "Блог", href: "/blog" },
        ]}
        currentLabel={article.breadcrumbCurrentLabel}
      />

      <PageHeading title={article.pageTitle} />

      <div className="mt-4 overflow-hidden rounded-[18px] md:rounded-[22.5px] bg-white md:mt-5">
        <div className="relative aspect-[1740/400] min-h-[125px] w-full xl:min-h-0">
          <Image src={article.heroImage.url} alt={article.heroImage.alt} fill unoptimized preload={true} sizes="100vw" className="object-cover" />
        </div>
      </div>
    </section>
  );
}
