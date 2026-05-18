import fs from "node:fs";
import path from "node:path";
import Database from "libsql";

type SQLiteStatement = {
  all: (...params: any[]) => unknown[];
  run: (...params: any[]) => unknown;
};

type SQLiteDatabase = {
  close: () => void;
  prepare: (sql: string) => SQLiteStatement;
};

type TableInfoRow = {
  type?: unknown;
  name?: unknown;
};

type HomeDigestCardRow = {
  _parent_id?: unknown;
  card_key?: unknown;
  title?: unknown;
  description?: unknown;
  mobile_description?: unknown;
  details?: unknown;
  background_image_src?: unknown;
  image_id?: unknown;
};

function getSQLiteFilePath(databaseURL: string) {
  if (!databaseURL.startsWith("file:")) {
    return null;
  }

  const rawPath = databaseURL.slice("file:".length);

  if (!rawPath) {
    return null;
  }

  return path.isAbsolute(rawPath) ? rawPath : path.resolve(process.cwd(), rawPath);
}

function hasColumn(db: SQLiteDatabase, tableName: string, columnName: string) {
  const columns = db.prepare(`PRAGMA table_info("${tableName}")`).all() as TableInfoRow[];
  return columns.some((column) => column.name === columnName);
}

function addColumnIfMissing(db: SQLiteDatabase, tableName: string, columnName: string, definition: string) {
  if (!hasColumn(db, tableName, columnName)) {
    db.prepare(`ALTER TABLE "${tableName}" ADD COLUMN "${columnName}" ${definition}`).run();
  }
}

function rebuildLegacyHomePageDigestCardsTable(db: SQLiteDatabase, digestCardColumns: TableInfoRow[]) {
  if (digestCardColumns.length === 0) {
    return;
  }

  const idColumn = digestCardColumns.find((column) => column.name === "id");
  const hasLegacyImageColumns = digestCardColumns.some(
    (column) => column.name === "image_sizes" || column.name === "image_class_name",
  );
  const usesLegacyIntegerId = typeof idColumn?.type === "string" && idColumn.type.toUpperCase() === "INTEGER";

  if (!usesLegacyIntegerId && !hasLegacyImageColumns) {
    return;
  }

  db.prepare(`DROP INDEX IF EXISTS "home_page_digest_cards_image_idx"`).run();
  db.prepare(`DROP INDEX IF EXISTS "home_page_digest_cards_order_idx"`).run();
  db.prepare(`DROP INDEX IF EXISTS "home_page_digest_cards_parent_id_idx"`).run();
  db.prepare(`DROP TABLE IF EXISTS "home_page_digest_cards__new"`).run();
  db.prepare(`
    CREATE TABLE "home_page_digest_cards__new" (
      "_order" INTEGER NOT NULL,
      "_parent_id" INTEGER NOT NULL,
      "id" TEXT PRIMARY KEY NOT NULL,
      "card_key" TEXT,
      "variant" TEXT DEFAULT 'default' NOT NULL,
      "title" TEXT NOT NULL,
      "description" TEXT NOT NULL,
      "mobile_description" TEXT,
      "details" TEXT,
      "background_image_src" TEXT,
      "image_id" INTEGER NOT NULL,
      FOREIGN KEY ("image_id") REFERENCES "media"("id") ON UPDATE no action ON DELETE set null,
      FOREIGN KEY ("_parent_id") REFERENCES "home_page"("id") ON UPDATE no action ON DELETE cascade
    )
  `).run();
  db.prepare(`
    INSERT INTO "home_page_digest_cards__new" (
      "_order",
      "_parent_id",
      "id",
      "card_key",
      "variant",
      "title",
      "description",
      "mobile_description",
      "details",
      "background_image_src",
      "image_id"
    )
    SELECT
      "_order",
      "_parent_id",
      CAST("id" AS TEXT),
      "card_key",
      "variant",
      "title",
      "description",
      "mobile_description",
      "details",
      "background_image_src",
      "image_id"
    FROM "home_page_digest_cards"
  `).run();
  db.prepare(`DROP TABLE "home_page_digest_cards"`).run();
  db.prepare(`ALTER TABLE "home_page_digest_cards__new" RENAME TO "home_page_digest_cards"`).run();
  db.prepare(`CREATE INDEX "home_page_digest_cards_image_idx" ON "home_page_digest_cards" ("image_id")`).run();
  db.prepare(`CREATE INDEX "home_page_digest_cards_order_idx" ON "home_page_digest_cards" ("_order")`).run();
  db.prepare(`CREATE INDEX "home_page_digest_cards_parent_id_idx" ON "home_page_digest_cards" ("_parent_id")`).run();
}

