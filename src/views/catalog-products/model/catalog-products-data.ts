import { getBlogPosts } from "@/entities/blog-post";
import { getCatalogRootIconId } from "@/shared/config/catalog-root-icons";
import { getPayloadClient } from "@/shared/lib/payload/get-payload-client";
import { isPopulatedMedia } from "@/shared/lib/payload/media";
import type { CatalogProductsLandingArticle, CatalogProductsLandingData, CatalogProductsLandingPortrait } from "@/widgets/catalog-products/model/types";
import { PARTNER_CATALOG_ALL_FILTER_ID, getPartnerCatalogData } from "@/views/partner-catalog/model/partner-catalog-data";
import { getPartnerCatalogPathForFilter } from "@/views/partner-catalog/model/partner-catalog-query";

const DEFAULT_HERO_PORTRAITS: CatalogProductsLandingPortrait[] = [
  { src: "/catalog-products/1.webp", alt: "Изображение каталога продукции 1" },
  { src: "/catalog-products/2.webp", alt: "Изображение каталога продукции 2" },
  { src: "/catalog-products/3.webp", alt: "Изображение каталога продукции 3" },
  { src: "/catalog-products/5.webp", alt: "Изображение каталога продукции 5" },
  { src: "/catalog-products/6.webp", alt: "Изображение каталога продукции 6" },
  { src: "/catalog-products/7.webp", alt: "Изображение каталога продукции 7" },
] as const;

const DEFAULT_CATEGORIES_HEADING = "Мерч и корпоративные подарки";

const HERO_IMAGE_KEYS = ["leftTop", "leftMiddle", "leftBottom", "rightTop", "rightMiddle", "rightBottom"] as const;

type HeroImageKey = (typeof HERO_IMAGE_KEYS)[number];

type HeroImagesSource = Partial<Record<HeroImageKey, unknown>>;

function resolvePortrait(source: unknown, fallback: CatalogProductsLandingPortrait): CatalogProductsLandingPortrait {
  if (!isPopulatedMedia(source) || typeof source.url !== "string" || source.url.length === 0) {
    return fallback;
  }

  return {
    src: source.url,
    alt: source.alt || fallback.alt,
  };
}

export async function getCatalogProductsLandingData(): Promise<CatalogProductsLandingData> {
  const partnerCatalogCategories = (await getPartnerCatalogData()).categories;
  const blogPosts = await getBlogPosts();
  const payload = (await getPayloadClient()) as any;
  const catalogProductsPage = await payload.find({
    collection: "catalog-products-page",
    depth: 1,
    limit: 1,
    pagination: false,
  });
  const pageSource = catalogProductsPage.docs[0];
  const heroImagesSource = pageSource?.heroImages as HeroImagesSource | undefined;
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
    portraits: HERO_IMAGE_KEYS.map((key, index) => resolvePortrait(heroImagesSource?.[key], DEFAULT_HERO_PORTRAITS[index])),
    categoriesHeading:
      typeof pageSource?.categoriesHeading === "string" && pageSource.categoriesHeading.trim()
        ? pageSource.categoriesHeading
        : DEFAULT_CATEGORIES_HEADING,
    articles,
    categories,
  };
}
