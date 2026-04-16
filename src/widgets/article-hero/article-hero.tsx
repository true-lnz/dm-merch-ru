import type { BlogArticle } from "@/entities/blog-post";
import { PageBreadcrumb } from "@/shared/ui/breadcrumb";
import Image from "next/image";

type ArticleHeroProps = {
  article: BlogArticle;
};

export function ArticleHero({ article }: ArticleHeroProps) {
  return (
    <section className="mb-[63px] md:mb-[72px] xl:mb-[90px]">
      <PageBreadcrumb
        className="mb-4 mt-8 md:mb-5 md:mt-12 xl:mb-[42px] xl:mt-[39px]"
        items={[
          { label: "Главная", href: "/" },
          { label: "Блог", href: "/blog" },
        ]}
        currentLabel={article.breadcrumbCurrentLabel}
      />

      <h1 className="m-0 max-w-[1280px] font-heading text-4xl leading-[0.95] tracking-[0.01em] text-[var(--heading)] uppercase md:text-6xl xl:text-[7.02rem] xl:leading-[0.968]">
        {article.pageTitle}
      </h1>

      <div className="mt-8 overflow-hidden rounded-[18px] md:rounded-[22.5px] bg-white md:mt-10 xl:mt-[59px]">
        <div className="relative aspect-[1740/400] min-h-[220px] w-full md:min-h-[320px] xl:min-h-0">
          <Image
            src={article.heroImage.url}
            alt={article.heroImage.alt}
            fill
            priority
            quality={80}
            sizes="(max-width: 767px) 100vw, (max-width: 1279px) calc(100vw - 60px), 1740px"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
