import type { BlogArticleMerchTypesSection } from "@/entities/blog-post";
import { ContentCard } from "@/shared/ui/content-card";
import { PageSubheading } from "@/shared/ui/page-subheading";

type ArticleMerchTypesSectionProps = {
  section: BlogArticleMerchTypesSection;
};

export function ArticleMerchTypesSection({ section }: ArticleMerchTypesSectionProps) {
  return (
    <section aria-label={section.title}>
      <div className="flex flex-col gap-8 md:gap-10 xl:gap-[60px]">
        <PageSubheading title={section.title} titleClassName="max-w-[1350px]" />

        <div className="grid gap-5 xl:grid-cols-3">
          {section.cards.map((card) => (
            <ContentCard
              key={card.title}
              title={card.title}
              excerpt={card.excerpt}
              image={{
                ...card.image,
                className: "object-center",
                sizes: "(max-width: 1279px) calc(100vw - 60px), 553px",
              }}
              imageContainerClassName="aspect-[553/325]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
