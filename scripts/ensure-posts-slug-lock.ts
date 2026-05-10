import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

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

function hasColumn(db: SQLiteDatabase, tableName: string, columnName: string) {
  const columns = db.prepare(`PRAGMA table_info("${tableName}")`).all() as TableInfoRow[];
  return columns.some((column) => column.name === columnName);
}

function ensureColumn(db: SQLiteDatabase, tableName: string, columnName: string, sqlType: string) {
  if (!hasColumn(db, tableName, columnName)) {
    db.prepare(`ALTER TABLE "${tableName}" ADD COLUMN "${columnName}" ${sqlType}`).run();
  }
}

function main() {
  const Database = loadDatabaseCtor();
  const db = new Database(path.resolve(process.cwd(), "dm-merch.db"));

  try {
    ensureColumn(db, "posts", "slug_lock", "integer DEFAULT 1");
    ensureColumn(db, "_posts_v", "version_slug_lock", "integer DEFAULT 1");
    ensureColumn(db, "posts", "sort_order", "numeric DEFAULT 100");
    ensureColumn(db, "_posts_v", "version_sort_order", "numeric DEFAULT 100");
    console.log("Ensured posts slug lock and sort order columns");
  } finally {
    db.close();
  }
}

main();
