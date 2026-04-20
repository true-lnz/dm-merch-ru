import "server-only";

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { cache } from "react";
import {
  getPartnerCatalogProductPath,
  getPartnerCatalogSectionContext,
  resolvePartnerCatalogSelection,
  type PartnerCatalogQueryParams,
} from "./partner-catalog-query";

export const PARTNER_CATALOG_ALL_FILTER_ID = "all";

type RawSection = {
  id: string;
  parentId: string | null;
  name: string;
};

type RawProductSize = {
  width?: number | null;
  length?: number | null;
  height?: number | null;
};

type RawProduct = {
  id: string;
  sectionId: string;
  name: string;
  article: string;
  description?: string | null;
  images?: string[] | null;
  brand?: string | null;
  collection?: string | null;
  format?: string | null;
  material1?: string | null;
  material2?: string | null;
  material3?: string | null;
  material4?: string | null;
  size?: RawProductSize | null;
  cover?: string | null;
  numberOfPages?: number | null;
  coating?: string | null;
  pocket?: boolean | null;
  blockSize?: string | null;
  capacity?: number | null;
  weight?: number | null;
  quantityInPackage?: number | null;
  boxWeight?: number | null;
  boxVolume?: number | null;
  layoutPdf?: string | null;
  fileAboutBlock?: string | null;
  dated?: string | null;
  color1?: string | null;
  color2?: string | null;
  color3?: string | null;
  color4?: string | null;
  color5?: string | null;
  color6?: string | null;
  tuning?: string[] | null;
  specials?: string[] | null;
  volumeMl?: number | null;
  parentId?: string | null;
  sizeClothing?: string | null;
  gender?: string | null;
  mandatoryMarking?: boolean | null;
  density?: string | null;
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

type PartnerCatalogDetailRouteContext = {
  rootName: string;
  rootSlug: string;
  childName: string;
  childSlug: string;
};

type PartnerCatalogVariantDetailSource = {
  variant: PartnerCatalogVariant;
  representative: RawProduct;
  items: RawProduct[];
};

type PartnerCatalogProductDetailSource = {
  id: string;
  sectionId: string;
  routeContext: PartnerCatalogDetailRouteContext;
  variants: PartnerCatalogVariantDetailSource[];
};

type PartnerCatalogDataset = {
  categories: PartnerCatalogRootSection[];
  products: PartnerCatalogProduct[];
  detailSourceByVariantId: Map<string, { product: PartnerCatalogProductDetailSource; variant: PartnerCatalogVariantDetailSource }>;
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

export type PartnerCatalogPageSlice = {
  items: PartnerCatalogProduct[];
  total: number;
};

export type PartnerCatalogInitialData = {
  categories: PartnerCatalogRootSection[];
  initialFilterId: string;
  initialExpandedRootId: string | null;
  initialQuery: PartnerCatalogQueryParams;
  initialSlice: PartnerCatalogPageSlice;
};

export type PartnerCatalogProductAttribute = {
  label: string;
  value: string;
};

export type PartnerCatalogProductDetailVariant = PartnerCatalogVariant & {
  href: string;
};

export type PartnerCatalogProductDetail = {
  id: string;
  productId: string;
  sectionId: string;
  title: string;
  article: string;
  descriptionHtml: string | null;
  imageUrls: string[];
  priceRub: number;
  discountPriceRub: number | null;
  stock: number;
  colorLabel: string;
  layoutPdf: string | null;
  fileAboutBlock: string | null;
  specials: string[];
  tuning: string[];
  attributes: PartnerCatalogProductAttribute[];
  variants: PartnerCatalogProductDetailVariant[];
  breadcrumb: {
    rootName: string;
    rootSlug: string;
    childName: string;
    childSlug: string;
  };
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

function getProductBaseArticle(article: string) {
  return getArticleSegments(article)[0] ?? article;
}

function getProductGroupKey(product: RawProduct) {
  return `${product.sectionId}:${getProductBaseArticle(product.article)}`;
}

function getVariantGroupKey(product: RawProduct) {
  return product.article;
}

function getVariantColorCode(product: RawProduct) {
  return getVariantGroupKey(product);
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

function getAllImages(product: RawProduct) {
  const imageUrls = product.images?.filter(Boolean) ?? [];

  return imageUrls.length > 0 ? imageUrls : [getPrimaryImage(product)];
}

function compareArticles(left: string, right: string) {
  return left.localeCompare(right, "ru");
}

function selectVariantRepresentative(items: RawProduct[], priceByProductId: Map<string, RawPrice>) {
  return (
    items.find((item) => !item.sizeClothing && priceByProductId.has(item.id)) ??
    items.find((item) => !item.sizeClothing) ??
    items.find((item) => priceByProductId.has(item.id)) ??
    items[0]
  );
}

function resolveVariantStock(items: RawProduct[], representative: RawProduct, stockByProductId: Map<string, number>) {
  if (!representative.sizeClothing && stockByProductId.has(representative.id)) {
    return stockByProductId.get(representative.id) ?? 0;
  }

  return items.reduce((sum, item) => sum + (stockByProductId.get(item.id) ?? 0), 0);
}

function formatMilliliters(value: number | null | undefined) {
  return value && value > 0 ? `${value} мл` : null;
}

function formatKilograms(value: number | null | undefined) {
  return value && value > 0 ? `${value.toLocaleString("ru-RU", { maximumFractionDigits: 3 })} кг` : null;
}

function formatCubicMeters(value: number | null | undefined) {
  return value && value > 0 ? `${value.toLocaleString("ru-RU", { maximumFractionDigits: 3 })} м³` : null;
}

function formatDimensions(size: RawProductSize | null | undefined) {
  const dimensions = [size?.width, size?.length, size?.height].filter((value): value is number => typeof value === "number" && value > 0);

  return dimensions.length > 0 ? `${dimensions.join(" × ")} мм` : null;
}

function formatMaterials(product: RawProduct) {
  const materials = [product.material1, product.material2, product.material3, product.material4].filter(
    (value): value is string => Boolean(value?.trim()),
  );

  return materials.length > 0 ? materials.join(", ") : null;
}

function resolveProductSizeLabel(product: RawProduct) {
  if (product.sizeClothing?.trim()) {
    return product.sizeClothing.trim();
  }

  if (product.format?.trim()) {
    return product.format.trim();
  }

  return formatDimensions(product.size);
}

function buildDetailAttributes(product: RawProduct) {
  const attributes: PartnerCatalogProductAttribute[] = [];
  const productSize = resolveProductSizeLabel(product);
  const packagingDimensions = formatDimensions(product.size);

  const orderedAttributes: Array<[string, string | null | undefined]> = [
    ["Бренд", product.brand],
    ["Коллекция", product.collection],
    ["Размер изделия", productSize ?? "Не указан"],
    ["Формат", product.format],
    ["Материалы", formatMaterials(product)],
    ["Габариты упаковки", packagingDimensions ?? "Не указаны"],
    ["Объем", formatMilliliters(product.volumeMl)],
    ["Вес изделия", formatKilograms(product.weight)],
    ["Вес коробки", formatKilograms(product.boxWeight)],
    ["Объем коробки", formatCubicMeters(product.boxVolume)],
    ["В упаковке", product.quantityInPackage && product.quantityInPackage > 0 ? `${product.quantityInPackage} шт.` : null],
    ["Обложка", product.cover],
    ["Размер блока", product.blockSize],
    ["Страниц", product.numberOfPages && product.numberOfPages > 0 ? String(product.numberOfPages) : null],
    ["Вместимость", product.capacity && product.capacity > 0 ? String(product.capacity) : null],
    ["Покрытие", product.coating],
    ["Плотность", product.density],
    ["Пол", product.gender],
    ["Карман", product.pocket ? "Есть" : null],
    ["Обязательная маркировка", product.mandatoryMarking ? "Требуется" : null],
  ];

  for (const [label, value] of orderedAttributes) {
    if (!value) {
      continue;
    }

    attributes.push({
      label,
      value,
    });
  }

  return attributes;
}

const getPartnerCatalogDataset = cache((): PartnerCatalogDataset => {
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
    const variantKey = getVariantColorCode(product);
    const existingGroup = productGroups.get(groupKey);

    if (!existingGroup) {
      productGroups.set(groupKey, { sectionId: product.sectionId, variants: new Map([[variantKey, [product]]]) });
      continue;
    }

    const existingVariantGroup = existingGroup.variants.get(variantKey) ?? [];
    existingVariantGroup.push(product);
    existingGroup.variants.set(variantKey, existingVariantGroup);
  }

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

  const productDetails: PartnerCatalogProductDetailSource[] = [];

  for (const [id, group] of productGroups.entries()) {
    const routeContext = getPartnerCatalogSectionContext(
      rootSections
        .map((rootSection) => ({
          id: rootSection.id,
          name: rootSection.name,
          children: (childSectionsByRootId.get(rootSection.id) ?? []).map((childSection) => ({
            id: childSection.id,
            name: childSection.name,
          })),
        }))
        .filter((rootSection) => rootSection.children.length > 0),
      group.sectionId,
    );

    if (!routeContext) {
      continue;
    }

    const variants = [...group.variants.entries()]
      .map(([colorCode, items]) => {
        const representative = selectVariantRepresentative(items, priceByProductId);

        if (!representative) {
          return null;
        }

        const priceSource = priceByProductId.get(representative.id) ?? items.map((item) => priceByProductId.get(item.id)).find(Boolean);

        if (!priceSource) {
          return null;
        }

        return {
          representative,
          items,
          variant: {
            id: representative.id,
            article: representative.article,
            title: stripSizeFromTitle(representative.name),
            imageUrl: getPrimaryImage(representative),
            colorCode,
            colorLabel: getVariantColorLabel(representative, colorCode),
            priceRub: priceSource.price,
            discountPriceRub: priceSource.discountPrice,
            stock: resolveVariantStock(items, representative, stockByProductId),
          } satisfies PartnerCatalogVariant,
        } satisfies PartnerCatalogVariantDetailSource;
      })
      .filter((variant): variant is PartnerCatalogVariantDetailSource => Boolean(variant))
      .sort((left, right) => compareArticles(left.variant.article, right.variant.article));

    if (variants.length === 0) {
      continue;
    }

    productDetails.push({
      id,
      sectionId: group.sectionId,
      routeContext: {
        rootName: routeContext.rootName,
        rootSlug: routeContext.rootSlug,
        childName: routeContext.childName,
        childSlug: routeContext.childSlug,
      },
      variants,
    });
  }

  productDetails.sort((left, right) => compareArticles(left.variants[0]?.variant.article ?? left.id, right.variants[0]?.variant.article ?? right.id));

  const products = productDetails.map(
    (product): PartnerCatalogProduct => ({
      id: product.id,
      sectionId: product.sectionId,
      variants: product.variants.map((variant) => variant.variant),
    }),
  );

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

  const detailSourceByVariantId = new Map<string, { product: PartnerCatalogProductDetailSource; variant: PartnerCatalogVariantDetailSource }>();

  for (const product of productDetails) {
    for (const variant of product.variants) {
      detailSourceByVariantId.set(variant.variant.id, { product, variant });
    }
  }

  return {
    categories,
    products,
    detailSourceByVariantId,
  };
});

function getFilteredProducts(products: PartnerCatalogProduct[], filterId: string) {
  if (filterId === PARTNER_CATALOG_ALL_FILTER_ID) {
    return products;
  }

  return products.filter((product) => product.sectionId === filterId);
}

export const getPartnerCatalogData = cache((): PartnerCatalogData => {
  const dataset = getPartnerCatalogDataset();

  return {
    categories: dataset.categories,
    products: dataset.products,
  };
});

export const getPartnerCatalogProductsPage = cache(
  (filterId: string, offset: number, limit: number): PartnerCatalogPageSlice => {
    const { products } = getPartnerCatalogDataset();
    const filteredProducts = getFilteredProducts(products, filterId);
    const safeOffset = Math.max(0, offset);
    const safeLimit = Math.max(1, limit);

    return {
      items: filteredProducts.slice(safeOffset, safeOffset + safeLimit),
      total: filteredProducts.length,
    };
  },
);

export const getPartnerCatalogInitialData = cache((limit: number, query: PartnerCatalogQueryParams = {}): PartnerCatalogInitialData => {
  const { categories } = getPartnerCatalogDataset();
  const selection = resolvePartnerCatalogSelection(categories, query, PARTNER_CATALOG_ALL_FILTER_ID);

  return {
    categories,
    initialFilterId: selection.filterId,
    initialExpandedRootId: selection.expandedRootId,
    initialQuery: {
      category: selection.categorySlug,
      subcategory: selection.subcategorySlug,
    },
    initialSlice: getPartnerCatalogProductsPage(selection.filterId, 0, limit),
  };
});

export const getPartnerCatalogProductDetailByVariantId = cache((variantId: string): PartnerCatalogProductDetail | null => {
  const { categories, detailSourceByVariantId } = getPartnerCatalogDataset();
  const detailSource = detailSourceByVariantId.get(variantId);

  if (!detailSource) {
    return null;
  }

  const activeVariant = detailSource.variant;
  const activeProduct = activeVariant.representative;

  return {
    id: detailSource.product.id,
    productId: activeVariant.variant.id,
    sectionId: detailSource.product.sectionId,
    title: activeVariant.variant.title,
    article: activeVariant.variant.article,
    descriptionHtml: activeProduct.description?.trim() || null,
    imageUrls: getAllImages(activeProduct),
    priceRub: activeVariant.variant.priceRub,
    discountPriceRub: activeVariant.variant.discountPriceRub,
    stock: activeVariant.variant.stock,
    colorLabel: activeVariant.variant.colorLabel,
    layoutPdf: activeProduct.layoutPdf?.trim() || null,
    fileAboutBlock: activeProduct.fileAboutBlock?.trim() || null,
    specials: activeProduct.specials?.filter(Boolean) ?? [],
    tuning: activeProduct.tuning?.filter(Boolean) ?? [],
    attributes: buildDetailAttributes(activeProduct),
    variants: detailSource.product.variants.map((variant) => ({
      ...variant.variant,
      href: getPartnerCatalogProductPath(
        categories,
        detailSource.product.sectionId,
        variant.variant.id,
      ),
    })),
    breadcrumb: {
      rootName: detailSource.product.routeContext.rootName,
      rootSlug: detailSource.product.routeContext.rootSlug,
      childName: detailSource.product.routeContext.childName,
      childSlug: detailSource.product.routeContext.childSlug,
    },
  };
});
