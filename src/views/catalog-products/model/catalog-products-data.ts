import { getBlogPosts } from "@/entities/blog-post";
import { getCatalogRootIconId } from "@/shared/config/catalog-root-icons";
import { getPayloadClient } from "@/shared/lib/payload/get-payload-client";
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

const DEFAULT_HERO = {
  title: "Каталог\nпродукции",
  description:
    "Собрали в одном входе категории, статьи и реальные разделы каталога, чтобы ориентироваться в мерче было проще и быстрее.",
  backgroundImageUrl: "/catalog-products/img_hero_catalog_cover.svg",
} as const;

export async function getCatalogProductsLandingData(): Promise<CatalogProductsLandingData> {
  const partnerCatalogCategories = (await getPartnerCatalogData()).categories;
  const blogPosts = await getBlogPosts();
  const payload = (await getPayloadClient()) as any;
  const catalogProductsPage = await payload.find({
    collection: "catalog-products-page",
    depth: 0,
    limit: 1,
    pagination: false,
  });
  const heroSource = catalogProductsPage.docs[0]?.hero;
  const articles: CatalogProductsLandingArticle[] = blogPosts.slice(0, 5).map((article) => ({
    id: article.id,
    title: article.pageTitle || article.cardTitle,
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
    href: getPartnerCatalogPathForFilter(
      partnerCatalogCategories,
      category.id,
      PARTNER_CATALOG_ALL_FILTER_ID,
    ),
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
      title: typeof heroSource?.title === "string" && heroSource.title ? heroSource.title : DEFAULT_HERO.title,
      description:
        typeof heroSource?.description === "string" && heroSource.description ? heroSource.description : DEFAULT_HERO.description,
      backgroundImageUrl:
        typeof heroSource?.backgroundImageUrl === "string" && heroSource.backgroundImageUrl
          ? heroSource.backgroundImageUrl
          : DEFAULT_HERO.backgroundImageUrl,
    },
    portraits: [...HERO_PORTRAITS],
    articles,
    categories,
  };
}
