import { blogArticlesMock } from "@/entities/blog-post/model/mock";
import type { CatalogProductsLandingData, CatalogProductsLandingPortrait } from "@/widgets/catalog-products/model/types";
import { PARTNER_CATALOG_ALL_FILTER_ID, getPartnerCatalogData } from "@/views/partner-catalog/model/partner-catalog-data";
import { getPartnerCatalogPathForFilter } from "@/views/partner-catalog/model/partner-catalog-query";

const HERO_PORTRAITS: CatalogProductsLandingPortrait[] = [
  { src: "/catalog/cases/img_art_kvadrat_tall.webp", alt: "Мерч-проект Арт-Квадрат" },
  { src: "/catalog/cases/img_agromig_tall.webp", alt: "Мерч-проект Агромиг" },
  { src: "/catalog/cases/img_dark_tall.webp", alt: "Мерч-проект DARK" },
  { src: "/catalog/cases/img_kolchuga_tall.jpg", alt: "Мерч-проект Кольчуга" },
  { src: "/catalog/cases/img_ldgr_tall.webp", alt: "Мерч-проект LDGR" },
  { src: "/catalog/cases/img_magadan_tall.webp", alt: "Мерч-проект Магадан" },
  { src: "/catalog/cases/img_ufanet_tall.webp", alt: "Мерч-проект Уфанет" },
] as const;

export function getCatalogProductsLandingData(): CatalogProductsLandingData {
  const partnerCatalogCategories = getPartnerCatalogData().categories;
  const articles = blogArticlesMock.slice(0, 5).map((article) => ({
    id: article.id,
    title: article.pageTitle,
    href: article.href,
    image: {
      src: article.heroImage.url,
      alt: article.heroImage.alt,
    },
  }));

  const categories = partnerCatalogCategories.map((category) => ({
    id: category.id,
    title: category.name,
    productCount: category.productCount,
    iconId:
      category.id === "clothing"
        ? "cloth"
        : category.id === "drinkware"
          ? "cup"
          : category.id === "stationery"
            ? "note"
            : category.id === "bags"
              ? "bag"
              : category.id === "electronics"
                ? "electronics"
                : category.id === "gifts"
                  ? "set"
                  : undefined,
    subcategories: category.children.map((subcategory) => ({
      id: subcategory.id,
      title: subcategory.name,
      href: getPartnerCatalogPathForFilter(
        partnerCatalogCategories,
        subcategory.id,
        PARTNER_CATALOG_ALL_FILTER_ID,
      ),
      productCount: subcategory.productCount,
    })),
  }));

  return {
    hero: {
      title: "Каталог\nпродукции",
      description:
        "Собрали в одном входе категории, статьи и реальные разделы каталога, чтобы ориентироваться в мерче было проще и быстрее.",
      backgroundImageUrl: "/home/img_card_cover_home_features_v2.svg",
    },
    portraits: [...HERO_PORTRAITS],
    articles,
    categories,
  };
}
