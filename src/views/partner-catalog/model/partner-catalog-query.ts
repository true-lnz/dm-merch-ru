export const PARTNER_CATALOG_QUERY_CATEGORY_KEY = "category";
export const PARTNER_CATALOG_QUERY_SUBCATEGORY_KEY = "subcategory";
export const PARTNER_CATALOG_QUERY_PRODUCT_KEY = "product";

export type PartnerCatalogQueryParams = {
  category?: string;
  subcategory?: string;
  product?: string;
};

export type PartnerCatalogQueryChildSection = {
  id: string;
  name: string;
};

export type PartnerCatalogQueryRootSection = {
  id: string;
  name: string;
  children: PartnerCatalogQueryChildSection[];
};

export type PartnerCatalogResolvedSelection = {
  filterId: string;
  expandedRootId: string | null;
  categorySlug?: string;
  subcategorySlug?: string;
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
  childById: Map<string, IndexedChildSection>;
};

function transliterateToSlug(value: string) {
  return value.trim();
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
  const childById = new Map<string, IndexedChildSection>();
  const roots = categories.map((rootCategory) => {
    const usedChildSlugs = new Set<string>();
    const rootSlug = makeStableSlug(rootCategory.name, rootCategory.id, usedRootSlugs);
    const children = rootCategory.children.map((childCategory) => ({
      ...childCategory,
      rootId: rootCategory.id,
      slug: makeStableSlug(childCategory.name, childCategory.id, usedChildSlugs),
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
    return indexedRoot;
  });

  return {
    roots,
    rootById,
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

  if (!categorySlug || !subcategorySlug) {
    return {
      filterId: allFilterId,
      expandedRootId: null,
    };
  }

  const index = buildPartnerCatalogQueryIndex(categories);
  const activeRoot = index.roots.find((rootCategory) => rootCategory.slug === categorySlug);
  const activeChild = activeRoot?.children.find((childCategory) => childCategory.slug === subcategorySlug);

  if (!activeRoot || !activeChild) {
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
) {
  const query = getPartnerCatalogQueryForFilter(categories, filterId, allFilterId);
  const params = new URLSearchParams();

  if (query.category) {
    params.set(PARTNER_CATALOG_QUERY_CATEGORY_KEY, query.category);
  }

  if (query.subcategory) {
    params.set(PARTNER_CATALOG_QUERY_SUBCATEGORY_KEY, query.subcategory);
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
