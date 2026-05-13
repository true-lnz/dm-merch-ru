import path from "node:path";

import { getPayload } from "payload";

import { CATEGORY_CATALOG_DATA, MAIN_CATALOG_DATA } from "../src/views/catalog/model/catalog-data.ts";

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

type CatalogSourceImage = {
  src: string;
  alt: string;
  fit?: "cover" | "contain";
  x?: number;
  y?: number;
};

type CatalogSourceProduct = {
  title: string;
  description: string;
  imageUrl: string;
  ctaHref?: string;
};

type CatalogSourceCase = {
  id: string;
  company: string;
  description: string;
  result: string;
  images: CatalogSourceImage[];
};

type CatalogSourcePage = {
  heroTitle: string;
  heroImage: CatalogSourceImage;
  products: CatalogSourceProduct[];
  cases: CatalogSourceCase[];
  casesVariant?: "default" | "stacked";
};

type CatalogPageSeed = {
  slug: string;
  title: string;
  source: CatalogSourcePage;
};

const PAGE_SEEDS: CatalogPageSeed[] = [
  { slug: "futbolki", title: "Футболки", source: CATEGORY_CATALOG_DATA.futbolki },
  { slug: "tolstovki", title: "Толстовки", source: CATEGORY_CATALOG_DATA.tolstovki },
  { slug: "verhnyaya-odezhda", title: "Верхняя одежда", source: CATEGORY_CATALOG_DATA["verhnyaya-odezhda"] },
  { slug: "headwear", title: "Головные уборы", source: CATEGORY_CATALOG_DATA.headwear },
  { slug: "bags", title: "Сумки и рюкзаки", source: CATEGORY_CATALOG_DATA.bags },
  { slug: "souvenirs", title: "Сувенирная продукция", source: CATEGORY_CATALOG_DATA.souvenirs },
  { slug: "custom-souvenirs", title: "Авторская сувенирная продукция", source: CATEGORY_CATALOG_DATA["custom-souvenirs"] },
  { slug: "business-accessories", title: "Деловые аксессуары", source: CATEGORY_CATALOG_DATA["business-accessories"] },
  { slug: "sportswear", title: "Спортивная одежда", source: CATEGORY_CATALOG_DATA.sportswear },
  { slug: "trousers", title: "Брюки", source: CATEGORY_CATALOG_DATA.trousers },
];

