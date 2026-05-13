import "server-only";

import type { Metadata } from "next";

import { CATEGORY_CATALOG_DATA, MAIN_CATALOG_DATA } from "@/views/catalog/model/catalog-data";
import { buildSEOMetadata } from "./seo-metadata";
import { getPayloadClient } from "./get-payload-client";
import { mapCmsImage } from "./media";

export type CatalogCategoryPageData = {
  id: number | string;
  slug: string;
  title: string;
  heroTitle: string;
  heroImage: {
    src: string;
    alt: string;
  };
  products: Array<{
    title: string;
    description: string;
    imageUrl: string;
    buttonLabel: string;
    customLink?: string;
  }>;
  casesVariant: "default" | "stacked";
  cases: Array<{
    id: string;
    company: string;
    description: string;
    result: string;
    images: Array<{
      src: string;
      alt: string;
      fit?: "cover" | "contain";
      x?: number;
      y?: number;
    }>;
  }>;
  meta?: {
    canonicalUrl?: null | string;
    description?: null | string;
    image?: unknown;
    keywords?: null | string;
    openGraph?: {
      description?: null | string;
      imageAlt?: null | string;
      title?: null | string;
      type?: null | "article" | "website";
    } | null;
    robots?: {
      noFollow?: boolean | null;
      noIndex?: boolean | null;
    } | null;
    title?: null | string;
    twitter?: {
      card?: null | "summary" | "summary_large_image";
      description?: null | string;
      imageAlt?: null | string;
      title?: null | string;
    } | null;
  } | null;
};

export type CatalogMenuCategory = {
  id: number | string;
  title: string;
  slug: string;
  menuOrder: number;
};

export type CatalogRootPageData = {
  id: number | string;
  heroTitle: string;
  heroImage: {
    src: string;
    alt: string;
  };
  showProductsSubheading?: boolean;
  products: CatalogCategoryPageData["products"];
  casesVariant: "default" | "stacked";
  cases: CatalogCategoryPageData["cases"];
  meta?: CatalogCategoryPageData["meta"];
};

type FindResult<TDoc> = {
  docs?: TDoc[];
};

type CategoryRelation = {
  id: number | string;
  title?: string | null;
  slug?: string | null;
  menuOrder?: number | null;
  isActive?: boolean | null;
};

type PageDoc = {
  id: number | string;
  slug?: string | null;
  category?: CategoryRelation | number | string | null;
  heroTitle?: string | null;
  heroImage?: unknown;
  casesLayout?: "default" | "stacked" | null;
  subcategories?: unknown[];
  cases?: unknown[];
  meta?: CatalogCategoryPageData["meta"];
};

type MenuCategoryDoc = {
  id: number | string;
  title?: string | null;
  slug?: string | null;
  menuOrder?: number | null;
  isActive?: boolean | null;
};

type PayloadClient = {
  find: (args: {
    collection: "catalog-category-pages" | "catalog-categories";
    depth: number;
    limit: number;
    pagination: boolean;
    sort?: string;
    where?: Record<string, unknown>;
  }) => Promise<FindResult<PageDoc | MenuCategoryDoc>>;
};

type CatalogCategoryProduct = CatalogCategoryPageData["products"][number];
type CatalogCategoryCaseImage = CatalogCategoryPageData["cases"][number]["images"][number];
type CatalogCategoryCase = CatalogCategoryPageData["cases"][number];

const CATEGORY_SLUG_ALIASES: Record<string, string> = {
  bryuki: "trousers",
};

const STATIC_CATEGORY_TITLES: Record<string, string> = {
  futbolki: "Футболки",
  tolstovki: "Толстовки",
  "verhnyaya-odezhda": "Верхняя одежда",
  headwear: "Головные уборы",
  bags: "Сумки и рюкзаки",
  souvenirs: "Сувенирная продукция",
  "custom-souvenirs": "Авторская сувенирная продукция",
  "business-accessories": "Деловые аксессуары",
  sportswear: "Спортивная одежда",
  trousers: "Брюки",
};

