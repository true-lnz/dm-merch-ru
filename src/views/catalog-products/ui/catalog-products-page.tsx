import { RequestCta } from "@/features/request-cta";
import { WidowFix } from "@/shared/ui/widow-fix";
import type { CatalogProductsLandingData } from "@/widgets/catalog-products/model/types";
import { CatalogProductsArticles } from "@/widgets/catalog-products-articles";
import { CatalogProductsCategories } from "@/widgets/catalog-products-categories";
import { CatalogProductsHero } from "@/widgets/catalog-products-hero";
import { CatalogProductsBottomBar } from "./catalog-products-bottom-bar";

export function CatalogProductsPage({ data }: { data: CatalogProductsLandingData }) {
  return (
    <>
      <WidowFix />
      <CatalogProductsBottomBar categories={data.categories} />
      <CatalogProductsHero
        backgroundImageUrl={data.hero.backgroundImageUrl}
        portraits={data.portraits}
      />
      <CatalogProductsArticles items={data.articles} />
      <CatalogProductsCategories items={data.categories} />
      <RequestCta />
    </>
  );
}
