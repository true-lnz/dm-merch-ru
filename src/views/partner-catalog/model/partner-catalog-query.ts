export const PARTNER_CATALOG_QUERY_CATEGORY_KEY = "category";
export const PARTNER_CATALOG_QUERY_SUBCATEGORY_KEY = "subcategory";

export type PartnerCatalogQueryParams = {
  category?: string;
  subcategory?: string;
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

type IndexedChildSection = PartnerCatalogQueryChildSection & {
  slug: string;
  rootId: string;
};

type IndexedRootSection = PartnerCatalogQueryRootSection & {
  slug: string;
  children: IndexedChildSection[];
};

type PartnerCatalogQueryIndex = {
  roots: IndexedRootSection[];
  rootById: Map<string, IndexedRootSection>;
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

    rootById.set(indexedRoot.id, indexedRoot);
    return indexedRoot;
  });

  return {
    roots,
    rootById,
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
