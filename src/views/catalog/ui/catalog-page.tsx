import { RequestCta } from "@/features/request-cta";
import { WidowFix } from "@/shared/ui/widow-fix";
import { CatalogHero } from "@/widgets/catalog-hero";
import { CatalogProducts } from "@/widgets/catalog-products";
import { FaqSection } from "@/widgets/faq-section";

export function CatalogPage() {
  return (
    <>
      <WidowFix />
      <CatalogHero />
      <CatalogProducts />
      <FaqSection />
      <RequestCta />
    </>
  );
}
