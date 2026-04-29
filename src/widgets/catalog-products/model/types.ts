export type CatalogProductsLandingPortrait = {
  src: string;
  alt: string;
};

export type CatalogProductsLandingArticle = {
  id: string;
  title: string;
  href: string;
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
  productCount: number;
  iconId?: string;
  subcategories: CatalogProductsLandingSubcategory[];
};

export type CatalogProductsLandingData = {
  hero: {
    title: string;
    description: string;
    backgroundImageUrl: string;
  };
  portraits: CatalogProductsLandingPortrait[];
  articles: CatalogProductsLandingArticle[];
  categories: CatalogProductsLandingCategory[];
};
