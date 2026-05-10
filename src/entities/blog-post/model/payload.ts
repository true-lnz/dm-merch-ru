import "server-only";

import { getPayloadClient } from "@/shared/lib/payload/get-payload-client";
import { mapCmsImage } from "@/shared/lib/payload/media";
import { isDraftModeEnabled } from "@/shared/lib/payload/page-docs";

import { blogArticlesMock, blogPostsMock } from "./mock";
import type { BlogArticle, BlogArticleChecklistItem, BlogArticleMiniCard, BlogArticleParagraph, BlogArticleSection, BlogPost } from "./types";

type TextRow = {
  text?: null | string;
};

type ParagraphRow = TextRow & {
  variant?: null | "default" | "highlighted";
};

type PayloadFindResult<TDoc> = {
  docs?: TDoc[];
};

type PayloadPostDocument = Record<string, unknown> & {
  breadcrumbCurrentLabel?: string;
  cardImage?: unknown;
  excerpt?: string;
  heroImage?: unknown;
  id?: number | string;
  layout?: unknown[];
  meta?: {
    canonicalUrl?: string;
    description?: string;
    image?: unknown;
    keywords?: string;
    openGraph?: {
      description?: string;
      imageAlt?: string;
      title?: string;
      type?: "article" | "website";
    };
    robots?: {
      noFollow?: boolean;
      noIndex?: boolean;
    };
    title?: string;
    twitter?: {
      card?: "summary" | "summary_large_image";
      description?: string;
      imageAlt?: string;
      title?: string;
    };
  };
  pageTitle?: string;
  sortOrder?: number;
  slug?: string;
  title?: string;
};

type PostsPayloadClient = {
  find: (args: {
    collection: "posts";
    depth: number;
    draft?: boolean;
    limit: number;
    overrideAccess?: boolean;
    pagination: boolean;
    sort?: string;
    where?: Record<string, unknown>;
  }) => Promise<PayloadFindResult<PayloadPostDocument>>;
};

function getString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function getEnumValue<TValue extends string>(value: unknown, values: readonly TValue[]): TValue | undefined {
  return typeof value === "string" && values.includes(value as TValue) ? (value as TValue) : undefined;
}

function getNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function mapTextRows(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => (typeof item === "object" && item !== null && typeof (item as TextRow).text === "string" ? (item as TextRow).text : null))
    .filter((item): item is string => Boolean(item));
}

function mapParagraphRows(value: unknown): BlogArticleParagraph[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item): BlogArticleParagraph | null => {
      if (typeof item !== "object" || item === null || typeof (item as ParagraphRow).text !== "string") {
        return null;
      }

      if ((item as ParagraphRow).variant === "highlighted") {
        return {
          text: (item as ParagraphRow).text!,
          variant: "highlighted",
        };
      }

      return (item as ParagraphRow).text!;
    })
    .filter((item): item is BlogArticleParagraph => item !== null);
}

function mapMiniCards(value: unknown): BlogArticleMiniCard[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item): BlogArticleMiniCard | null => {
      if (typeof item !== "object" || item === null || typeof item.title !== "string" || typeof item.text !== "string") {
        return null;
      }

      return {
        title: item.title,
        text: item.text,
      };
    })
    .filter((item): item is BlogArticleMiniCard => item !== null);
}

function mapChecklistItems(value: unknown): BlogArticleChecklistItem[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item): BlogArticleChecklistItem | null => {
      if (typeof item !== "object" || item === null || typeof item.number !== "string" || typeof item.text !== "string") {
        return null;
      }

      return {
        number: item.number,
        text: item.text,
      };
    })
    .filter((item): item is BlogArticleChecklistItem => item !== null);
}

function mapColumns(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item !== "object" || item === null) {
        return null;
      }

      const paragraphs = mapTextRows(item.paragraphs);

      if (paragraphs.length === 0) {
        return null;
      }

      return {
        title: typeof item.title === "string" ? item.title : "",
        paragraphs,
      };
    })
    .filter((item): item is { title: string; paragraphs: string[] } => item !== null);
}

