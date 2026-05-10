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

export function ensureSQLiteMediaPrefixColumn(databaseURL: string) {
  const sqliteFilePath = getSQLiteFilePath(databaseURL);

  if (!sqliteFilePath || !fs.existsSync(sqliteFilePath)) {
    return;
  }

  const db = new Database(sqliteFilePath);

  try {
    const mediaColumns = db.prepare(`PRAGMA table_info("media")`).all() as TableInfoRow[];

    if (mediaColumns.length === 0) {
      return;
    }

    if (!hasColumn(db, "media", "prefix")) {
      db.prepare(`ALTER TABLE "media" ADD COLUMN "prefix" TEXT`).run();
    }
  } finally {
    db.close();
  }
}
