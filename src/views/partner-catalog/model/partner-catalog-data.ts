import "server-only";

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { cache } from "react";
import {
  getPartnerCatalogFilterInputValues,
  getPartnerCatalogProductPath,
  getPartnerCatalogSectionContext,
  normalizePartnerCatalogFilters,
  resolvePartnerCatalogSelection,
  type PartnerCatalogFilters,
  type PartnerCatalogFilterInputValues,
  type PartnerCatalogQueryParams,
} from "./partner-catalog-query";

export const PARTNER_CATALOG_ALL_FILTER_ID = "all";

type PartnerCatalogDetailRouteContext = {
  rootName: string;
  rootSlug: string;
  childName: string;
  childSlug: string;
};

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
  routeContext: PartnerCatalogDetailRouteContext;
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
  initialFilters: PartnerCatalogFilterInputValues;
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

function getFilteredProducts(products: PartnerCatalogProduct[], filterId: string, filters: PartnerCatalogFilters) {
  const categoryFilteredProducts =
    filterId === PARTNER_CATALOG_ALL_FILTER_ID ? products : products.filter((product) => product.sectionId === filterId);

  if (filters.priceFrom === undefined && filters.priceTo === undefined && filters.stockFrom === undefined) {
    return categoryFilteredProducts;
  }

  return categoryFilteredProducts.filter((product) => product.variants.some((variant) => matchesPartnerCatalogVariantFilters(variant, filters)));
}

const getPartnerCatalogDataset = cache((): PartnerCatalogDataset => {
  const mergedCatalog = readJsonFile<MergedCatalogDataset>("merged-catalog.json");
  const categories = mergedCatalog.categories
    .map(
      (rootCategory): PartnerCatalogRootSection => ({
        id: rootCategory.id,
        name: rootCategory.name,
        productCount: rootCategory.productCount,
        children: rootCategory.children
          .map(
            (childCategory): PartnerCatalogChildSection => ({
              id: childCategory.id,
              name: childCategory.name,
              productCount: childCategory.productCount,
            }),
          ),
      }),
    )
    .filter((rootCategory) => rootCategory.id !== "misc" && rootCategory.productCount > 0);

  const categoryQuerySource = categories.map((rootCategory) => ({
    id: rootCategory.id,
    name: rootCategory.name,
    children: rootCategory.children.map((childCategory) => ({
      id: childCategory.id,
      name: childCategory.name,
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
        routeContext: {
          rootName: routeContext.rootName,
          rootSlug: routeContext.rootSlug,
          childName: routeContext.childName,
          childSlug: routeContext.childSlug,
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
        variants: product.variants.map((variant) => variant.variant),
      }),
    ),
    detailSourceByVariantId,
  };
});

export const getPartnerCatalogData = cache((): PartnerCatalogData => {
  const dataset = getPartnerCatalogDataset();

  return {
    categories: dataset.categories,
    products: dataset.products,
  };
});

export const getPartnerCatalogProductsPage = cache(
  (filterId: string, offset: number, limit: number, filters: PartnerCatalogFilters = {}): PartnerCatalogPageSlice => {
    const { products } = getPartnerCatalogDataset();
    const filteredProducts = getFilteredProducts(products, filterId, filters);
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
  const filters = normalizePartnerCatalogFilters(query);

  return {
    categories,
    initialFilterId: selection.filterId,
    initialExpandedRootId: selection.expandedRootId,
    initialQuery: {
      category: selection.categorySlug,
      subcategory: selection.subcategorySlug,
    },
    initialFilters: getPartnerCatalogFilterInputValues(filters),
    initialSlice: getPartnerCatalogProductsPage(selection.filterId, 0, limit, filters),
  };
});

export const getPartnerCatalogProductDetailByVariantId = cache((variantId: string): PartnerCatalogProductDetail | null => {
  const { categories, detailSourceByVariantId } = getPartnerCatalogDataset();
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
    breadcrumb: {
      rootName: detailSource.product.routeContext.rootName,
      rootSlug: detailSource.product.routeContext.rootSlug,
      childName: detailSource.product.routeContext.childName,
      childSlug: detailSource.product.routeContext.childSlug,
    },
  };
});
