export type CaseImageFit = "cover" | "contain";

export type CaseGalleryImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  fit?: CaseImageFit;
  x?: number;
  y?: number;
};

export type CaseThemeFilter = {
  slug: string;
  label: string;
};

export type CaseItem = {
  id: string;
  company: string;
  teaser: string;
  intro: string;
  task: string;
  solution: string;
  result: string;
  themeSlug: string;
  gallery: CaseGalleryImage[];
};
