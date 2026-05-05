export const PARTNER_CATALOG_QUERY_CATEGORY_KEY = "category";
export const PARTNER_CATALOG_QUERY_SUBCATEGORY_KEY = "subcategory";
export const PARTNER_CATALOG_QUERY_PRODUCT_KEY = "product";
export const PARTNER_CATALOG_QUERY_PRICE_FROM_KEY = "priceFrom";
export const PARTNER_CATALOG_QUERY_PRICE_TO_KEY = "priceTo";
export const PARTNER_CATALOG_QUERY_STOCK_FROM_KEY = "stockFrom";
export const PARTNER_CATALOG_QUERY_SORT_KEY = "sort";
export const PARTNER_CATALOG_DEFAULT_SORT = "price-asc";

export type PartnerCatalogQueryParams = {
  category?: string;
  subcategory?: string;
  product?: string;
  priceFrom?: string;
  priceTo?: string;
  stockFrom?: string;
  sort?: string;
};

export type PartnerCatalogFilters = {
  priceFrom?: number;
  priceTo?: number;
  stockFrom?: number;
};

export type PartnerCatalogFilterInputValues = {
  priceFrom: string;
  priceTo: string;
  stockFrom: string;
};

export type PartnerCatalogSortKey = "price-asc" | "price-desc" | "stock-asc" | "stock-desc";

export type PartnerCatalogQueryChildSection = {
  id: string;
  name: string;
  sourceName?: string;
};

export type PartnerCatalogQueryRootSection = {
  id: string;
  name: string;
  sourceName?: string;
  children: PartnerCatalogQueryChildSection[];
};

export type PartnerCatalogResolvedSelection = {
  filterId: string;
  expandedRootId: string | null;
  categorySlug?: string;
  subcategorySlug?: string;
};

export type PartnerCatalogBreadcrumbData = {
  items: {
    label: string;
    href: string;
  }[];
  currentLabel: string;
};

export type PartnerCatalogResolvedSection = {
  rootId: string;
  rootName: string;
  rootSlug: string;
  childId: string;
  childName: string;
  childSlug: string;
};

type IndexedChildSection = PartnerCatalogQueryChildSection & {
  slug: string;
  rootId: string;
};

type IndexedRootSection = Omit<PartnerCatalogQueryRootSection, "children"> & {
  slug: string;
  children: IndexedChildSection[];
};

type PartnerCatalogQueryIndex = {
  roots: IndexedRootSection[];
  rootById: Map<string, IndexedRootSection>;
  rootBySlug: Map<string, IndexedRootSection>;
  childById: Map<string, IndexedChildSection>;
};

function transliterateToSlug(value: string) {
  return value.trim();
}

function parseNonNegativeNumber(value: string | undefined, integer = false) {
  if (!value) {
    return undefined;
  }

  const normalizedValue = value.trim().replace(",", ".");

  if (!normalizedValue) {
    return undefined;
  }

  const parsedValue = Number.parseFloat(normalizedValue);

  if (!Number.isFinite(parsedValue) || parsedValue < 0) {
    return undefined;
  }

  return integer ? Math.floor(parsedValue) : parsedValue;
}

function formatFilterInputValue(value: number | undefined) {
  return value === undefined ? "" : String(value);
}

export function normalizePartnerCatalogFilters(
  query: Pick<PartnerCatalogQueryParams, "priceFrom" | "priceTo" | "stockFrom">,
): PartnerCatalogFilters {
  let priceFrom = parseNonNegativeNumber(query.priceFrom);
  let priceTo = parseNonNegativeNumber(query.priceTo);
  const stockFrom = parseNonNegativeNumber(query.stockFrom, true);

  if (priceFrom !== undefined && priceTo !== undefined && priceFrom > priceTo) {
    [priceFrom, priceTo] = [priceTo, priceFrom];
  }

  return {
    priceFrom,
    priceTo,
    stockFrom,
  };
}

export function getPartnerCatalogFilterInputValues(filters: PartnerCatalogFilters): PartnerCatalogFilterInputValues {
  return {
    priceFrom: formatFilterInputValue(filters.priceFrom),
    priceTo: formatFilterInputValue(filters.priceTo),
    stockFrom: formatFilterInputValue(filters.stockFrom),
  };
}

export function hasActivePartnerCatalogFilters(filters: PartnerCatalogFilters) {
  return filters.priceFrom !== undefined || filters.priceTo !== undefined || filters.stockFrom !== undefined;
}

export function normalizePartnerCatalogSort(sort: string | undefined): PartnerCatalogSortKey {
  switch (sort) {
    case "price-desc":
    case "stock-asc":
    case "stock-desc":
    case "price-asc":
      return sort;
    default:
      return PARTNER_CATALOG_DEFAULT_SORT;
  }
}

