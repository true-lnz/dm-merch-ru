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
  name?: unknown;
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
