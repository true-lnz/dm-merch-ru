import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

import { buildCaseCardSlug, slugify } from "../src/collections/cases-slug.ts";
import { caseThemes, casesPageItems } from "../src/views/cases/model/cases-data.ts";
import { getPayload } from "payload";

type SQLiteStatement = {
  all: () => unknown[];
  run: (...params: unknown[]) => unknown;
};

type SQLiteDatabase = {
  close: () => void;
  prepare: (sql: string) => SQLiteStatement;
};

type TableInfoRow = {
  name?: unknown;
};

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

function ensureColumn(db: SQLiteDatabase, tableName: string, columnName: string, sqlType = "integer") {
  const columns = db.prepare(`PRAGMA table_info("${tableName}")`).all() as TableInfoRow[];
  const hasColumn = columns.some((column) => column.name === columnName);

  if (!hasColumn) {
    db.prepare(`ALTER TABLE "${tableName}" ADD COLUMN "${columnName}" ${sqlType}`).run();
  }
}

function ensureCasesSchema() {
  const Database = loadDatabaseCtor();
  const db = new Database(path.resolve(process.cwd(), "dm-merch.db"));

  try {
    const statements = [
      `CREATE TABLE IF NOT EXISTS "cases_page" (
        "id" integer PRIMARY KEY NOT NULL,
        "hero_title" text,
        "meta_title" text,
        "meta_description" text,
        "meta_image_id" integer,
        "meta_keywords" text,
        "meta_canonical_url" text,
        "meta_robots_no_index" integer,
        "meta_robots_no_follow" integer,
        "meta_open_graph_title" text,
        "meta_open_graph_description" text,
        "meta_open_graph_type" text,
        "meta_open_graph_image_alt" text,
        "meta_twitter_card" text,
        "meta_twitter_title" text,
        "meta_twitter_description" text,
        "meta_twitter_image_alt" text,
        "updated_at" text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
        "created_at" text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
      )`,
      `CREATE INDEX IF NOT EXISTS "cases_page_created_at_idx" ON "cases_page" ("created_at")`,
      `CREATE INDEX IF NOT EXISTS "cases_page_updated_at_idx" ON "cases_page" ("updated_at")`,
      `CREATE TABLE IF NOT EXISTS "case_filters" (
        "id" integer PRIMARY KEY NOT NULL,
        "label" text NOT NULL,
        "slug" text NOT NULL,
        "sort_order" numeric DEFAULT 100 NOT NULL,
        "is_active" integer DEFAULT true NOT NULL,
        "updated_at" text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
        "created_at" text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
      )`,
      `CREATE UNIQUE INDEX IF NOT EXISTS "case_filters_slug_idx" ON "case_filters" ("slug")`,
      `CREATE INDEX IF NOT EXISTS "case_filters_created_at_idx" ON "case_filters" ("created_at")`,
      `CREATE INDEX IF NOT EXISTS "case_filters_updated_at_idx" ON "case_filters" ("updated_at")`,
      `CREATE TABLE IF NOT EXISTS "case_cards" (
        "id" integer PRIMARY KEY NOT NULL,
        "slug" text NOT NULL,
        "company" text NOT NULL,
        "teaser" text NOT NULL,
        "theme_id" integer NOT NULL,
        "sort_order" numeric DEFAULT 100 NOT NULL,
        "is_active" integer DEFAULT true NOT NULL,
        "intro" text NOT NULL,
        "task" text NOT NULL,
        "solution" text NOT NULL,
        "result" text NOT NULL,
        "updated_at" text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
        "created_at" text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
        FOREIGN KEY ("theme_id") REFERENCES "case_filters"("id") ON UPDATE no action ON DELETE restrict
      )`,
      `CREATE UNIQUE INDEX IF NOT EXISTS "case_cards_slug_idx" ON "case_cards" ("slug")`,
      `CREATE INDEX IF NOT EXISTS "case_cards_theme_idx" ON "case_cards" ("theme_id")`,
      `CREATE INDEX IF NOT EXISTS "case_cards_created_at_idx" ON "case_cards" ("created_at")`,
      `CREATE INDEX IF NOT EXISTS "case_cards_updated_at_idx" ON "case_cards" ("updated_at")`,
      `CREATE TABLE IF NOT EXISTS "case_cards_gallery" (
        "_order" integer NOT NULL,
        "_parent_id" integer NOT NULL,
        "id" text PRIMARY KEY NOT NULL,
        "image_id" integer NOT NULL,
        "fit" text DEFAULT 'cover',
        "x" numeric,
        "y" numeric,
        FOREIGN KEY ("image_id") REFERENCES "media"("id") ON UPDATE no action ON DELETE set null,
        FOREIGN KEY ("_parent_id") REFERENCES "case_cards"("id") ON UPDATE no action ON DELETE cascade
      )`,
      `CREATE INDEX IF NOT EXISTS "case_cards_gallery_image_idx" ON "case_cards_gallery" ("image_id")`,
      `CREATE INDEX IF NOT EXISTS "case_cards_gallery_order_idx" ON "case_cards_gallery" ("_order")`,
      `CREATE INDEX IF NOT EXISTS "case_cards_gallery_parent_id_idx" ON "case_cards_gallery" ("_parent_id")`,
    ];

    for (const sql of statements) {
      db.prepare(sql).run();
    }

    ensureColumn(db, "cases_page", "hero_title", "text");
    ensureColumn(db, "cases_page", "meta_title", "text");
    ensureColumn(db, "cases_page", "meta_description", "text");
    ensureColumn(db, "cases_page", "meta_image_id");
    ensureColumn(db, "cases_page", "meta_keywords", "text");
    ensureColumn(db, "cases_page", "meta_canonical_url", "text");
    ensureColumn(db, "cases_page", "meta_robots_no_index");
    ensureColumn(db, "cases_page", "meta_robots_no_follow");
    ensureColumn(db, "cases_page", "meta_open_graph_title", "text");
    ensureColumn(db, "cases_page", "meta_open_graph_description", "text");
    ensureColumn(db, "cases_page", "meta_open_graph_type", "text");
    ensureColumn(db, "cases_page", "meta_open_graph_image_alt", "text");
    ensureColumn(db, "cases_page", "meta_twitter_card", "text");
    ensureColumn(db, "cases_page", "meta_twitter_title", "text");
    ensureColumn(db, "cases_page", "meta_twitter_description", "text");
    ensureColumn(db, "cases_page", "meta_twitter_image_alt", "text");
    ensureColumn(db, "payload_locked_documents_rels", "cases_page_id");
    ensureColumn(db, "payload_locked_documents_rels", "case_filters_id");
    ensureColumn(db, "payload_locked_documents_rels", "case_cards_id");
    ensureColumn(db, "payload_preferences_rels", "cases_page_id");
    ensureColumn(db, "payload_preferences_rels", "case_filters_id");
    ensureColumn(db, "payload_preferences_rels", "case_cards_id");

    db.prepare(`CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_cases_page_id_idx" ON "payload_locked_documents_rels" ("cases_page_id")`).run();
    db.prepare(`CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_case_filters_id_idx" ON "payload_locked_documents_rels" ("case_filters_id")`).run();
    db.prepare(`CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_case_cards_id_idx" ON "payload_locked_documents_rels" ("case_cards_id")`).run();
    db.prepare(`CREATE INDEX IF NOT EXISTS "payload_preferences_rels_cases_page_id_idx" ON "payload_preferences_rels" ("cases_page_id")`).run();
    db.prepare(`CREATE INDEX IF NOT EXISTS "payload_preferences_rels_case_filters_id_idx" ON "payload_preferences_rels" ("case_filters_id")`).run();
    db.prepare(`CREATE INDEX IF NOT EXISTS "payload_preferences_rels_case_cards_id_idx" ON "payload_preferences_rels" ("case_cards_id")`).run();
  } finally {
    db.close();
  }
}