function makeStableSlug(name: string, id: string, usedSlugs: Set<string>) {
  const baseSlug = transliterateToSlug(name) || "category";

  if (!usedSlugs.has(baseSlug)) {
    usedSlugs.add(baseSlug);
    return baseSlug;
  }

  const fallbackSlug = `${baseSlug}-${id.replace(/^0+/, "") || id}`;
  usedSlugs.add(fallbackSlug);
  return fallbackSlug;
}

export function buildPartnerCatalogQueryIndex(categories: PartnerCatalogQueryRootSection[]): PartnerCatalogQueryIndex {
  const usedRootSlugs = new Set<string>();
  const rootById = new Map<string, IndexedRootSection>();
  const rootBySlug = new Map<string, IndexedRootSection>();
  const childById = new Map<string, IndexedChildSection>();
  const roots = categories.map((rootCategory) => {
    const usedChildSlugs = new Set<string>();
    const rootSlug = makeStableSlug(rootCategory.sourceName ?? rootCategory.name, rootCategory.id, usedRootSlugs);
    const children = rootCategory.children.map((childCategory) => ({
      ...childCategory,
      rootId: rootCategory.id,
      slug: makeStableSlug(childCategory.sourceName ?? childCategory.name, childCategory.id, usedChildSlugs),
    }));
    const indexedRoot = {
      ...rootCategory,
      slug: rootSlug,
      children,
    };

    for (const childCategory of children) {
      childById.set(childCategory.id, childCategory);
    }

    rootById.set(indexedRoot.id, indexedRoot);
    rootBySlug.set(indexedRoot.slug, indexedRoot);
    return indexedRoot;
  });

  return {
    roots,
    rootById,
    rootBySlug,
    childById,
  };
}

export function getPartnerCatalogSectionContext(categories: PartnerCatalogQueryRootSection[], childSectionId: string): PartnerCatalogResolvedSection | null {
  const index = buildPartnerCatalogQueryIndex(categories);
  const childCategory = index.childById.get(childSectionId);

  if (!childCategory) {
    return null;
  }

  const rootCategory = index.rootById.get(childCategory.rootId);

  if (!rootCategory) {
    return null;
  }

  return {
    rootId: rootCategory.id,
    rootName: rootCategory.name,
    rootSlug: rootCategory.slug,
    childId: childCategory.id,
    childName: childCategory.name,
    childSlug: childCategory.slug,
  };
}

export function resolvePartnerCatalogSelection(
  categories: PartnerCatalogQueryRootSection[],
  query: PartnerCatalogQueryParams,
  allFilterId: string,
): PartnerCatalogResolvedSelection {
  const categorySlug = query.category?.trim();
  const subcategorySlug = query.subcategory?.trim();

  if (!categorySlug) {
    return {
      filterId: allFilterId,
      expandedRootId: null,
    };
  }

  const index = buildPartnerCatalogQueryIndex(categories);
  const activeRoot = index.rootBySlug.get(categorySlug);

  if (!activeRoot) {
    return {
      filterId: allFilterId,
      expandedRootId: null,
    };
  }

  if (!subcategorySlug) {
    return {
      filterId: activeRoot.id,
      expandedRootId: activeRoot.id,
      categorySlug: activeRoot.slug,
    };
  }

  const activeChild = activeRoot.children.find((childCategory) => childCategory.slug === subcategorySlug);

  if (!activeChild) {
    return {
      filterId: allFilterId,
      expandedRootId: null,
    };
  }

  return {
    filterId: activeChild.id,
    expandedRootId: activeRoot.id,
    categorySlug: activeRoot.slug,
    subcategorySlug: activeChild.slug,
  };
}

export function getPartnerCatalogQueryForFilter(
  categories: PartnerCatalogQueryRootSection[],
  filterId: string,
  allFilterId: string,
): PartnerCatalogQueryParams {
  if (filterId === allFilterId) {
    return {};
  }

  const index = buildPartnerCatalogQueryIndex(categories);

  const activeRoot = index.rootById.get(filterId);

  if (activeRoot) {
    return {
      category: activeRoot.slug,
    };
  }

  for (const rootCategory of index.roots) {
    const activeChild = rootCategory.children.find((childCategory) => childCategory.id === filterId);

    if (activeChild) {
      return {
        category: rootCategory.slug,
        subcategory: activeChild.slug,
      };
    }
  }

  return {};
}

