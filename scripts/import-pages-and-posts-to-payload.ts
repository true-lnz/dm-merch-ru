import path from "node:path";

import { getPayload } from "payload";

import { blogArticlesMock } from "../src/entities/blog-post/model/mock.ts";
import type { BlogArticleSection, CmsImage } from "../src/entities/blog-post/model/types.ts";

const DEFAULT_CONTACTS_MAP_SETTINGS = {
  officeLatitude: 54.756355,
  officeLongitude: 56.023118,
  defaultZoom: 16,
  yandexMapsApiKey: "120f734b-f91c-4c91-ab98-3b5561794961",
} as const;

const DEFAULT_CONTACTS_HERO_IMAGE: CmsImage = {
  url: "/contacts/img_contacts_cover.webp",
  alt: "Команда в фирменном мерче",
  width: 1600,
  height: 1200,
};

type FindResult<TDoc> = {
  docs?: TDoc[];
};

type IdentifiableDocument = {
  id?: number | string;
};

type PayloadInstance = Awaited<ReturnType<typeof getPayload>> & {
  create: (args: object) => Promise<IdentifiableDocument>;
  update: (args: object) => Promise<IdentifiableDocument>;
  find: (args: object) => Promise<FindResult<IdentifiableDocument>>;
  destroy: () => Promise<void>;
};

type SingletonCollection = "home-page" | "blog-page" | "catalog-products-page" | "contacts-page" | "home-marquiz";

type PageSeed = {
  slug: "blog" | "catalog" | "catalog-products" | "cases" | "home";
  title: string;
  description?: string;
};

const pageSeeds: PageSeed[] = [
  {
    slug: "home",
    title: "Главная",
    description:
      "Производство мерча и сувенирной продукции с логотипом для бизнеса. От 50 000₽, цена 25% от рынка, 1571+ проект. Образцы перед поставкой, договор.",
  },
  {
    slug: "catalog",
    title: "Каталог",
  },
  {
    slug: "catalog-products",
    title: "Каталог продукции",
    description:
      "Посадочная страница каталога продукции: статьи, категории и подкатегории мерча и корпоративных подарков.",
  },
  {
    slug: "cases",
    title: "Кейсы",
  },
  {
    slug: "blog",
    title: "Блог",
  },
];

