import "server-only";

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { cache } from "react";

type RawSection = {
  id: string;
  parentId: string | null;
  name: string;
};

type RawProduct = {
  id: string;
  sectionId: string;
  name: string;
  article: string;
  sizeClothing?: string | null;
  images?: string[] | null;
  color1?: string | null;
  color2?: string | null;
  color3?: string | null;
  color4?: string | null;
  color5?: string | null;
  color6?: string | null;
};

type RawCatalog = {
  sections: Record<string, RawSection> | RawSection[];
  products: RawProduct[];
};

type RawPrice = {
  productId: string;
  price: number;
  discountPrice: number | null;
};

type RawPrices = {
  prices: RawPrice[];
};

type RawStock = {
  productId: string;
  quantity: number | null;
  availableQuantity: number | null;
};

type RawStocks = {
  stocks: RawStock[];
};

export type PartnerCatalogVariant = {
  id: string;
  article: string;
  title: string;
  imageUrl: string;
  colorCode: string;
  colorLabel: string;
  priceRub: number;
  discountPriceRub: number | null;
  stock: number;
};

export type PartnerCatalogProduct = {
  id: string;
  sectionId: string;
  variants: PartnerCatalogVariant[];
};

export type PartnerCatalogChildSection = {
  id: string;
  name: string;
  productCount: number;
};

export type PartnerCatalogRootSection = {
  id: string;
  name: string;
  productCount: number;
  children: PartnerCatalogChildSection[];
};

export type PartnerCatalogData = {
  categories: PartnerCatalogRootSection[];
  products: PartnerCatalogProduct[];
};

type SectionCount = {
  direct: number;
  total: number;
};

function readJsonFile<T>(fileName: string): T {
  const filePath = join(process.cwd(), "public", "_temp", fileName);

  return JSON.parse(readFileSync(filePath, "utf8")) as T;
}

function getArticleSegments(article: string) {
  return article.split(".").filter(Boolean);
}

function getProductGroupKey(product: RawProduct) {
  const segments = getArticleSegments(product.article);

  if (product.sizeClothing && segments.length >= 3) {
    return `${product.sectionId}:${segments.slice(0, -2).join(".")}`;
  }

  if (segments.length <= 1) {
    return `${product.sectionId}:${product.article}`;
  }

  return `${product.sectionId}:${segments.slice(0, -1).join(".")}`;
}

function getVariantColorCode(product: RawProduct) {
  const segments = getArticleSegments(product.article);

  return segments.at(-1) ?? product.article;
}

function stripSizeFromTitle(title: string) {
  return title.replace(/,\s*размер\s+[^,]+$/i, "").replace(/\s{2,}/g, " ").trim();
}

function getVariantColorLabel(product: RawProduct, fallbackCode: string) {
  const labels = [product.color1, product.color2, product.color3, product.color4, product.color5, product.color6].filter(
    (value): value is string => Boolean(value),
  );

  return labels.join(", ") || fallbackCode;
}

function getPrimaryImage(product: RawProduct) {
  return product.images?.find(Boolean) ?? "/catalog/img_card_cover_main.svg";
}

function compareArticles(left: string, right: string) {
  return left.localeCompare(right, "ru");
}