export function getPartnerCatalogPathForFilter(
  categories: PartnerCatalogQueryRootSection[],
  filterId: string,
  allFilterId: string,
  pathname = "/partner-catalog",
  filters: Partial<Pick<PartnerCatalogQueryParams, "priceFrom" | "priceTo" | "stockFrom">> = {},
  sort: string = PARTNER_CATALOG_DEFAULT_SORT,
) {
  const query = getPartnerCatalogQueryForFilter(categories, filterId, allFilterId);
  const params = new URLSearchParams();

  if (query.category) {
    params.set(PARTNER_CATALOG_QUERY_CATEGORY_KEY, query.category);
  }

  if (query.subcategory) {
    params.set(PARTNER_CATALOG_QUERY_SUBCATEGORY_KEY, query.subcategory);
  }

  const priceFrom = filters.priceFrom?.trim();
  const priceTo = filters.priceTo?.trim();
  const stockFrom = filters.stockFrom?.trim();

  if (priceFrom) {
    params.set(PARTNER_CATALOG_QUERY_PRICE_FROM_KEY, priceFrom);
  }

  if (priceTo) {
    params.set(PARTNER_CATALOG_QUERY_PRICE_TO_KEY, priceTo);
  }

  if (stockFrom) {
    params.set(PARTNER_CATALOG_QUERY_STOCK_FROM_KEY, stockFrom);
  }

  const normalizedSort = normalizePartnerCatalogSort(sort);

  if (normalizedSort !== PARTNER_CATALOG_DEFAULT_SORT) {
    params.set(PARTNER_CATALOG_QUERY_SORT_KEY, normalizedSort);
  }

  const queryString = params.toString();

  return queryString ? `${pathname}?${queryString}` : pathname;
}

export function getPartnerCatalogProductPath(
  categories: PartnerCatalogQueryRootSection[],
  childSectionId: string,
  productId: string,
  pathnameBase = "/partner-catalog",
) {
  const sectionContext = getPartnerCatalogSectionContext(categories, childSectionId);

  if (!sectionContext) {
    return pathnameBase;
  }

  const params = new URLSearchParams({
    [PARTNER_CATALOG_QUERY_CATEGORY_KEY]: sectionContext.rootSlug,
    [PARTNER_CATALOG_QUERY_SUBCATEGORY_KEY]: sectionContext.childSlug,
    [PARTNER_CATALOG_QUERY_PRODUCT_KEY]: productId,
  });

  return `${pathnameBase}?${params.toString()}`;
}

function getPartnerCatalogBreadcrumbBaseItems() {
  return [
    { label: "Главная", href: "/" },
    { label: "Каталог продукции", href: "/catalog-products" },
  ];
}

export function getPartnerCatalogListingBreadcrumb(
  categories: PartnerCatalogQueryRootSection[],
  filterId: string,
  allFilterId: string,
): PartnerCatalogBreadcrumbData {
  const baseItems = getPartnerCatalogBreadcrumbBaseItems();

  if (filterId === allFilterId) {
    return {
      items: baseItems,
      currentLabel: "Все товары",
    };
  }

  const index = buildPartnerCatalogQueryIndex(categories);
  const activeRoot = index.rootById.get(filterId);

  if (activeRoot) {
    return {
      items: baseItems,
      currentLabel: activeRoot.name,
    };
  }

  const activeChild = index.childById.get(filterId);

  if (!activeChild) {
    return {
      items: baseItems,
      currentLabel: "Все товары",
    };
  }

  const rootCategory = index.rootById.get(activeChild.rootId);

  if (!rootCategory) {
    return {
      items: baseItems,
      currentLabel: "Все товары",
    };
  }

  return {
    items: [
      ...baseItems,
      {
        label: rootCategory.name,
        href: getPartnerCatalogPathForFilter(categories, rootCategory.id, allFilterId),
      },
    ],
    currentLabel: activeChild.name,
  };
}

export function getPartnerCatalogProductBreadcrumb(
  categories: PartnerCatalogQueryRootSection[],
  childSectionId: string,
  productTitle: string,
  allFilterId: string,
): PartnerCatalogBreadcrumbData | null {
  const sectionContext = getPartnerCatalogSectionContext(categories, childSectionId);

  if (!sectionContext) {
    return null;
  }

  return {
    items: [
      ...getPartnerCatalogBreadcrumbBaseItems(),
      {
        label: sectionContext.rootName,
        href: getPartnerCatalogPathForFilter(categories, sectionContext.rootId, allFilterId),
      },
      {
        label: sectionContext.childName,
        href: getPartnerCatalogPathForFilter(categories, sectionContext.childId, allFilterId),
      },
    ],
    currentLabel: productTitle,
  };
}
