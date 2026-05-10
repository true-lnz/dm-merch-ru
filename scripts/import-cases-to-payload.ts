import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

import { buildCaseCardSlug, slugify } from "../src/collections/cases-slug.ts";
import { caseThemes, casesPageItems } from "../src/views/cases/model/cases-data.ts";
import { getPayload } from "payload";

type SQLiteStatement = {
  all: (...params: unknown[]) => unknown[];
  run: (...params: unknown[]) => unknown;
};

type SQLiteDatabase = {
  close: () => void;
  prepare: (sql: string) => SQLiteStatement;
};

type TableInfoRow = {
  name?: unknown;
};

type CountRow = {
  count?: number | string;
};

type CaseCardRow = {
  id?: number | string;
  slug?: string;
  company?: string;
  teaser?: string;
  theme_id?: number | string | null;
  sort_order?: number | string | null;
  is_active?: number | boolean | null;
  intro?: string;
  task?: string;
  solution?: string;
  result?: string;
  updated_at?: string | null;
  created_at?: string | null;
  _status?: string | null;
};

type CaseCardGalleryRow = {
  _order?: number | string;
  id?: string;
  image_id?: number | string | null;
  fit?: string | null;
  x?: number | string | null;
  y?: number | string | null;
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

function publishRowsWithoutStatus(db: SQLiteDatabase, tableName: string) {
  db.prepare(`UPDATE "${tableName}" SET "_status" = 'published' WHERE "_status" IS NULL OR "_status" = ''`).run();
}

function toNumber(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return fallback;
}

function seedCaseCardVersions(db: SQLiteDatabase) {
  const rows = db.prepare(`
    SELECT
      c.id,
      c.slug,
      c.company,
      c.teaser,
      c.theme_id,
      c.sort_order,
      c.is_active,
      c.intro,
      c.task,
      c.solution,
      c.result,
      c.updated_at,
      c.created_at,
      c._status
    FROM "case_cards" c
    WHERE NOT EXISTS (
      SELECT 1
      FROM "_case_cards_v" v
      WHERE v.parent_id = c.id
        AND v.latest = 1
    )
    ORDER BY c.id
  `).all() as CaseCardRow[];

  if (rows.length === 0) {
    return;
  }

  db.prepare(`
    UPDATE "case_cards"
    SET "_status" = 'published'
    WHERE id IN (
      SELECT c.id
      FROM "case_cards" c
      WHERE NOT EXISTS (
        SELECT 1
        FROM "_case_cards_v" v
        WHERE v.parent_id = c.id
          AND v.latest = 1
      )
    )
  `).run();

  let nextVersionId = toNumber((db.prepare(`SELECT COALESCE(MAX(id), 0) AS count FROM "_case_cards_v"`).all() as CountRow[])[0]?.count);
  let nextGalleryVersionId = toNumber(
    (db.prepare(`SELECT COALESCE(MAX(id), 0) AS count FROM "_case_cards_v_version_gallery"`).all() as CountRow[])[0]?.count,
  );

  for (const row of rows) {
    const parentId = toNumber(row.id);
    const sortOrder = row.sort_order == null ? null : toNumber(row.sort_order);
    const isActive =
      typeof row.is_active === "boolean" ? Number(row.is_active) : row.is_active == null ? null : toNumber(row.is_active);
    const versionStatus = row._status && row._status.length > 0 ? row._status : "published";

    nextVersionId += 1;

    db.prepare(`
      INSERT INTO "_case_cards_v" (
        "id",
        "parent_id",
        "version_slug",
        "version_company",
        "version_teaser",
        "version_theme_id",
        "version_sort_order",
        "version_is_active",
        "version_intro",
        "version_task",
        "version_solution",
        "version_result",
        "version_updated_at",
        "version_created_at",
        "version__status",
        "created_at",
        "updated_at",
        "latest"
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      nextVersionId,
      parentId,
      row.slug ?? null,
      row.company ?? null,
      row.teaser ?? null,
      row.theme_id ?? null,
      sortOrder,
      isActive,
      row.intro ?? null,
      row.task ?? null,
      row.solution ?? null,
      row.result ?? null,
      row.updated_at ?? null,
      row.created_at ?? null,
      versionStatus,
      row.created_at ?? null,
      row.updated_at ?? null,
      1,
    );

    const galleryRows = db.prepare(`
      SELECT "_order", "id", "image_id", "fit", "x", "y"
      FROM "case_cards_gallery"
      WHERE "_parent_id" = ?
      ORDER BY "_order" ASC
    `).all(parentId) as CaseCardGalleryRow[];

    for (const galleryRow of galleryRows) {
      nextGalleryVersionId += 1;

      db.prepare(`
        INSERT INTO "_case_cards_v_version_gallery" (
          "_order",
          "_parent_id",
          "id",
          "image_id",
          "fit",
          "x",
          "y",
          "_uuid"
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        toNumber(galleryRow._order),
        nextVersionId,
        nextGalleryVersionId,
        galleryRow.image_id ?? null,
        galleryRow.fit ?? null,
        galleryRow.x ?? null,
        galleryRow.y ?? null,
        galleryRow.id ?? null,
      );
    }
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
        "_status" text DEFAULT 'draft',
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
      `CREATE TABLE IF NOT EXISTS "_case_cards_v" (
        "id" integer PRIMARY KEY NOT NULL,
        "parent_id" integer,
        "version_slug" text,
        "version_company" text,
        "version_teaser" text,
        "version_theme_id" integer,
        "version_sort_order" numeric DEFAULT 1,
        "version_is_active" integer DEFAULT true,
        "version_intro" text,
        "version_task" text,
        "version_solution" text,
        "version_result" text,
        "version_updated_at" text,
        "version_created_at" text,
        "version__status" text DEFAULT 'draft',
        "created_at" text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
        "updated_at" text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
        "latest" integer,
        FOREIGN KEY ("parent_id") REFERENCES "case_cards"("id") ON UPDATE no action ON DELETE set null,
        FOREIGN KEY ("version_theme_id") REFERENCES "case_filters"("id") ON UPDATE no action ON DELETE set null
      )`,
      `CREATE INDEX IF NOT EXISTS "_case_cards_v_parent_idx" ON "_case_cards_v" ("parent_id")`,
      `CREATE INDEX IF NOT EXISTS "_case_cards_v_created_at_idx" ON "_case_cards_v" ("created_at")`,
      `CREATE INDEX IF NOT EXISTS "_case_cards_v_updated_at_idx" ON "_case_cards_v" ("updated_at")`,
      `CREATE INDEX IF NOT EXISTS "_case_cards_v_latest_idx" ON "_case_cards_v" ("latest")`,
      `CREATE INDEX IF NOT EXISTS "_case_cards_v_version_version_slug_idx" ON "_case_cards_v" ("version_slug")`,
      `CREATE INDEX IF NOT EXISTS "_case_cards_v_version_version_theme_idx" ON "_case_cards_v" ("version_theme_id")`,
      `CREATE INDEX IF NOT EXISTS "_case_cards_v_version_version_updated_at_idx" ON "_case_cards_v" ("version_updated_at")`,
      `CREATE INDEX IF NOT EXISTS "_case_cards_v_version_version_created_at_idx" ON "_case_cards_v" ("version_created_at")`,
      `CREATE INDEX IF NOT EXISTS "_case_cards_v_version_version__status_idx" ON "_case_cards_v" ("version__status")`,
      `CREATE TABLE IF NOT EXISTS "_case_cards_v_version_gallery" (
        "_order" integer NOT NULL,
        "_parent_id" integer NOT NULL,
        "id" integer PRIMARY KEY NOT NULL,
        "image_id" integer,
        "fit" text,
        "x" numeric,
        "y" numeric,
        "_uuid" text,
        FOREIGN KEY ("image_id") REFERENCES "media"("id") ON UPDATE no action ON DELETE set null,
        FOREIGN KEY ("_parent_id") REFERENCES "_case_cards_v"("id") ON UPDATE no action ON DELETE cascade
      )`,
      `CREATE INDEX IF NOT EXISTS "_case_cards_v_version_gallery_image_idx" ON "_case_cards_v_version_gallery" ("image_id")`,
      `CREATE INDEX IF NOT EXISTS "_case_cards_v_version_gallery_order_idx" ON "_case_cards_v_version_gallery" ("_order")`,
      `CREATE INDEX IF NOT EXISTS "_case_cards_v_version_gallery_parent_id_idx" ON "_case_cards_v_version_gallery" ("_parent_id")`,
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
    ensureColumn(db, "case_cards", "_status", "text DEFAULT 'draft'");

    publishRowsWithoutStatus(db, "case_cards");
    seedCaseCardVersions(db);

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
