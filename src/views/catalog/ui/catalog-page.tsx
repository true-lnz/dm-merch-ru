import { RequestCta } from "@/features/request-cta";
import { WidowFix } from "@/shared/ui/widow-fix";
import { CatalogCases } from "@/widgets/catalog-cases";
import { CatalogHero } from "@/widgets/catalog-hero";
import { CatalogProducts } from "@/widgets/catalog-products";
import { CatalogWorkStages } from "@/widgets/catalog-work-stages";
import { FaqSection } from "@/widgets/faq-section";

export function CatalogPage() {
  return (
    <>
      <WidowFix />
      <CatalogHero />
      <CatalogProducts />
      <CatalogCases />
      <CatalogWorkStages />
      <FaqSection />
      <RequestCta />
    </>
  );
}
