import "server-only";

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { cache } from "react";
import { getMergedCatalogTaxonomySettings } from "@/shared/lib/payload/merged-catalog-taxonomy";
import {
  PARTNER_CATALOG_DEFAULT_SORT,
  getPartnerCatalogFilterInputValues,
  getPartnerCatalogProductPath,
  getPartnerCatalogSectionContext,
  normalizePartnerCatalogFilters,
  normalizePartnerCatalogSort,
  resolvePartnerCatalogSelection,
  type PartnerCatalogFilters,
  type PartnerCatalogFilterInputValues,
  type PartnerCatalogQueryParams,
  type PartnerCatalogSortKey,
} from "./partner-catalog-query";

export const PARTNER_CATALOG_ALL_FILTER_ID = "all";

type MergedCatalogVariant = {
  id: string;
  article: string;
  title: string;
  imageUrl: string;
  imageUrls?: string[];
  colorCode: string;
  colorLabel: string;
  priceRub: number;
  discountPriceRub: number | null;
  stock: number;
};

type MergedCatalogProductAttribute = {
  label: string;
  value: string;
};

type MergedCatalogSourceCategory = {
  rootId: string | null;
  rootName: string;
  childId: string | null;
  childName: string;
};

type MergedCatalogUnifiedCategory = {
  rootId: string;
  rootName: string;
  childId: string;
  childName: string;
};

type MergedCatalogProduct = {
  id: string;
  source: string;
  sectionId: string;
  rootSectionId: string;
  title: string;
  descriptionHtml: string | null;
  imageUrls: string[];
  brand: string | null;
  attributes: MergedCatalogProductAttribute[];
  layoutPdf: string | null;
  fileAboutBlock: string | null;
  sourceCategory: MergedCatalogSourceCategory;
  unifiedCategory: MergedCatalogUnifiedCategory;
  variants: MergedCatalogVariant[];
};

type MergedCatalogChildSection = {
  id: string;
  name: string;
  productCount: number;
};

type MergedCatalogRootSection = {
  id: string;
  name: string;
  productCount: number;
  children: MergedCatalogChildSection[];
};

type MergedCatalogDataset = {
  categories: MergedCatalogRootSection[];
  products: MergedCatalogProduct[];
};

type PartnerCatalogVariantDetailSource = {
  variant: PartnerCatalogVariant;
  representative: MergedCatalogVariant;
};

type PartnerCatalogProductDetailSource = {
  id: string;
  sectionId: string;
  detail: MergedCatalogProduct;
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
  rootSectionId: string;
  variants: PartnerCatalogVariant[];
};

export type PartnerCatalogChildSection = {
  id: string;
  name: string;
  sourceName: string;
  productCount: number;
};

export type PartnerCatalogRootSection = {
  id: string;
  name: string;
  sourceName: string;
  productCount: number;
  children: PartnerCatalogChildSection[];
};

export type PartnerCatalogData = {
  categories: PartnerCatalogRootSection[];
  products: PartnerCatalogProduct[];
};

type PartnerCatalogChildSectionWithSort = PartnerCatalogChildSection & {
  sortOrder: number;
};

type PartnerCatalogRootSectionWithSort = PartnerCatalogRootSection & {
  children: PartnerCatalogChildSectionWithSort[];
  sortOrder: number;
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
  initialFilters: PartnerCatalogFilterInputValues;
  initialSort: PartnerCatalogSortKey;
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
};

function readJsonFile<T>(fileName: string): T {
  const filePath = join(process.cwd(), "public", "_temp", fileName);

  if (!existsSync(filePath)) {
    throw new Error(`Файл ${fileName} не найден. Запустите сборку каталога: pnpm build:merged-catalog`);
  }

  return JSON.parse(readFileSync(filePath, "utf8")) as T;
}

function compareArticles(left: string, right: string) {
  return left.localeCompare(right, "ru");
}

function normalizePartnerCatalogImageUrl(value: string) {
  return value;
}

function getRootTaxonomyKey(rootId: string) {
  return `root:${rootId}`;
}

function getChildTaxonomyKey(childId: string) {
  return `child:${childId}`;
}

function resolveDisplayName(sourceName: string, override: string | null | undefined) {
  return override?.trim() || sourceName;
}

function getSortOrder(sortOrder: number | null | undefined, fallback: number) {
  return typeof sortOrder === "number" ? sortOrder : fallback;
}

function mapVariant(source: MergedCatalogVariant): PartnerCatalogVariant {
  return {
    id: source.id,
    article: source.article,
    title: source.title,
    imageUrl: normalizePartnerCatalogImageUrl(source.imageUrl),
    colorCode: source.colorCode,
    colorLabel: source.colorLabel,
    priceRub: source.priceRub,
    discountPriceRub: source.discountPriceRub,
    stock: source.stock,
  };
}

