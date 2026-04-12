export type CmsImage = {
  url: string;
  alt: string;
  width: number;
  height: number;
};

export type BlogPostDto = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  image: CmsImage;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  image: CmsImage;
  href: string;
};

export type BlogArticleDto = BlogPostDto & {
  pageTitle?: string;
  seoTitle?: string | null;
  breadcrumbCurrentLabel?: string;
  heroImage?: CmsImage;
};

export type BlogArticle = BlogPost & {
  pageTitle: string;
  seoTitle: string;
  breadcrumbCurrentLabel: string;
  heroImage: CmsImage;
};