function mapLayoutBlock(block: Record<string, unknown>): BlogArticleSection | null {
  if (!block || typeof block !== "object" || typeof block.blockType !== "string") {
    return null;
  }

  switch (block.blockType) {
    case "text-columns":
      return {
        type: "text-columns",
        title: typeof block.title === "string" ? block.title : undefined,
        hideColumnTitles: Boolean(block.hideColumnTitles),
        columns: mapColumns(block.columns),
      };
    case "accent-mini-cards":
      return {
        type: "accent-mini-cards",
        title: getString(block.title) || "",
        backgroundAssetUrl: getString(block.backgroundAssetUrl),
        cards: mapMiniCards(block.cards),
      };
    case "text-mini-cards":
      return {
        type: "text-mini-cards",
        title: getString(block.title) || "",
        description: getString(block.description),
        descriptionLayout: getEnumValue(block.descriptionLayout, ["two-columns", "three-columns-middle"] as const),
        cards: mapMiniCards(block.cards),
        conclusion: getString(block.conclusion),
      };
    case "merch-types":
      return {
        type: "merch-types",
        title: getString(block.title) || "",
        cards: Array.isArray(block.cards)
          ? block.cards
              .map((card: unknown) => {
                const cardRecord = typeof card === "object" && card !== null ? (card as Record<string, unknown>) : null;
                const image = mapCmsImage(cardRecord?.image, typeof cardRecord?.title === "string" ? cardRecord.title : "Изображение");
                if (!image || typeof cardRecord?.title !== "string" || typeof cardRecord?.excerpt !== "string") {
                  return null;
                }
                return {
                  title: cardRecord.title,
                  excerpt: cardRecord.excerpt,
                  image,
                };
              })
              .filter(
                (
                  item: { excerpt: string; image: NonNullable<ReturnType<typeof mapCmsImage>>; title: string } | null,
                ): item is {
                  excerpt: string;
                  image: NonNullable<ReturnType<typeof mapCmsImage>>;
                  title: string;
                } => item !== null,
              )
          : [],
      };
    case "checklist":
      return {
        type: "checklist",
        title: getString(block.title) || "",
        backgroundAssetUrl: getString(block.backgroundAssetUrl),
        items: mapChecklistItems(block.items),
      };
    case "task-goals":
      return {
        type: "task-goals",
        title: getString(block.title) || "",
        description: getString(block.description) || "",
        label: getString(block.label),
        cards: mapMiniCards(block.cards),
        note: getString(block.note),
        columns: block.columns === "2" ? 2 : block.columns === "3" ? 3 : undefined,
      };
    case "text-image": {
      const image = mapCmsImage(block.image, getString(block.title) || "Изображение");
      if (!image) {
        return null;
      }

      return {
        type: "text-image",
        title: getString(block.title) || "",
        paragraphs: mapParagraphRows(block.paragraphs),
        image,
        variant: getEnumValue(block.variant, ["default", "accent"] as const),
      };
    }
    case "numbered-mini-cards":
      return {
        type: "numbered-mini-cards",
        title: getString(block.title) || "",
        description: getString(block.description),
        descriptionLayout: getEnumValue(block.descriptionLayout, ["two-columns", "three-columns-middle"] as const),
        descriptionPlacement: getEnumValue(block.descriptionPlacement, ["side", "bottom"] as const),
        variant: getEnumValue(block.variant, ["accent", "light"] as const),
        items: mapChecklistItems(block.items),
        note: getString(block.note),
      };
    case "budget-optimization": {
      const image = mapCmsImage(block.image, getString(block.title) || "Изображение");
      if (!image) {
        return null;
      }

      return {
        type: "budget-optimization",
        title: getString(block.title) || "",
        description: getString(block.description) || "",
        items: mapChecklistItems(block.items),
        image,
      };
    }
    case "text-columns-image": {
      const image = mapCmsImage(block.image, "Изображение");
      if (!image) {
        return null;
      }

      return {
        type: "text-columns-image",
        columns: mapColumns(block.columns),
        image,
      };
    }
    case "text-split":
      return {
        type: "text-split",
        title: getString(block.title) || "",
        leftParagraphs: mapTextRows(block.leftParagraphs),
        rightParagraphs: mapTextRows(block.rightParagraphs),
      };
    case "summary": {
      const image = mapCmsImage(block.image, getString(block.title) || "Изображение");
      if (!image) {
        return null;
      }

      return {
        type: "summary",
        title: getString(block.title) || "",
        paragraphs: mapTextRows(block.paragraphs),
        image,
      };
    }
    default:
      return null;
  }
}

