export type CatalogProductsLandingPortrait = {
  src: string;
  alt: string;
};

export type CatalogProductsLandingArticle = {
  id: string;
  title: string;
  href: string;
  variant?: "article" | "all-articles";
  image: {
    src: string;
    alt: string;
  };
};

export type CatalogProductsLandingSubcategory = {
  id: string;
  title: string;
  href: string;
  productCount: number;
};

export type CatalogProductsLandingCategory = {
  id: string;
  title: string;
  href: string;
  productCount: number;
  iconId?: string;
  subcategories: CatalogProductsLandingSubcategory[];
};

export type CatalogProductsLandingSearchProduct = {
  id: string;
  article: string;
  normalizedArticle: string;
  title: string;
  normalizedTitle: string;
  href: string;
  categoryTitle: string;
};

export type CatalogProductsLandingData = {
  portraits: CatalogProductsLandingPortrait[];
  categoriesHeading: string;
  articles: CatalogProductsLandingArticle[];
  categories: CatalogProductsLandingCategory[];
  searchProducts: CatalogProductsLandingSearchProduct[];
};