function hasOwnProperty<T extends object>(value: T, key: PropertyKey): key is keyof T {
  return Object.prototype.hasOwnProperty.call(value, key);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizeFit(value: unknown): "cover" | "contain" | undefined {
  return value === "contain" || value === "cover" ? value : undefined;
}

function normalizeNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function mapSubcategory(item: unknown): CatalogCategoryProduct | null {
  if (typeof item !== "object" || item === null) {
    return null;
  }

  const itemRecord = item as Record<string, unknown>;
  const title = itemRecord.title;
  const description = itemRecord.description;
  const mappedImage = mapCmsImage(itemRecord.image, isNonEmptyString(title) ? title : "Подкатегория");

  if (!isNonEmptyString(title) || !isNonEmptyString(description) || !mappedImage) {
    return null;
  }

  return {
    title,
    description,
    imageUrl: mappedImage.url,
    buttonLabel: isNonEmptyString(itemRecord.buttonLabel) ? itemRecord.buttonLabel : "Отправить заявку",
    customLink:
      itemRecord.useCustomLink === true && isNonEmptyString(itemRecord.customLink) ? itemRecord.customLink : undefined,
  };
}

function mapCaseImage(item: unknown): CatalogCategoryCaseImage | null {
  if (typeof item !== "object" || item === null) {
    return null;
  }

  const itemRecord = item as Record<string, unknown>;
  const mappedImage = mapCmsImage(itemRecord.image, "Кейс");

  if (!mappedImage) {
    return null;
  }

  return {
    src: mappedImage.url,
    alt: mappedImage.alt,
    fit: normalizeFit(itemRecord.fit),
    x: normalizeNumber(itemRecord.x),
    y: normalizeNumber(itemRecord.y),
  };
}

function mapCase(item: unknown): CatalogCategoryCase | null {
  if (typeof item !== "object" || item === null) {
    return null;
  }

  const itemRecord = item as Record<string, unknown>;
  const company = itemRecord.company;
  const description = itemRecord.description;
  const result = itemRecord.result;
  const images = Array.isArray(itemRecord.images)
    ? itemRecord.images.map(mapCaseImage).filter((image): image is CatalogCategoryCaseImage => image !== null)
    : [];

  if (!isNonEmptyString(company) || !isNonEmptyString(description) || !isNonEmptyString(result) || images.length === 0) {
    return null;
  }

  return {
    id: company,
    company,
    description,
    result,
    images,
  };
}

function mapPageDoc(doc: PageDoc): CatalogCategoryPageData | null {
  const slug = isNonEmptyString(doc.slug) ? doc.slug : null;
  const heroTitle = isNonEmptyString(doc.heroTitle) ? doc.heroTitle : null;
  const heroImage = mapCmsImage(doc.heroImage, "Категория каталога");
  const category =
    typeof doc.category === "object" && doc.category !== null
      ? doc.category
      : null;
  const title = category && isNonEmptyString(category.title) ? category.title : null;

  if (!slug || !heroTitle || !heroImage || !title) {
    return null;
  }

  return {
    id: doc.id,
    slug,
    title,
    heroTitle,
    heroImage: {
      src: heroImage.url,
      alt: heroImage.alt,
    },
    products: Array.isArray(doc.subcategories)
      ? doc.subcategories.map(mapSubcategory).filter((item): item is CatalogCategoryProduct => item !== null)
      : [],
    casesVariant: doc.casesLayout === "stacked" ? "stacked" : "default",
    cases: Array.isArray(doc.cases) ? doc.cases.map(mapCase).filter((item): item is CatalogCategoryCase => item !== null) : [],
    meta: doc.meta,
  };
}

function mapRootPageDoc(doc: PageDoc | null): CatalogRootPageData | null {
  const mappedPage = doc ? mapPageDoc(doc) : null;

  if (!mappedPage) {
    return null;
  }

  return {
    id: mappedPage.id,
    heroTitle: mappedPage.heroTitle,
    heroImage: {
      src: mappedPage.heroImage.src,
      alt: mappedPage.heroImage.alt,
    },
    showProductsSubheading: true,
    products: mappedPage.products,
    casesVariant: mappedPage.casesVariant,
    cases: mappedPage.cases,
    meta: mappedPage.meta,
  };
}

function getStaticCatalogRootPageData(): CatalogRootPageData {
  return {
    id: "static:catalog",
    heroTitle: MAIN_CATALOG_DATA.heroTitle,
    heroImage: {
      src: MAIN_CATALOG_DATA.heroImage.src,
      alt: MAIN_CATALOG_DATA.heroImage.alt,
    },
    showProductsSubheading: MAIN_CATALOG_DATA.showProductsSubheading,
    products: MAIN_CATALOG_DATA.products.map((product) => ({
      title: product.title,
      description: product.description,
      imageUrl: product.imageUrl,
      buttonLabel: product.ctaHref ? "Перейти в каталог" : "Отправить заявку",
      customLink: product.ctaHref,
    })),
    casesVariant: MAIN_CATALOG_DATA.casesVariant || "default",
    cases: MAIN_CATALOG_DATA.cases.map((item) => ({
      id: item.id,
      company: item.company,
      description: item.description,
      result: item.result,
      images: item.images.map((image) => ({
        src: image.src,
        alt: image.alt,
        fit: image.fit,
        x: image.x,
        y: image.y,
      })),
    })),
    meta: {
      canonicalUrl: "/catalog",
      title: "Весь каталог",
    },
  };
}

function getStaticCatalogCategoryPageData(slug: string): CatalogCategoryPageData | null {
  if (!hasOwnProperty(CATEGORY_CATALOG_DATA, slug)) {
    return null;
  }

  const source = CATEGORY_CATALOG_DATA[slug];
  const title = STATIC_CATEGORY_TITLES[slug] || source.heroTitle.replace(/\s+/g, " ").replace(/\n+/g, " ").trim();

  return {
    id: `static:${slug}`,
    slug,
    title,
    heroTitle: source.heroTitle,
    heroImage: {
      src: source.heroImage.src,
      alt: source.heroImage.alt,
    },
    products: source.products.map((product) => ({
      title: product.title,
      description: product.description,
      imageUrl: product.imageUrl,
      buttonLabel: product.ctaHref ? "Перейти в каталог" : "Отправить заявку",
      customLink: product.ctaHref,
    })),
    casesVariant: source.casesVariant || "default",
    cases: source.cases.map((item) => ({
      id: item.id,
      company: item.company,
      description: item.description,
      result: item.result,
      images: item.images.map((image) => ({
        src: image.src,
        alt: image.alt,
        fit: image.fit,
        x: image.x,
        y: image.y,
      })),
    })),
    meta: {
      canonicalUrl: `/catalog/${slug}`,
      title,
    },
  };
}

function getStaticMenuCategories(): CatalogMenuCategory[] {
  return [
    { id: "static:catalog", title: "Весь каталог", slug: "catalog", menuOrder: 1 },
    { id: "static:futbolki", title: "Футболки", slug: "futbolki", menuOrder: 2 },
    { id: "static:tolstovki", title: "Толстовки", slug: "tolstovki", menuOrder: 3 },
    { id: "static:verhnyaya-odezhda", title: "Верхняя одежда", slug: "verhnyaya-odezhda", menuOrder: 4 },
    { id: "static:trousers", title: "Брюки", slug: "trousers", menuOrder: 5 },
    { id: "static:headwear", title: "Головные уборы", slug: "headwear", menuOrder: 6 },
    { id: "static:bags", title: "Сумки и рюкзаки", slug: "bags", menuOrder: 7 },
    { id: "static:souvenirs", title: "Сувенирная продукция", slug: "souvenirs", menuOrder: 8 },
    { id: "static:custom-souvenirs", title: "Авторская сувенирная продукция", slug: "custom-souvenirs", menuOrder: 9 },
    { id: "static:business-accessories", title: "Деловые аксессуары", slug: "business-accessories", menuOrder: 10 },
    { id: "static:sportswear", title: "Спортивная одежда", slug: "sportswear", menuOrder: 11 },
  ];
}

export function normalizeCatalogCategorySlug(slug?: string | null): string | null {
  if (!isNonEmptyString(slug)) {
    return null;
  }

  return CATEGORY_SLUG_ALIASES[slug] || slug;
}

export async function getCatalogCategoryPageData(slug: string): Promise<CatalogCategoryPageData | null> {
  const normalizedSlug = normalizeCatalogCategorySlug(slug);

  if (!normalizedSlug) {
    return null;
  }

  try {
    const payload = (await getPayloadClient()) as PayloadClient;
    const result = await payload.find({
      collection: "catalog-category-pages",
      depth: 3,
      limit: 1,
      pagination: false,
      where: {
        slug: {
          equals: normalizedSlug,
        },
      },
    });
    const doc = Array.isArray(result?.docs) ? (result.docs[0] as PageDoc | null) : null;

    return mapPageDoc(doc as PageDoc) ?? getStaticCatalogCategoryPageData(normalizedSlug);
  } catch {
    return getStaticCatalogCategoryPageData(normalizedSlug);
  }
}

export async function getCatalogRootPageData(): Promise<CatalogRootPageData> {
  try {
    const payload = (await getPayloadClient()) as PayloadClient;
    const result = await payload.find({
      collection: "catalog-category-pages",
      depth: 3,
      limit: 1,
      pagination: false,
      where: {
        slug: {
          equals: "catalog",
        },
      },
    });
    const doc = Array.isArray(result?.docs) ? (result.docs[0] as PageDoc | null) : null;

    return mapRootPageDoc(doc) ?? getStaticCatalogRootPageData();
  } catch {
    return getStaticCatalogRootPageData();
  }
}

export async function getCatalogCategoryMetadata(slug: string): Promise<Metadata> {
  const page = await getCatalogCategoryPageData(slug);
  const normalizedSlug = normalizeCatalogCategorySlug(slug);
  const fallbackTitle = page?.title || "Каталог";

  return buildSEOMetadata({
    fallbackTitle,
    fallbackDescription: page?.title ? `${page.title} для брендирования и корпоративного мерча.` : "Категория каталога Держи Марку!",
    fallbackImage: page?.heroImage
      ? {
          alt: page.heroImage.alt,
          url: page.heroImage.src,
        }
      : undefined,
    meta: page?.meta,
    pathname: normalizedSlug ? `/catalog/${normalizedSlug}` : "/catalog",
    socialType: "website",
  });
}

export async function getCatalogRootMetadata(): Promise<Metadata> {
  const page = await getCatalogRootPageData();

  return buildSEOMetadata({
    fallbackTitle: "Весь каталог",
    fallbackDescription: "Полный каталог мерча и корпоративных подарков для брендирования.",
    fallbackImage: {
      alt: page.heroImage.alt,
      url: page.heroImage.src,
    },
    meta: page.meta,
    pathname: "/catalog",
    socialType: "website",
  });
}

export async function getCatalogMenuCategories(): Promise<CatalogMenuCategory[]> {
  try {
    const payload = (await getPayloadClient()) as PayloadClient;
    const result = await payload.find({
      collection: "catalog-categories",
      depth: 0,
      limit: 100,
      pagination: false,
      sort: "menuOrder",
      where: {
        isActive: {
          equals: true,
        },
      },
    });

    const docs = Array.isArray(result?.docs) ? (result.docs as MenuCategoryDoc[]) : [];
    const items = docs
      .map((doc) => {
        if (!isNonEmptyString(doc.title) || !isNonEmptyString(doc.slug)) {
          return null;
        }

        return {
          id: doc.id,
          title: doc.title,
          slug: doc.slug,
          menuOrder: typeof doc.menuOrder === "number" ? doc.menuOrder : 0,
        } satisfies CatalogMenuCategory;
      })
      .filter((item): item is CatalogMenuCategory => item !== null);

    return items.length > 0 ? items : getStaticMenuCategories();
  } catch {
    return getStaticMenuCategories();
  }
}