function toPublicFilePath(url: string) {
  return path.resolve(process.cwd(), "public", url.replace(/^\//, ""));
}

async function findExistingDoc(
  payload: PayloadInstance,
  collection: "media" | "catalog-categories" | "catalog-category-pages",
  field: string,
  value: string,
) {
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

async function ensureMedia(payload: PayloadInstance, image: CatalogSourceImage) {
  const filename = path.basename(image.src);
  const existing = await findExistingDoc(payload, "media", "filename", filename);

  if (existing?.id) {
    return existing.id;
  }

  const created = await payload.create({
    collection: "media",
    data: {
      alt: image.alt,
    },
    filePath: toPublicFilePath(image.src),
    overrideAccess: true,
  });

  return created.id;
}

async function buildSubcategories(payload: PayloadInstance, products: CatalogSourceProduct[]) {
  return Promise.all(
    products.map(async (product) => ({
      title: product.title,
      description: product.description,
      image: await ensureMedia(payload, {
        src: product.imageUrl,
        alt: product.title,
      }),
      buttonLabel: product.ctaHref ? "Перейти в каталог" : "Отправить заявку",
      useCustomLink: Boolean(product.ctaHref),
      customLink: product.ctaHref,
    })),
  );
}

async function buildCases(payload: PayloadInstance, cases: CatalogSourceCase[]) {
  return Promise.all(
    cases.map(async (item) => ({
      company: item.company,
      description: item.description,
      result: item.result,
      images: await Promise.all(
        item.images.map(async (image) => ({
          image: await ensureMedia(payload, image),
          fit: image.fit,
          x: image.x,
          y: image.y,
        })),
      ),
    })),
  );
}

async function upsertCatalogCategories(payload: PayloadInstance) {
  const rootCategoryExisting = await findExistingDoc(payload, "catalog-categories", "slug", "catalog");
  const rootCategoryData = {
    title: "Весь каталог",
    slug: "catalog",
    menuOrder: 1,
    isActive: true,
  };

  if (rootCategoryExisting?.id) {
    await payload.update({
      collection: "catalog-categories",
      id: rootCategoryExisting.id,
      data: {
        title: rootCategoryData.title,
        slug: rootCategoryData.slug,
      },
      overrideAccess: true,
    });
  } else {
    await payload.create({
      collection: "catalog-categories",
      data: rootCategoryData,
      overrideAccess: true,
    });
  }

  for (const [index, seed] of PAGE_SEEDS.entries()) {
    const existing = await findExistingDoc(payload, "catalog-categories", "slug", seed.slug);
    const data = {
      title: seed.title,
      slug: seed.slug,
      menuOrder: index + 2,
      isActive: true,
    };

    if (existing?.id) {
      await payload.update({
        collection: "catalog-categories",
        id: existing.id,
        data: {
          title: data.title,
          slug: data.slug,
        },
        overrideAccess: true,
      });
      continue;
    }

    await payload.create({
      collection: "catalog-categories",
      data,
      overrideAccess: true,
    });
  }
}

async function upsertCatalogCategoryPages(payload: PayloadInstance) {
  const rootCategory = await findExistingDoc(payload, "catalog-categories", "slug", "catalog");

  if (!rootCategory?.id) {
    throw new Error("Не найдена служебная категория каталога для страницы: catalog");
  }

  const rootPageExisting = await findExistingDoc(payload, "catalog-category-pages", "slug", "catalog");
  const rootPageData = {
    category: rootCategory.id,
    slug: "catalog",
    heroTitle: MAIN_CATALOG_DATA.heroTitle,
    heroImage: await ensureMedia(payload, MAIN_CATALOG_DATA.heroImage),
    casesLayout: MAIN_CATALOG_DATA.casesVariant || "default",
    subcategories: await buildSubcategories(payload, MAIN_CATALOG_DATA.products),
    cases: await buildCases(payload, MAIN_CATALOG_DATA.cases),
    meta: {
      title: "Весь каталог",
      canonicalUrl: "/catalog",
    },
  };

  if (rootPageExisting?.id) {
    await payload.update({
      collection: "catalog-category-pages",
      id: rootPageExisting.id,
      data: rootPageData,
      overrideAccess: true,
    });
  } else {
    await payload.create({
      collection: "catalog-category-pages",
      data: rootPageData,
      overrideAccess: true,
    });
  }

  for (const seed of PAGE_SEEDS) {
    const category = await findExistingDoc(payload, "catalog-categories", "slug", seed.slug);

    if (!category?.id) {
      throw new Error(`Не найдена категория каталога для страницы: ${seed.slug}`);
    }

    const existing = await findExistingDoc(payload, "catalog-category-pages", "slug", seed.slug);
    const data = {
      category: category.id,
      slug: seed.slug,
      heroTitle: seed.source.heroTitle,
      heroImage: await ensureMedia(payload, seed.source.heroImage),
      casesLayout: seed.source.casesVariant || "default",
      subcategories: await buildSubcategories(payload, seed.source.products),
      cases: await buildCases(payload, seed.source.cases),
      meta: {
        title: seed.title,
        canonicalUrl: `/catalog/${seed.slug}`,
      },
    };

    if (existing?.id) {
      await payload.update({
        collection: "catalog-category-pages",
        id: existing.id,
        data,
        overrideAccess: true,
      });
      continue;
    }

    await payload.create({
      collection: "catalog-category-pages",
      data,
      overrideAccess: true,
    });
  }
}

async function run() {
  const config = (await import("../src/payload.config.ts")).default;
  const payload = (await getPayload({ config })) as PayloadInstance;

  try {
    await upsertCatalogCategories(payload);
    await upsertCatalogCategoryPages(payload);
    console.log("Категории и страницы каталога импортированы в Payload.");
  } finally {
    await payload.destroy();
  }
}

run().catch((error) => {
  console.error("Не удалось импортировать каталог в Payload.");
  console.error(error);
  process.exitCode = 1;
});