function mapThemeToSlug(theme: string) {
  return slugify(theme);
}

async function findCasesPage(payload: any) {
  const result = await payload.find({
    collection: "cases-page",
    depth: 0,
    limit: 1,
    pagination: false,
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

async function findFilterBySlug(payload: any, slug: string) {
  const result = await payload.find({
    collection: "case-filters",
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

async function findCardBySlug(payload: any, slug: string) {
  const result = await payload.find({
    collection: "case-cards",
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

async function upsertCaseFilter(payload: any, input: { slug: string; label: string; sortOrder: number }) {
  const existing = await findFilterBySlug(payload, input.slug);

  if (existing) {
    return payload.update({
      collection: "case-filters",
      id: existing.id,
      data: {
        label: input.label,
        sortOrder: input.sortOrder,
        isActive: true,
      },
    });
  }

  return payload.create({
    collection: "case-filters",
    data: {
      label: input.label,
      sortOrder: input.sortOrder,
      isActive: true,
    },
  });
}

async function upsertCaseCard(
  payload: any,
  input: {
    slug: string;
    company: string;
    teaser: string;
    intro: string;
    task: string;
    solution: string;
    result: string;
    theme: number | string;
    sortOrder: number;
    gallery: Array<{
      image: number | string;
      fit?: string;
      x?: number;
      y?: number;
    }>;
  },
) {
  const existing = await findCardBySlug(payload, input.slug);
  const data = {
    company: input.company,
    teaser: input.teaser,
    intro: input.intro,
    task: input.task,
    solution: input.solution,
    result: input.result,
    theme: input.theme,
    sortOrder: input.sortOrder,
    isActive: true,
    gallery: input.gallery,
  };

  if (existing) {
    return payload.update({
      collection: "case-cards",
      id: existing.id,
      data,
    });
  }

  return payload.create({
    collection: "case-cards",
    data,
  });
}

async function main() {
  process.env.PAYLOAD_PUSH_SCHEMA = "false";
  ensureCasesSchema();

  const { default: config } = await import("../src/payload.config.ts");
  const payload = (await getPayload({ config })) as any;

  try {
    const themeDocs = new Map<string, any>();

    for (const [index, theme] of caseThemes.filter((item) => item !== "Все кейсы").entries()) {
      const slug = mapThemeToSlug(theme);
      const themeDoc = await upsertCaseFilter(payload, {
        slug,
        label: theme,
        sortOrder: index + 1,
      });

      themeDocs.set(slug, themeDoc);
    }

    let processedMedia = 0;

    for (const [index, item] of casesPageItems.entries()) {
      const gallery = [];

      for (const image of item.gallery) {
        const media = await upsertMedia(payload, image);
        processedMedia += 1;
        gallery.push({
          image: media.id,
          fit: image.fit,
          x: image.x,
          y: image.y,
        });
      }

      const themeSlug = mapThemeToSlug(item.theme);
      const themeDoc = themeDocs.get(themeSlug);

      if (!themeDoc) {
        throw new Error(`Не найден фильтр кейсов для slug "${themeSlug}"`);
      }

      await upsertCaseCard(payload, {
        slug: buildCaseCardSlug(item),
        company: item.company,
        teaser: item.teaser,
        intro: item.intro,
        task: item.task,
        solution: item.solution,
        result: item.result,
        theme: themeDoc.id,
        sortOrder: index + 1,
        gallery,
      });
    }

    const pageData = {
      heroTitle: "Кейсы",
      meta: {
        title: "Кейсы",
        description: "Кейсы Держи Марку! по корпоративному мерчу и сувенирной продукции.",
      },
    };
    const existingPage = await findCasesPage(payload);

    if (existingPage) {
      await payload.update({
        collection: "cases-page",
        id: existingPage.id,
        data: pageData,
      });
    } else {
      await payload.create({
        collection: "cases-page",
        data: pageData,
      });
    }

    console.log(
      JSON.stringify(
        {
          collection: "cases-page",
          filters: themeDocs.size,
          items: casesPageItems.length,
          mediaProcessed: processedMedia,
        },
        null,
        2,
      ),
    );
  } finally {
    await payload.destroy();
  }
}

try {
  await main();
  process.exit(0);
} catch (error) {
  console.error(error);
  process.exit(1);
}