function backfillHomePageDigestCards(db: SQLiteDatabase, digestCardColumns: TableInfoRow[]) {
  if (digestCardColumns.length === 0 || !digestCardColumns.some((column) => column.name === "card_key")) {
    return;
  }

  const rows = db.prepare(`
    SELECT
      "_parent_id",
      "card_key",
      "title",
      "description",
      "mobile_description",
      "details",
      "background_image_src",
      "image_id"
    FROM "home_page_digest_cards"
    WHERE "card_key" IS NOT NULL AND TRIM("card_key") != ''
  `).all() as HomeDigestCardRow[];

  const cardConfigByKey: Record<string, { prefix: string; isWild: boolean }> = {
    partners: { prefix: "digest_partners_card", isWild: false },
    events: { prefix: "digest_events_card", isWild: false },
    team: { prefix: "digest_team_card", isWild: true },
    souvenirs: { prefix: "digest_souvenirs_card", isWild: true },
    uniform: { prefix: "digest_uniform_card", isWild: false },
    workwear: { prefix: "digest_workwear_card", isWild: false },
  };

  for (const row of rows) {
    const parentId = typeof row._parent_id === "number" ? row._parent_id : Number(row._parent_id);
    const cardKey = typeof row.card_key === "string" ? row.card_key : "";
    const cardConfig = cardConfigByKey[cardKey];

    if (!cardConfig || !Number.isFinite(parentId)) {
      continue;
    }

    const assignments = [
      `"${cardConfig.prefix}_title" = COALESCE(NULLIF(TRIM("${cardConfig.prefix}_title"), ''), ?)`,
      `"${cardConfig.prefix}_description" = COALESCE(NULLIF(TRIM("${cardConfig.prefix}_description"), ''), ?)`,
    ];
    const params: Array<number | string | null> = [
      typeof row.title === "string" ? row.title : null,
      typeof row.description === "string" ? row.description : null,
    ];

    if (cardConfig.isWild) {
      assignments.push(
        `"${cardConfig.prefix}_mobile_description" = COALESCE(NULLIF(TRIM("${cardConfig.prefix}_mobile_description"), ''), ?)`,
        `"${cardConfig.prefix}_details" = COALESCE(NULLIF(TRIM("${cardConfig.prefix}_details"), ''), ?)`,
        `"${cardConfig.prefix}_background_image_src" = COALESCE(NULLIF(TRIM("${cardConfig.prefix}_background_image_src"), ''), ?)`,
      );
      params.push(
        typeof row.mobile_description === "string" ? row.mobile_description : null,
        typeof row.details === "string" ? row.details : null,
        typeof row.background_image_src === "string" ? row.background_image_src : null,
      );
    }

    assignments.push(`"${cardConfig.prefix}_image_id" = COALESCE("${cardConfig.prefix}_image_id", ?)`);
    params.push(typeof row.image_id === "number" ? row.image_id : row.image_id == null ? null : Number(row.image_id), parentId);

    db.prepare(`
      UPDATE "home_page"
      SET ${assignments.join(",\n        ")}
      WHERE "id" = ?
    `).run(...params);
  }
}

export function ensureCatalogProductsPageColumns(databaseURL: string) {
  const sqliteFilePath = getSQLiteFilePath(databaseURL);

  if (!sqliteFilePath || !fs.existsSync(sqliteFilePath)) {
    return;
  }

  const db = new Database(sqliteFilePath);

  try {
    const pageColumns = db.prepare(`PRAGMA table_info("catalog_products_page")`).all() as TableInfoRow[];

    if (pageColumns.length === 0) {
      return;
    }

    addColumnIfMissing(db, "catalog_products_page", "hero_images_left_top_id", "INTEGER");
    addColumnIfMissing(db, "catalog_products_page", "hero_images_left_middle_id", "INTEGER");
    addColumnIfMissing(db, "catalog_products_page", "hero_images_left_bottom_id", "INTEGER");
    addColumnIfMissing(db, "catalog_products_page", "hero_images_right_top_id", "INTEGER");
    addColumnIfMissing(db, "catalog_products_page", "hero_images_right_middle_id", "INTEGER");
    addColumnIfMissing(db, "catalog_products_page", "hero_images_right_bottom_id", "INTEGER");
    addColumnIfMissing(db, "catalog_products_page", "categories_heading", "TEXT");
    addColumnIfMissing(db, "catalog_products_page", "taxonomy_order_draft", "TEXT");

    db.prepare(`
      UPDATE "catalog_products_page"
      SET "categories_heading" = ?
      WHERE "categories_heading" IS NULL OR TRIM("categories_heading") = ''
    `).run("Мерч и корпоративные подарки");
  } finally {
    db.close();
  }
}

