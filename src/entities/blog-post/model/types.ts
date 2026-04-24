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
  descriptionLayout?: "two-columns" | "three-columns-middle";
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
  label?: string;
  cards: BlogArticleMiniCardDto[];
  note?: string;
  columns?: 2 | 3;
  backgroundAssetUrl?: string;
};

export type BlogArticleParagraphDto =
  | string
  | {
      text: string;
      variant?: "default" | "highlighted";
    };

export type BlogArticleTextImageSectionDto = {
  type: "text-image";
  title: string;
  paragraphs: BlogArticleParagraphDto[];
  image: CmsImage;
  variant?: "default" | "accent";
  imageAspectRatio?: string;
};

export type BlogArticleNumberedMiniCardsSectionDto = {
  type: "numbered-mini-cards";
  title: string;
  description?: string;
  descriptionLayout?: "two-columns" | "three-columns-middle";
  descriptionPlacement?: "side" | "bottom";
  variant?: "accent" | "light";
  items: BlogArticleChecklistItemDto[];
  note?: string;
};

export type BlogArticleBudgetOptimizationSectionDto = {
  type: "budget-optimization";
  title: string;
  description: string;
  items: BlogArticleChecklistItemDto[];
  image: CmsImage;
};

export type BlogArticleTextColumnsImageSectionDto = {
  type: "text-columns-image";
  columns: BlogArticleTextColumnDto[];
  image: CmsImage;
  imageAspectRatio?: string;
};

export type BlogArticleTextSplitSectionDto = {
  type: "text-split";
  title: string;
  leftParagraphs: string[];
  rightParagraphs: string[];
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
  | BlogArticleNumberedMiniCardsSectionDto
  | BlogArticleBudgetOptimizationSectionDto
  | BlogArticleTextColumnsImageSectionDto
  | BlogArticleTextSplitSectionDto;

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
  descriptionLayout?: "two-columns" | "three-columns-middle";
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
  label?: string;
  cards: BlogArticleMiniCard[];
  note?: string;
  columns?: 2 | 3;
  backgroundAssetUrl?: string;
};

export type BlogArticleParagraph =
  | string
  | {
      text: string;
      variant?: "default" | "highlighted";
    };

export type BlogArticleTextImageSection = {
  type: "text-image";
  title: string;
  paragraphs: BlogArticleParagraph[];
  image: CmsImage;
  variant?: "default" | "accent";
  imageAspectRatio?: string;
};

export type BlogArticleNumberedMiniCardsSection = {
  type: "numbered-mini-cards";
  title: string;
  description?: string;
  descriptionLayout?: "two-columns" | "three-columns-middle";
  descriptionPlacement?: "side" | "bottom";
  variant?: "accent" | "light";
  items: BlogArticleChecklistItem[];
  note?: string;
};

export type BlogArticleBudgetOptimizationSection = {
  type: "budget-optimization";
  title: string;
  description: string;
  items: BlogArticleChecklistItem[];
  image: CmsImage;
};

export type BlogArticleTextColumnsImageSection = {
  type: "text-columns-image";
  columns: BlogArticleTextColumn[];
  image: CmsImage;
  imageAspectRatio?: string;
};

export type BlogArticleTextSplitSection = {
  type: "text-split";
  title: string;
  leftParagraphs: string[];
  rightParagraphs: string[];
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
  | BlogArticleNumberedMiniCardsSection
  | BlogArticleBudgetOptimizationSection
  | BlogArticleTextColumnsImageSection
  | BlogArticleTextSplitSection;

export type BlogArticle = BlogPost & {
  pageTitle: string;
  seoTitle: string;
  breadcrumbCurrentLabel: string;
  sections: BlogArticleSection[];
};