function matchesPartnerCatalogVariantFilters(variant: PartnerCatalogVariant, filters: PartnerCatalogFilters) {
  if (filters.priceFrom !== undefined && variant.priceRub < filters.priceFrom) {
    return false;
  }

  if (filters.priceTo !== undefined && variant.priceRub > filters.priceTo) {
    return false;
  }

  if (filters.stockFrom !== undefined && variant.stock < filters.stockFrom) {
    return false;
  }

  return true;
}

function getProductRepresentativeVariant(product: PartnerCatalogProduct, filters: PartnerCatalogFilters) {
  return product.variants.find((variant) => matchesPartnerCatalogVariantFilters(variant, filters)) ?? product.variants[0];
}

function sortPartnerCatalogProducts(products: PartnerCatalogProduct[], filters: PartnerCatalogFilters, sort: PartnerCatalogSortKey) {
  return [...products].sort((left, right) => {
    const leftVariant = getProductRepresentativeVariant(left, filters);
    const rightVariant = getProductRepresentativeVariant(right, filters);

    if (!leftVariant || !rightVariant) {
      return left.id.localeCompare(right.id, "ru");
    }

    const metric =
      sort === "price-asc" || sort === "price-desc"
        ? leftVariant.priceRub - rightVariant.priceRub
        : leftVariant.stock - rightVariant.stock;

    if (metric !== 0) {
      return sort === "price-desc" || sort === "stock-desc" ? -metric : metric;
    }

    return compareArticles(leftVariant.article, rightVariant.article);
  });
}

function getFilteredProducts(products: PartnerCatalogProduct[], filterId: string, filters: PartnerCatalogFilters, sort: PartnerCatalogSortKey) {
  const categoryFilteredProducts =
    filterId === PARTNER_CATALOG_ALL_FILTER_ID
      ? products
      : products.filter((product) => product.sectionId === filterId || product.rootSectionId === filterId);

  const filteredProducts =
    filters.priceFrom === undefined && filters.priceTo === undefined && filters.stockFrom === undefined
      ? categoryFilteredProducts
      : categoryFilteredProducts.filter((product) => product.variants.some((variant) => matchesPartnerCatalogVariantFilters(variant, filters)));

  return sortPartnerCatalogProducts(filteredProducts, filters, sort);
}

const getPartnerCatalogDataset = cache(async (): Promise<PartnerCatalogDataset> => {
  const mergedCatalog = readJsonFile<MergedCatalogDataset>("merged-catalog.json");
  const taxonomySettings = await getMergedCatalogTaxonomySettings();
  const categoriesWithSort: PartnerCatalogRootSectionWithSort[] = mergedCatalog.categories
    .map(
      (rootCategory, rootIndex): PartnerCatalogRootSectionWithSort => ({
        id: rootCategory.id,
        name: resolveDisplayName(rootCategory.name, taxonomySettings.get(getRootTaxonomyKey(rootCategory.id))?.override),
        sourceName: rootCategory.name,
        productCount: rootCategory.productCount,
        sortOrder: getSortOrder(taxonomySettings.get(getRootTaxonomyKey(rootCategory.id))?.sortOrder, rootIndex),
        children: rootCategory.children
          .map(
            (childCategory, childIndex): PartnerCatalogChildSectionWithSort => ({
              id: childCategory.id,
              name: resolveDisplayName(childCategory.name, taxonomySettings.get(getChildTaxonomyKey(childCategory.id))?.override),
              sourceName: childCategory.name,
              productCount: childCategory.productCount,
              sortOrder: getSortOrder(taxonomySettings.get(getChildTaxonomyKey(childCategory.id))?.sortOrder, childIndex),
            }),
          )
          .sort((left, right) => left.sortOrder - right.sortOrder || left.name.localeCompare(right.name, "ru")),
      }),
    )
    .filter((rootCategory) => rootCategory.id !== "misc" && rootCategory.productCount > 0)
    .sort((left, right) => left.sortOrder - right.sortOrder || left.name.localeCompare(right.name, "ru"));

  const categories: PartnerCatalogRootSection[] = categoriesWithSort.map((rootCategory) => ({
    id: rootCategory.id,
    name: rootCategory.name,
    sourceName: rootCategory.sourceName,
    productCount: rootCategory.productCount,
    children: rootCategory.children.map((childCategory) => ({
      id: childCategory.id,
      name: childCategory.name,
      sourceName: childCategory.sourceName,
      productCount: childCategory.productCount,
    })),
  }));

  const categoryQuerySource = categories.map((rootCategory) => ({
    id: rootCategory.id,
    name: rootCategory.name,
    sourceName: rootCategory.sourceName,
    children: rootCategory.children.map((childCategory) => ({
      id: childCategory.id,
      name: childCategory.name,
      sourceName: childCategory.sourceName,
    })),
  }));

  const detailSourceByVariantId = new Map<string, { product: PartnerCatalogProductDetailSource; variant: PartnerCatalogVariantDetailSource }>();

  const productDetails = mergedCatalog.products
    .map((product): PartnerCatalogProductDetailSource | null => {
      const routeContext = getPartnerCatalogSectionContext(categoryQuerySource, product.sectionId);

      if (!routeContext) {
        return null;
      }

      const variants = product.variants
        .map((variant) => ({
          representative: variant,
          variant: mapVariant(variant),
        }))
        .sort((left, right) => compareArticles(left.variant.article, right.variant.article));

      if (variants.length === 0) {
        return null;
      }

      return {
        id: product.id,
        sectionId: product.sectionId,
        detail: {
          ...product,
          imageUrls: product.imageUrls.map(normalizePartnerCatalogImageUrl),
          variants: product.variants.map((variant) => ({
            ...variant,
            imageUrl: normalizePartnerCatalogImageUrl(variant.imageUrl),
            imageUrls: variant.imageUrls?.map(normalizePartnerCatalogImageUrl),
          })),
        },
        variants,
      };
    })
    .filter((product): product is PartnerCatalogProductDetailSource => Boolean(product))
    .sort((left, right) => compareArticles(left.variants[0]?.variant.article ?? left.id, right.variants[0]?.variant.article ?? right.id));

  for (const product of productDetails) {
    for (const variant of product.variants) {
      detailSourceByVariantId.set(variant.variant.id, { product, variant });
    }
  }

  return {
    categories,
    products: productDetails.map(
      (product): PartnerCatalogProduct => ({
        id: product.id,
        sectionId: product.sectionId,
        rootSectionId: product.detail.rootSectionId,
        variants: product.variants.map((variant) => variant.variant),
      }),
    ),
    detailSourceByVariantId,
  };
});