export function ensureMergedCatalogTaxonomySortOrderColumn(databaseURL: string) {
  const sqliteFilePath = getSQLiteFilePath(databaseURL);

  if (!sqliteFilePath || !fs.existsSync(sqliteFilePath)) {
    return;
  }

  const db = new Database(sqliteFilePath);

  try {
    const taxonomyColumns = db.prepare(`PRAGMA table_info("merged_catalog_taxonomy")`).all() as TableInfoRow[];

    if (taxonomyColumns.length === 0) {
      return;
    }

    addColumnIfMissing(db, "merged_catalog_taxonomy", "sort_order", "INTEGER DEFAULT 0 NOT NULL");
  } finally {
    db.close();
  }
}

export function ensureCatalogCategoryColumns(databaseURL: string) {
  const sqliteFilePath = getSQLiteFilePath(databaseURL);

  if (!sqliteFilePath || !fs.existsSync(sqliteFilePath)) {
    return;
  }

  const db = new Database(sqliteFilePath);

  try {
    const categoryColumns = db.prepare(`PRAGMA table_info("catalog_categories")`).all() as TableInfoRow[];

    if (categoryColumns.length === 0) {
      return;
    }

    addColumnIfMissing(db, "catalog_categories", "slug", "TEXT");
    addColumnIfMissing(db, "catalog_categories", "menu_order", "INTEGER DEFAULT 1 NOT NULL");
    addColumnIfMissing(db, "catalog_categories", "is_active", "INTEGER DEFAULT 1 NOT NULL");
  } finally {
    db.close();
  }
}

export function ensureCatalogCategoryPageColumns(databaseURL: string) {
  const sqliteFilePath = getSQLiteFilePath(databaseURL);

  if (!sqliteFilePath || !fs.existsSync(sqliteFilePath)) {
    return;
  }

  const db = new Database(sqliteFilePath);

  try {
    const pageColumns = db.prepare(`PRAGMA table_info("catalog_category_pages")`).all() as TableInfoRow[];

    if (pageColumns.length === 0) {
      return;
    }

    addColumnIfMissing(db, "catalog_category_pages", "slug", "TEXT");
    addColumnIfMissing(db, "catalog_category_pages", "page_type", "TEXT DEFAULT 'category'");
    addColumnIfMissing(db, "catalog_category_pages", "category_id", "INTEGER");
    addColumnIfMissing(db, "catalog_category_pages", "hero_title", "TEXT");
    addColumnIfMissing(db, "catalog_category_pages", "hero_image_id", "INTEGER");
    addColumnIfMissing(db, "catalog_category_pages", "cases_layout", "TEXT DEFAULT 'default'");
    addColumnIfMissing(db, "catalog_category_pages", "meta_title", "TEXT");
    addColumnIfMissing(db, "catalog_category_pages", "meta_description", "TEXT");
    addColumnIfMissing(db, "catalog_category_pages", "meta_image_id", "INTEGER");
    addColumnIfMissing(db, "catalog_category_pages", "meta_keywords", "TEXT");
    addColumnIfMissing(db, "catalog_category_pages", "meta_canonical_url", "TEXT");
    addColumnIfMissing(db, "catalog_category_pages", "meta_robots_no_index", "INTEGER");
    addColumnIfMissing(db, "catalog_category_pages", "meta_robots_no_follow", "INTEGER");
    addColumnIfMissing(db, "catalog_category_pages", "meta_open_graph_title", "TEXT");
    addColumnIfMissing(db, "catalog_category_pages", "meta_open_graph_description", "TEXT");
    addColumnIfMissing(db, "catalog_category_pages", "meta_open_graph_type", "TEXT");
    addColumnIfMissing(db, "catalog_category_pages", "meta_open_graph_image_alt", "TEXT");
    addColumnIfMissing(db, "catalog_category_pages", "meta_twitter_card", "TEXT");
    addColumnIfMissing(db, "catalog_category_pages", "meta_twitter_title", "TEXT");
    addColumnIfMissing(db, "catalog_category_pages", "meta_twitter_description", "TEXT");
    addColumnIfMissing(db, "catalog_category_pages", "meta_twitter_image_alt", "TEXT");
  } finally {
    db.close();
  }
}

