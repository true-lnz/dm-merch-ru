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
  excerpt: string;
  category: string;
  image: CmsImage;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  image: CmsImage;
  href: string;
};
