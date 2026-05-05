import path from "node:path";
import fs from "node:fs";
import { createRequire } from "node:module";

import { caseThemes, casesPageItems } from "../src/views/cases/model/cases-data.ts";
import { getPayload } from "payload";

type ThemeSeed = {
  slug: string;
  title: string;
  sortOrder: number;
};

const themeSeeds: ThemeSeed[] = caseThemes
  .filter((theme) => theme !== "Все кейсы")
  .map((title, index) => ({
    title,
    slug: mapThemeToSlug(title),
    sortOrder: index,
  }));

type SQLiteStatement = {
  all: () => unknown[];
  run: (...params: unknown[]) => unknown;
};

type SQLiteDatabase = {
  close: () => void;
  prepare: (sql: string) => SQLiteStatement;
};

function mapThemeToSlug(theme: string) {
  switch (theme) {
    case "Рестораны":
      return "restaurants";
    case "Магазины":
      return "shops";
    case "Производство":
      return "manufacturing";
    case "IT сферы":
      return "it";
    case "Общественные проекты":
      return "public-projects";
    default:
      throw new Error(`Неизвестная категория кейсов: ${theme}`);
  }
}

function loadDatabaseCtor() {
  const require = createRequire(import.meta.url);
  const pnpmDir = path.resolve(process.cwd(), "node_modules", ".pnpm");
  const libsqlPackageDir = fs
    .readdirSync(pnpmDir, { withFileTypes: true })
    .find((entry) => entry.isDirectory() && entry.name.startsWith("libsql@"));

  if (!libsqlPackageDir) {
    throw new Error("Не найден пакет libsql в node_modules/.pnpm");
  }

  return require(path.join(pnpmDir, libsqlPackageDir.name, "node_modules", "libsql")) as new (filePath: string) => SQLiteDatabase;
}

function dropConflictingPayloadIndexes() {
  const Database = loadDatabaseCtor();
  const db = new Database(path.resolve(process.cwd(), "dm-merch.db"));

  try {
    const rows = db
      .prepare(`
        SELECT name
        FROM sqlite_master
        WHERE type = 'index'
          AND tbl_name = 'payload_locked_documents_rels'
      `)
      .all() as Array<{ name?: unknown }>;

    for (const row of rows) {
      const name = typeof row.name === "string" ? row.name : null;

      if (!name) {
        continue;
      }

      db.prepare(`DROP INDEX IF EXISTS "${name}"`).run();
    }
  } finally {
    db.close();
  }
}

async function findOneBySlug(payload: any, collection: "case-categories" | "cases", slug: string) {
  const result = await payload.find({
    collection,
    depth: 0,
    limit: 1,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  });

  return result.docs[0] ?? null;
}

async function findMediaByFilename(payload: any, filename: string) {
  const result = await payload.find({
    collection: "media",
    depth: 0,
    limit: 1,
    pagination: false,
    where: {
      filename: {
        equals: filename,
      },
    },
  });

  return result.docs[0] ?? null;
}

async function upsertCategory(payload: any, theme: ThemeSeed) {
  const existing = await findOneBySlug(payload, "case-categories", theme.slug);

  if (existing) {
    return payload.update({
      collection: "case-categories",
      id: existing.id,
      data: {
        title: theme.title,
        slug: theme.slug,
        sortOrder: theme.sortOrder,
        isActive: true,
      },
    });
  }

  return payload.create({
    collection: "case-categories",
    data: {
      title: theme.title,
      slug: theme.slug,
      sortOrder: theme.sortOrder,
      isActive: true,
    },
  });
}

async function upsertMedia(payload: any, image: { src: string; alt: string }) {
  const relativePath = image.src.replace(/^\//, "");
  const filePath = path.resolve(process.cwd(), "public", relativePath);
  const filename = path.basename(filePath);
  const existing = await findMediaByFilename(payload, filename);

  if (existing) {
    if (existing.alt !== image.alt) {
      return payload.update({
        collection: "media",
        id: existing.id,
        data: {
          alt: image.alt,
        },
      });
    }

    return existing;
  }

  return payload.create({
    collection: "media",
    data: {
      alt: image.alt,
    },
    filePath,
  });
}

async function upsertCase(
  payload: any,
  input: {
    slug: string;
    company: string;
    teaser: string;
    intro: string;
    task: string;
    solution: string;
    result: string;
    categoryId: string;
    sortOrder: number;
    gallery: Array<{
      image: string;
      fit?: "cover" | "contain";
      x?: number;
      y?: number;
    }>;
  },
) {
  const existing = await findOneBySlug(payload, "cases", input.slug);
  const data = {
    company: input.company,
    slug: input.slug,
    teaser: input.teaser,
    intro: input.intro,
    task: input.task,
    solution: input.solution,
    result: input.result,
    category: input.categoryId,
    sortOrder: input.sortOrder,
    isActive: true,
    gallery: input.gallery,
  };

  if (existing) {
    return payload.update({
      collection: "cases",
      id: existing.id,
      data,
    });
  }

  return payload.create({
    collection: "cases",
    data,
  });
}

async function main() {
  process.env.PAYLOAD_PUSH_SCHEMA = "true";
  dropConflictingPayloadIndexes();

  const { default: config } = await import("../src/payload.config.ts");
  const payload = (await getPayload({ config })) as any;
  const categoryIdByLabel = new Map<string, string>();

  for (const theme of themeSeeds) {
    const category = await upsertCategory(payload, theme);
    categoryIdByLabel.set(theme.title, category.id);
  }

  let importedMedia = 0;
  let importedCases = 0;

  for (const [index, item] of casesPageItems.entries()) {
    const categoryId = categoryIdByLabel.get(item.theme);

    if (!categoryId) {
      throw new Error(`Не найдена категория для кейса "${item.id}"`);
    }

    const gallery = [];

    for (const image of item.gallery) {
      const media = await upsertMedia(payload, image);
      importedMedia += 1;
      gallery.push({
        image: media.id,
        fit: image.fit,
        x: image.x,
        y: image.y,
      });
    }

    await upsertCase(payload, {
      slug: item.id,
      company: item.company,
      teaser: item.teaser,
      intro: item.intro,
      task: item.task,
      solution: item.solution,
      result: item.result,
      categoryId,
      sortOrder: index,
      gallery,
    });
    importedCases += 1;
  }

  console.log(
    JSON.stringify(
      {
        categories: themeSeeds.length,
        cases: importedCases,
        mediaProcessed: importedMedia,
      },
      null,
      2,
    ),
  );
}

await main();
