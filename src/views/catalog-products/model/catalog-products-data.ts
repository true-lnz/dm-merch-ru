import { blogArticlesMock } from "@/entities/blog-post/model/mock";
import { getCatalogRootIconId } from "@/shared/config/catalog-root-icons";
import type { CatalogProductsLandingArticle, CatalogProductsLandingData, CatalogProductsLandingPortrait } from "@/widgets/catalog-products/model/types";
import { PARTNER_CATALOG_ALL_FILTER_ID, getPartnerCatalogData } from "@/views/partner-catalog/model/partner-catalog-data";
import { getPartnerCatalogPathForFilter } from "@/views/partner-catalog/model/partner-catalog-query";

const HERO_PORTRAITS: CatalogProductsLandingPortrait[] = [
  { src: "/catalog-products/1.webp", alt: "Изображение каталога продукции 1" },
  { src: "/catalog-products/2.webp", alt: "Изображение каталога продукции 2" },
  { src: "/catalog-products/3.webp", alt: "Изображение каталога продукции 3" },
  { src: "/catalog-products/4.svg", alt: "Центральное изображение каталога продукции" },
  { src: "/catalog-products/5.webp", alt: "Изображение каталога продукции 5" },
  { src: "/catalog-products/6.webp", alt: "Изображение каталога продукции 6" },
  { src: "/catalog-products/7.webp", alt: "Изображение каталога продукции 7" },
] as const;

export async function getCatalogProductsLandingData(): Promise<CatalogProductsLandingData> {
  const partnerCatalogCategories = (await getPartnerCatalogData()).categories;
  const articles: CatalogProductsLandingArticle[] = blogArticlesMock.slice(0, 5).map((article) => ({
    id: article.id,
    title: article.pageTitle,
    href: article.href,
    variant: "article" as const,
    image: {
      src: article.heroImage.url,
      alt: article.heroImage.alt,
    },
  }));

  articles.push({
    id: "all-articles",
    title: "Все новости\nи статьи",
    href: "/blog",
    variant: "all-articles",
    image: {
      src: "/blog/blog-brand-image.webp",
      alt: "Все новости и статьи",
    },
  });

  const categories = partnerCatalogCategories.map((category) => ({
    id: category.id,
    title: category.name,
    productCount: category.productCount,
    iconId: getCatalogRootIconId(category.id),
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
      backgroundImageUrl: "/catalog-products/img_hero_catalog_cover.svg",
    },
    portraits: [...HERO_PORTRAITS],
    articles,
    categories,
  };
}