function toPublicFilePath(url: string): string {
  return path.resolve(process.cwd(), "public", url.replace(/^\//, ""));
}

async function findExistingDoc(payload: PayloadInstance, collection: "media" | "pages" | "posts", field: string, value: string) {
  const result = await payload.find({
    collection,
    depth: 1,
    limit: 1,
    pagination: false,
    where: {
      [field]: {
        equals: value,
      },
    },
  });

  return Array.isArray(result?.docs) ? result.docs[0] : null;
}

async function ensureMedia(payload: PayloadInstance, image: CmsImage): Promise<number | string> {
  const filename = path.basename(image.url);
  const existing = await findExistingDoc(payload, "media", "filename", filename);

  if (existing?.id) {
    return existing.id;
  }

  const created = await payload.create({
    collection: "media",
    data: {
      alt: image.alt,
    },
    filePath: toPublicFilePath(image.url),
    overrideAccess: true,
  });

  return created.id;
}

async function mapSection(payload: PayloadInstance, section: BlogArticleSection) {
  switch (section.type) {
    case "text-columns":
      return {
        blockType: "text-columns",
        title: section.title,
        hideColumnTitles: section.hideColumnTitles,
        columns: section.columns.map((column) => ({
          title: column.title,
          paragraphs: column.paragraphs.map((text) => ({ text })),
        })),
      };
    case "accent-mini-cards":
      return {
        blockType: "accent-mini-cards",
        title: section.title,
        backgroundAssetUrl: section.backgroundAssetUrl,
        cards: section.cards,
      };
    case "text-mini-cards":
      return {
        blockType: "text-mini-cards",
        title: section.title,
        description: section.description,
        descriptionLayout: section.descriptionLayout,
        cards: section.cards,
        conclusion: section.conclusion,
      };
    case "merch-types":
      return {
        blockType: "merch-types",
        title: section.title,
        cards: await Promise.all(
          section.cards.map(async (card) => ({
            title: card.title,
            excerpt: card.excerpt,
            image: await ensureMedia(payload, card.image),
          })),
        ),
      };
    case "checklist":
      return {
        blockType: "checklist",
        title: section.title,
        backgroundAssetUrl: section.backgroundAssetUrl,
        items: section.items,
      };
    case "task-goals":
      return {
        blockType: "task-goals",
        title: section.title,
        description: section.description,
        label: section.label,
        cards: section.cards,
        note: section.note,
        columns: section.columns ? String(section.columns) : undefined,
      };
    case "text-image":
      return {
        blockType: "text-image",
        title: section.title,
        paragraphs: section.paragraphs.map((paragraph) =>
          typeof paragraph === "string"
            ? {
                text: paragraph,
                variant: "default",
              }
            : paragraph,
        ),
        image: await ensureMedia(payload, section.image),
        variant: section.variant,
      };
    case "numbered-mini-cards":
      return {
        blockType: "numbered-mini-cards",
        title: section.title,
        description: section.description,
        descriptionLayout: section.descriptionLayout,
        descriptionPlacement: section.descriptionPlacement,
        variant: section.variant,
        items: section.items,
        note: section.note,
      };
    case "budget-optimization":
      return {
        blockType: "budget-optimization",
        title: section.title,
        description: section.description,
        items: section.items,
        image: await ensureMedia(payload, section.image),
      };
    case "text-columns-image":
      return {
        blockType: "text-columns-image",
        columns: section.columns.map((column) => ({
          title: column.title,
          paragraphs: column.paragraphs.map((text) => ({ text })),
        })),
        image: await ensureMedia(payload, section.image),
      };
    case "text-split":
      return {
        blockType: "text-split",
        title: section.title,
        leftParagraphs: section.leftParagraphs.map((text) => ({ text })),
        rightParagraphs: section.rightParagraphs.map((text) => ({ text })),
      };
    case "summary":
      return {
        blockType: "summary",
        title: section.title,
        paragraphs: section.paragraphs.map((text) => ({ text })),
        image: await ensureMedia(payload, section.image),
      };
  }
}

async function upsertPages(payload: PayloadInstance) {
  for (const page of pageSeeds) {
    const existing = await findExistingDoc(payload, "pages", "slug", page.slug);
    const data = {
      title: page.title,
      slug: page.slug,
      _status: "published",
      meta: {
        title: page.title,
        description: page.description,
      },
    };

    if (existing?.id) {
      await payload.update({
        collection: "pages",
        id: existing.id,
        data,
        overrideAccess: true,
      });
      continue;
    }

    await payload.create({
      collection: "pages",
      data,
      overrideAccess: true,
    });
  }
}

async function upsertSingletonPage(
  payload: PayloadInstance,
  collection: SingletonCollection,
  data: Record<string, unknown>,
) {
  const result = await payload.find({
    collection,
    depth: 0,
    limit: 1,
    pagination: false,
    overrideAccess: true,
  });
  const existing = Array.isArray(result?.docs) ? result.docs[0] : null;

  if (existing?.id) {
    await payload.update({
      collection,
      id: existing.id,
      data,
      overrideAccess: true,
    });
    return;
  }

  await payload.create({
    collection,
    data,
    overrideAccess: true,
  });
}

async function upsertSingletonPages(payload: PayloadInstance) {
  await upsertSingletonPage(payload, "home-page", {
    heroTitle: "Главная",
    meta: {
      title: "Главная",
      description: "Производство мерча и сувенирной продукции с логотипом для бизнеса. От 50 000₽, цена 25% от рынка, 1571+ проект. Образцы перед поставкой, договор.",
    },
  });

  await upsertSingletonPage(payload, "blog-page", {
    heroTitle: "Блог",
    meta: {
      title: "Блог",
    },
  });

  await upsertSingletonPage(payload, "catalog-products-page", {
    heroTitle: "Каталог продукции",
    meta: {
      title: "Каталог продукции",
      description: "Посадочная страница каталога продукции: статьи, категории и подкатегории мерча и корпоративных подарков.",
    },
    hero: {
      title: "Каталог\nпродукции",
      description: "Собрали в одном входе категории, статьи и реальные разделы каталога, чтобы ориентироваться в мерче было проще и быстрее.",
      backgroundImageUrl: "/catalog-products/img_hero_catalog_cover.svg",
    },
  });

  await upsertSingletonPage(payload, "contacts-page", {
    heroTitle: "Контакты",
    heroImage: await ensureMedia(payload, DEFAULT_CONTACTS_HERO_IMAGE),
    ...DEFAULT_CONTACTS_MAP_SETTINGS,
    meta: {
      title: "Контакты",
    },
  });

  await upsertSingletonPage(payload, "home-marquiz", {});
}

async function upsertPosts(payload: PayloadInstance) {
  for (const article of blogArticlesMock) {
    const existing = await findExistingDoc(payload, "posts", "slug", article.slug);
    const data = {
      title: article.cardTitle,
      slug: article.slug,
      _status: "published",
      pageTitle: article.pageTitle,
      excerpt: article.excerpt,
      breadcrumbCurrentLabel: article.breadcrumbCurrentLabel,
      cardImage: await ensureMedia(payload, article.cardImage),
      heroImage: await ensureMedia(payload, article.heroImage),
      layout: await Promise.all(article.sections.map((section) => mapSection(payload, section))),
      meta: {
        title: article.seoTitle,
        description: article.excerpt || undefined,
      },
      publishedAt: new Date().toISOString(),
    };

    if (existing?.id) {
      await payload.update({
        collection: "posts",
        id: existing.id,
        data,
        overrideAccess: true,
      });
      continue;
    }

    await payload.create({
      collection: "posts",
      data,
      overrideAccess: true,
    });
  }
}

async function main() {
  process.env.PAYLOAD_PUSH_SCHEMA = "false";

  const { default: config } = await import("../src/payload.config.ts");
  const payload = (await getPayload({ config })) as PayloadInstance;

  try {
    await upsertPages(payload);
    await upsertSingletonPages(payload);
    await upsertPosts(payload);
  } finally {
    await payload.destroy();
  }
}

await main();