export const getPartnerCatalogData = cache((): PartnerCatalogData => {
  const catalog = readJsonFile<RawCatalog>("catalog.json");
  const prices = readJsonFile<RawPrices>("prices.json");
  const stocks = readJsonFile<RawStocks>("stocks.json");

  const sections = Object.values(catalog.sections);
  const sectionById = new Map(sections.map((section) => [section.id, section]));
  const priceByProductId = new Map(prices.prices.map((price) => [price.productId, price]));
  const stockByProductId = new Map<string, number>();

  for (const stock of stocks.stocks) {
    const nextQuantity = stock.availableQuantity ?? stock.quantity ?? 0;
    stockByProductId.set(stock.productId, (stockByProductId.get(stock.productId) ?? 0) + nextQuantity);
  }

  const productGroups = new Map<string, { sectionId: string; variants: Map<string, RawProduct[]> }>();

  for (const product of catalog.products) {
    const groupKey = getProductGroupKey(product);
    const colorCode = getVariantColorCode(product);
    const existingGroup = productGroups.get(groupKey);

    if (!existingGroup) {
      productGroups.set(groupKey, { sectionId: product.sectionId, variants: new Map([[colorCode, [product]]]) });
      continue;
    }

    const existingColorGroup = existingGroup.variants.get(colorCode) ?? [];
    existingColorGroup.push(product);
    existingGroup.variants.set(colorCode, existingColorGroup);
  }

  const products = [...productGroups.entries()]
    .map(([id, group]) => {
      const variants = [...group.variants.entries()]
        .map(([colorCode, items]) => {
          const representative =
            items.find((item) => !item.sizeClothing && priceByProductId.has(item.id)) ??
            items.find((item) => !item.sizeClothing) ??
            items.find((item) => priceByProductId.has(item.id)) ??
            items[0];

          if (!representative) {
            return null;
          }

          const priceSource = priceByProductId.get(representative.id) ?? items.map((item) => priceByProductId.get(item.id)).find(Boolean);

          if (!priceSource) {
            return null;
          }

          const stock =
            !representative.sizeClothing && stockByProductId.has(representative.id)
              ? stockByProductId.get(representative.id) ?? 0
              : items.reduce((sum, item) => sum + (stockByProductId.get(item.id) ?? 0), 0);

          return {
            id: representative.id,
            article: representative.article,
            title: stripSizeFromTitle(representative.name),
            imageUrl: getPrimaryImage(representative),
            colorCode,
            colorLabel: getVariantColorLabel(representative, colorCode),
            priceRub: priceSource.price,
            discountPriceRub: priceSource.discountPrice,
            stock,
          } satisfies PartnerCatalogVariant;
        })
        .filter((variant): variant is PartnerCatalogVariant => Boolean(variant))
        .sort((left, right) => compareArticles(left.article, right.article));

      return {
        id,
        sectionId: group.sectionId,
        variants,
      };
    })
    .filter((product) => product.variants.length > 0)
    .sort((left, right) => compareArticles(left.variants[0]?.article ?? left.id, right.variants[0]?.article ?? right.id));

  const rootSections = sections.filter((section) => !section.parentId);
  const childSectionsByRootId = new Map<string, RawSection[]>();

  for (const section of sections) {
    if (!section.parentId) {
      continue;
    }

    const nextChildren = childSectionsByRootId.get(section.parentId) ?? [];
    nextChildren.push(section);
    childSectionsByRootId.set(section.parentId, nextChildren);
  }

  const sectionCounts = new Map<string, SectionCount>();

  for (const product of products) {
    const nextSectionCount = sectionCounts.get(product.sectionId) ?? { direct: 0, total: 0 };
    nextSectionCount.direct += 1;
    nextSectionCount.total += 1;
    sectionCounts.set(product.sectionId, nextSectionCount);

    const section = sectionById.get(product.sectionId);

    if (!section?.parentId) {
      continue;
    }

    const nextRootCount = sectionCounts.get(section.parentId) ?? { direct: 0, total: 0 };
    nextRootCount.total += 1;
    sectionCounts.set(section.parentId, nextRootCount);
  }

  const categories = rootSections
    .map((rootSection) => {
      const childSections = (childSectionsByRootId.get(rootSection.id) ?? [])
        .map((childSection) => ({
          id: childSection.id,
          name: childSection.name,
          productCount: sectionCounts.get(childSection.id)?.direct ?? 0,
        }))
        .filter((childSection) => childSection.productCount > 0)
        .sort((left, right) => right.productCount - left.productCount || left.name.localeCompare(right.name, "ru"));
      const directCount = sectionCounts.get(rootSection.id)?.direct ?? 0;
      const totalCount = directCount + childSections.reduce((sum, childSection) => sum + childSection.productCount, 0);

      return {
        id: rootSection.id,
        name: rootSection.name,
        productCount: totalCount,
        children: childSections,
      };
    })
    .filter((rootSection) => rootSection.productCount > 0)
    .sort((left, right) => right.productCount - left.productCount || left.name.localeCompare(right.name, "ru"));

  return {
    categories,
    products,
  };
});
