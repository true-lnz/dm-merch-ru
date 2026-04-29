import { blogArticlesMock } from "@/entities/blog-post/model/mock";
import type { CatalogProductsLandingArticle, CatalogProductsLandingData, CatalogProductsLandingPortrait } from "@/widgets/catalog-products/model/types";
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

const CATEGORY_ICON_BY_ROOT_NAME: Record<string, string> = {
  "Корпоративная одежда с логотипом": "cloth",
  "Дом": "home",
  "Отдых": "compas",
  "Посуда": "cup",
  "Ежедневники и блокноты": "note",
  "Ручки с логотипом": "pen",
  "Сумки": "bag",
  "Зонты с логотипом": "umbrella",
  "Электроника и гаджеты": "electronics",
  "Корпоративные подарки": "promo",
  "Наградная продукция": "awards",
  "Корпоративные подарки на Новый год": "tree",
  "Сувениры на заказ": "unikum",
  "Сувениры к праздникам": "holiday",
  "Упаковка": "box",
  "Подарочные наборы": "set",
  "Коллекции с принтами": "cloth",
  "Съедобные корпоративные подарки с логотипом": "eat",
  "Спортивные товары с логотипом": "sport",
  "Элементы брендирования и кастомизации": "label",
  "Личные аксессуары из натуральной и искусственной кожи": "bag",
};

export function getCatalogProductsLandingData(): CatalogProductsLandingData {
  const partnerCatalogCategories = getPartnerCatalogData().categories;
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
    iconId: CATEGORY_ICON_BY_ROOT_NAME[category.name] ?? "set",
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
