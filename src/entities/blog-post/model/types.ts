export type CmsImage = {
  url: string;
  alt: string;
  width: number;
  height: number;
};

export type BlogPostDto = {
  id: string;
  slug: string;
  cardTitle: string;
  excerpt?: string | null;
  cardImage: CmsImage;
  heroImage: CmsImage;
};

export type BlogPost = {
  id: string;
  slug: string;
  cardTitle: string;
  excerpt?: string | null;
  cardImage: CmsImage;
  heroImage: CmsImage;
  href: string;
};

export type BlogArticleSummarySectionDto = {
  type: "summary";
  title: string;
  paragraphs: string[];
  image: CmsImage;
};

export type BlogArticleTextColumnDto = {
  title: string;
  paragraphs: string[];
};

export type BlogArticleTextColumnsSectionDto = {
  type: "text-columns";
  title?: string;
  hideColumnTitles?: boolean;
  columns: BlogArticleTextColumnDto[];
};

export type BlogArticleMiniCardDto = {
  title: string;
  text: string;
};

export type BlogArticleAccentMiniCardsSectionDto = {
  type: "accent-mini-cards";
  title: string;
  backgroundAssetUrl?: string;
  cards: BlogArticleMiniCardDto[];
};

export type BlogArticleTextMiniCardsSectionDto = {
  type: "text-mini-cards";
  title: string;
  description?: string;
  cards: BlogArticleMiniCardDto[];
  conclusion?: string;
};

export type BlogArticleMerchTypeCardDto = {
  title: string;
  excerpt: string;
  image: CmsImage;
};

export type BlogArticleMerchTypesSectionDto = {
  type: "merch-types";
  title: string;
  cards: BlogArticleMerchTypeCardDto[];
};

export type BlogArticleChecklistItemDto = {
  number: string;
  text: string;
};

export type BlogArticleChecklistSectionDto = {
  type: "checklist";
  title: string;
  backgroundAssetUrl?: string;
  items: BlogArticleChecklistItemDto[];
};

export type BlogArticleTaskGoalsSectionDto = {
  type: "task-goals";
  title: string;
  description: string;
  label: string;
  cards: BlogArticleMiniCardDto[];
  note: string;
  backgroundAssetUrl?: string;
};

export type BlogArticleTextImageSectionDto = {
  type: "text-image";
  title: string;
  paragraphs: string[];
  image: CmsImage;
  variant?: "default" | "accent";
};

export type BlogArticleNumberedMiniCardsSectionDto = {
  type: "numbered-mini-cards";
  title: string;
  items: BlogArticleChecklistItemDto[];
  note?: string;
};

export type BlogArticleSectionDto =
  | BlogArticleSummarySectionDto
  | BlogArticleTextColumnsSectionDto
  | BlogArticleAccentMiniCardsSectionDto
  | BlogArticleTextMiniCardsSectionDto
  | BlogArticleMerchTypesSectionDto
  | BlogArticleChecklistSectionDto
  | BlogArticleTaskGoalsSectionDto
  | BlogArticleTextImageSectionDto
  | BlogArticleNumberedMiniCardsSectionDto;

export type BlogArticleDto = BlogPostDto & {
  pageTitle?: string;
  seoTitle?: string | null;
  breadcrumbCurrentLabel?: string;
  sections?: BlogArticleSectionDto[];
};

export type BlogArticleSummarySection = {
  type: "summary";
  title: string;
  paragraphs: string[];
  image: CmsImage;
};

export type BlogArticleTextColumn = {
  title: string;
  paragraphs: string[];
};

export type BlogArticleTextColumnsSection = {
  type: "text-columns";
  title?: string;
  hideColumnTitles?: boolean;
  columns: BlogArticleTextColumn[];
};

export type BlogArticleMiniCard = {
  title: string;
  text: string;
};

export type BlogArticleAccentMiniCardsSection = {
  type: "accent-mini-cards";
  title: string;
  backgroundAssetUrl?: string;
  cards: BlogArticleMiniCard[];
};

export type BlogArticleTextMiniCardsSection = {
  type: "text-mini-cards";
  title: string;
  description?: string;
  cards: BlogArticleMiniCard[];
  conclusion?: string;
};

export type BlogArticleMerchTypeCard = {
  title: string;
  excerpt: string;
  image: CmsImage;
};

export type BlogArticleMerchTypesSection = {
  type: "merch-types";
  title: string;
  cards: BlogArticleMerchTypeCard[];
};

export type BlogArticleChecklistItem = {
  number: string;
  text: string;
};

export type BlogArticleChecklistSection = {
  type: "checklist";
  title: string;
  backgroundAssetUrl?: string;
  items: BlogArticleChecklistItem[];
};

export type BlogArticleTaskGoalsSection = {
  type: "task-goals";
  title: string;
  description: string;
  label: string;
  cards: BlogArticleMiniCard[];
  note: string;
  backgroundAssetUrl?: string;
};

export type BlogArticleTextImageSection = {
  type: "text-image";
  title: string;
  paragraphs: string[];
  image: CmsImage;
  variant?: "default" | "accent";
};

export type BlogArticleNumberedMiniCardsSection = {
  type: "numbered-mini-cards";
  title: string;
  items: BlogArticleChecklistItem[];
  note?: string;
};

export type BlogArticleSection =
  | BlogArticleSummarySection
  | BlogArticleTextColumnsSection
  | BlogArticleAccentMiniCardsSection
  | BlogArticleTextMiniCardsSection
  | BlogArticleMerchTypesSection
  | BlogArticleChecklistSection
  | BlogArticleTaskGoalsSection
  | BlogArticleTextImageSection
  | BlogArticleNumberedMiniCardsSection;

export type BlogArticle = BlogPost & {
  pageTitle: string;
  seoTitle: string;
  breadcrumbCurrentLabel: string;
  sections: BlogArticleSection[];
};