function mapPostDocToArticle(doc: PayloadPostDocument): BlogArticle | null {
  const title = getString(doc.title);
  const slug = getString(doc.slug);
  const cardImage = mapCmsImage(doc.cardImage, title || "Карточка");
  const heroImage = mapCmsImage(doc.heroImage, title || "Обложка");

  if (!cardImage || !heroImage || !title || !slug) {
    return null;
  }

  return {
    id: String(doc.id),
    slug,
    cardTitle: title,
    pageTitle: getString(doc.pageTitle) || title,
    seoTitle: typeof doc.meta?.title === "string" && doc.meta.title ? doc.meta.title : getString(doc.pageTitle) || title,
    breadcrumbCurrentLabel: getString(doc.breadcrumbCurrentLabel) || "Статьи",
    excerpt: getString(doc.excerpt) || null,
    cardImage,
    heroImage,
    href: `/blog/${slug}`,
    meta: doc.meta
      ? {
          canonicalUrl: getString(doc.meta.canonicalUrl) || null,
          description: getString(doc.meta.description) || null,
          image: mapCmsImage(doc.meta.image, title),
          keywords: getString(doc.meta.keywords) || null,
          openGraph: doc.meta.openGraph
            ? {
                description: getString(doc.meta.openGraph.description) || null,
                imageAlt: getString(doc.meta.openGraph.imageAlt) || null,
                title: getString(doc.meta.openGraph.title) || null,
                type: getEnumValue(doc.meta.openGraph.type, ["article", "website"] as const) || null,
              }
            : null,
          robots: doc.meta.robots
            ? {
                noFollow: Boolean(doc.meta.robots.noFollow),
                noIndex: Boolean(doc.meta.robots.noIndex),
              }
            : null,
          title: getString(doc.meta.title) || null,
          twitter: doc.meta.twitter
            ? {
                card: getEnumValue(doc.meta.twitter.card, ["summary", "summary_large_image"] as const) || null,
                description: getString(doc.meta.twitter.description) || null,
                imageAlt: getString(doc.meta.twitter.imageAlt) || null,
                title: getString(doc.meta.twitter.title) || null,
              }
            : null,
        }
      : null,
    sections: Array.isArray(doc.layout)
      ? doc.layout
          .map((block) => (typeof block === "object" && block !== null ? mapLayoutBlock(block as Record<string, unknown>) : null))
          .filter((item: BlogArticleSection | null): item is BlogArticleSection => item !== null)
      : [],
  };
}

async function getPostDocs(options?: { draft?: boolean }) {
  try {
    const payload = (await getPayloadClient()) as PostsPayloadClient;
    const result = await payload.find({
      collection: "posts",
      depth: 2,
      draft: options?.draft,
      limit: 100,
      overrideAccess: options?.draft,
      pagination: false,
      where: options?.draft
        ? undefined
        : {
            _status: {
              equals: "published",
            },
          },
    });

    const docs = Array.isArray(result?.docs) ? result.docs : [];

    return docs.sort((left, right) => {
      const leftOrder = getNumber(left.sortOrder) ?? Number.MAX_SAFE_INTEGER;
      const rightOrder = getNumber(right.sortOrder) ?? Number.MAX_SAFE_INTEGER;

      if (leftOrder !== rightOrder) {
        return leftOrder - rightOrder;
      }

      return 0;
    });
  } catch {
    return [];
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const docs = await getPostDocs({
    draft: await isDraftModeEnabled(),
  });
  const posts = docs
    .map(mapPostDocToArticle)
    .filter((item: BlogArticle | null): item is BlogArticle => item !== null)
    .map(
      (article: BlogArticle): BlogPost => ({
        id: article.id,
        slug: article.slug,
        cardTitle: article.cardTitle,
        pageTitle: article.pageTitle,
        excerpt: article.excerpt,
        cardImage: article.cardImage,
        heroImage: article.heroImage,
        href: article.href,
      }),
    );

  return posts;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogArticle | undefined> {
  try {
    const isDraft = await isDraftModeEnabled();
    const payload = (await getPayloadClient()) as PostsPayloadClient;
    const result = await payload.find({
      collection: "posts",
      depth: 2,
      draft: isDraft,
      limit: 1,
      overrideAccess: isDraft,
      pagination: false,
      where: {
        slug: {
          equals: slug,
        },
        ...(isDraft
          ? {}
          : {
              _status: {
                equals: "published",
              },
            }),
      },
    });

    const doc = Array.isArray(result?.docs) ? result.docs[0] : null;
    const article = doc ? mapPostDocToArticle(doc) : null;

    return article || undefined;
  } catch {
    return blogArticlesMock.find((item) => item.slug === slug);
  }
}

export async function getBlogPostSlugs(): Promise<string[]> {
  const docs = await getPostDocs({ draft: false });
  const slugs = docs
    .map((doc: PayloadPostDocument) => (typeof doc.slug === "string" ? doc.slug : null))
    .filter((item: string | null): item is string => item !== null);

  return slugs.length > 0 ? slugs : [];
}