export const getPartnerCatalogData = cache(async (): Promise<PartnerCatalogData> => {
  const dataset = await getPartnerCatalogDataset();

  return {
    categories: dataset.categories,
    products: dataset.products,
  };
});

export const getPartnerCatalogProductsPage = cache(
  async (
    filterId: string,
    offset: number,
    limit: number,
    filters: PartnerCatalogFilters = {},
    sort: PartnerCatalogSortKey = PARTNER_CATALOG_DEFAULT_SORT,
  ): Promise<PartnerCatalogPageSlice> => {
    const { products } = await getPartnerCatalogDataset();
    const filteredProducts = getFilteredProducts(products, filterId, filters, sort);
    const safeOffset = Math.max(0, offset);
    const safeLimit = Math.max(1, limit);

    return {
      items: filteredProducts.slice(safeOffset, safeOffset + safeLimit),
      total: filteredProducts.length,
    };
  },
);

export const getPartnerCatalogInitialData = cache(async (limit: number, query: PartnerCatalogQueryParams = {}): Promise<PartnerCatalogInitialData> => {
  const { categories } = await getPartnerCatalogDataset();
  const selection = resolvePartnerCatalogSelection(categories, query, PARTNER_CATALOG_ALL_FILTER_ID);
  const filters = normalizePartnerCatalogFilters(query);
  const sort = normalizePartnerCatalogSort(query.sort);

  return {
    categories,
    initialFilterId: selection.filterId,
    initialExpandedRootId: selection.expandedRootId,
    initialQuery: {
      category: selection.categorySlug,
      subcategory: selection.subcategorySlug,
    },
    initialFilters: getPartnerCatalogFilterInputValues(filters),
    initialSort: sort,
    initialSlice: await getPartnerCatalogProductsPage(selection.filterId, 0, limit, filters, sort),
  };
});

export const getPartnerCatalogProductDetailByVariantId = cache(async (variantId: string): Promise<PartnerCatalogProductDetail | null> => {
  const { categories, detailSourceByVariantId } = await getPartnerCatalogDataset();
  const detailSource = detailSourceByVariantId.get(variantId);

  if (!detailSource) {
    return null;
  }

  const activeVariant = detailSource.variant;
  const activeProduct = detailSource.product.detail;

  return {
    id: detailSource.product.id,
    productId: activeVariant.variant.id,
    sectionId: detailSource.product.sectionId,
    title: activeVariant.variant.title,
    article: activeVariant.variant.article,
    descriptionHtml: activeProduct.descriptionHtml?.trim() || null,
    imageUrls: activeVariant.representative.imageUrls?.filter(Boolean) ?? activeProduct.imageUrls,
    priceRub: activeVariant.variant.priceRub,
    discountPriceRub: activeVariant.variant.discountPriceRub,
    stock: activeVariant.variant.stock,
    colorLabel: activeVariant.variant.colorLabel,
    layoutPdf: activeProduct.layoutPdf?.trim() || null,
    fileAboutBlock: activeProduct.fileAboutBlock?.trim() || null,
    specials: [],
    tuning: [],
    attributes: activeProduct.attributes,
    variants: detailSource.product.variants.map((variant) => ({
      ...variant.variant,
      href: getPartnerCatalogProductPath(
        categories,
        detailSource.product.sectionId,
        variant.variant.id,
      ),
    })),
  };
});
