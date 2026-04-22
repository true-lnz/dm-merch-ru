import { RequestCta } from "@/features/request-cta";
import type { CatalogPageData } from "@/views/catalog/model/catalog-data";
import { WidowFix } from "@/shared/ui/widow-fix";
import { CatalogCases } from "@/widgets/catalog-cases";
import { CatalogHero } from "@/widgets/catalog-hero";
import { CatalogProducts } from "@/widgets/catalog-products";
import { CatalogWorkStages } from "@/widgets/catalog-work-stages";
import { FaqSection } from "@/widgets/faq-section";

export function CatalogPage({ data }: { data: CatalogPageData }) {
  return (
    <>
      <WidowFix />
      <CatalogHero heroTitle={data.heroTitle} heroImage={data.heroImage} />
      <CatalogProducts items={data.products} showHeading={data.showProductsSubheading} />
      <CatalogCases items={data.cases} variant={data.casesVariant} />
      <CatalogWorkStages />
      <FaqSection />
      <RequestCta />
    </>
  );
}