export function ensureHomePageColumns(databaseURL: string) {
  const sqliteFilePath = getSQLiteFilePath(databaseURL);

  if (!sqliteFilePath || !fs.existsSync(sqliteFilePath)) {
    return;
  }

  const db = new Database(sqliteFilePath);

  try {
    const pageColumns = db.prepare(`PRAGMA table_info("home_page")`).all() as TableInfoRow[];

    if (pageColumns.length === 0) {
      return;
    }

    addColumnIfMissing(db, "home_page", "hero_show_cases_button", "INTEGER DEFAULT true");
    addColumnIfMissing(db, "home_page", "digest_partners_card_title", "TEXT");
    addColumnIfMissing(db, "home_page", "digest_partners_card_description", "TEXT");
    addColumnIfMissing(db, "home_page", "digest_partners_card_image_id", "INTEGER");
    addColumnIfMissing(db, "home_page", "digest_events_card_title", "TEXT");
    addColumnIfMissing(db, "home_page", "digest_events_card_description", "TEXT");
    addColumnIfMissing(db, "home_page", "digest_events_card_image_id", "INTEGER");
    addColumnIfMissing(db, "home_page", "digest_team_card_title", "TEXT");
    addColumnIfMissing(db, "home_page", "digest_team_card_description", "TEXT");
    addColumnIfMissing(db, "home_page", "digest_team_card_mobile_description", "TEXT");
    addColumnIfMissing(db, "home_page", "digest_team_card_details", "TEXT");
    addColumnIfMissing(db, "home_page", "digest_team_card_background_image_src", "TEXT");
    addColumnIfMissing(db, "home_page", "digest_team_card_image_id", "INTEGER");
    addColumnIfMissing(db, "home_page", "digest_souvenirs_card_title", "TEXT");
    addColumnIfMissing(db, "home_page", "digest_souvenirs_card_description", "TEXT");
    addColumnIfMissing(db, "home_page", "digest_souvenirs_card_mobile_description", "TEXT");
    addColumnIfMissing(db, "home_page", "digest_souvenirs_card_details", "TEXT");
    addColumnIfMissing(db, "home_page", "digest_souvenirs_card_background_image_src", "TEXT");
    addColumnIfMissing(db, "home_page", "digest_souvenirs_card_image_id", "INTEGER");
    addColumnIfMissing(db, "home_page", "digest_uniform_card_title", "TEXT");
    addColumnIfMissing(db, "home_page", "digest_uniform_card_description", "TEXT");
    addColumnIfMissing(db, "home_page", "digest_uniform_card_image_id", "INTEGER");
    addColumnIfMissing(db, "home_page", "digest_workwear_card_title", "TEXT");
    addColumnIfMissing(db, "home_page", "digest_workwear_card_description", "TEXT");
    addColumnIfMissing(db, "home_page", "digest_workwear_card_image_id", "INTEGER");
    let digestCardColumns = db.prepare(`PRAGMA table_info("home_page_digest_cards")`).all() as TableInfoRow[];
    if (digestCardColumns.length > 0) {
      addColumnIfMissing(db, "home_page_digest_cards", "card_key", "TEXT");
      digestCardColumns = db.prepare(`PRAGMA table_info("home_page_digest_cards")`).all() as TableInfoRow[];
      rebuildLegacyHomePageDigestCardsTable(db, digestCardColumns);
      digestCardColumns = db.prepare(`PRAGMA table_info("home_page_digest_cards")`).all() as TableInfoRow[];
      backfillHomePageDigestCards(db, digestCardColumns);
    }

    db.prepare(`
      UPDATE "home_page"
      SET "hero_show_cases_button" = 1
      WHERE "hero_show_cases_button" IS NULL
    `).run();
  } finally {
    db.close();
  }
}
