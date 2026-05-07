import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

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

type SqlRow = Record<string, unknown>;

const sourceDbPath = process.argv[2];
const targetDbPath = path.resolve(process.cwd(), "dm-merch.db");
const shouldSkipMediaRestore = process.env.PAYLOAD_RESTORE_SKIP_MEDIA === "true";

if (!sourceDbPath) {
  throw new Error("Не передан путь к backup БД");
}

if (!fs.existsSync(sourceDbPath)) {
  throw new Error(`Backup БД не найдена: ${sourceDbPath}`);
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

function getColumnNames(db: SQLiteDatabase, tableName: string): string[] {
  return (db.prepare(`PRAGMA table_info("${tableName}")`).all() as TableInfoRow[])
    .map((column) => (typeof column.name === "string" ? column.name : null))
    .filter((column): column is string => column !== null);
}

function quoteIdentifier(identifier: string) {
  return `"${identifier.replaceAll('"', '""')}"`;
}

function buildInsertSql(tableName: string, columns: string[]) {
  const columnList = columns.map(quoteIdentifier).join(", ");
  const valuesList = columns.map(() => "?").join(", ");

  return `INSERT OR REPLACE INTO ${quoteIdentifier(tableName)} (${columnList}) VALUES (${valuesList})`;
}

function getRows(db: SQLiteDatabase, tableName: string): SqlRow[] {
  return db.prepare(`SELECT * FROM ${quoteIdentifier(tableName)}`).all() as SqlRow[];
}

function insertRows(targetDb: SQLiteDatabase, tableName: string, columns: string[], rows: SqlRow[]) {
  if (rows.length === 0 || columns.length === 0) {
    return 0;
  }

  const statement = targetDb.prepare(buildInsertSql(tableName, columns));

  for (const row of rows) {
    statement.run(...columns.map((column) => (column in row ? row[column] : null)));
  }

  return rows.length;
}

function restoreUsers(sourceDb: SQLiteDatabase, targetDb: SQLiteDatabase) {
  const columns = getColumnNames(targetDb, "users").filter((column) => getColumnNames(sourceDb, "users").includes(column));
  const rows = getRows(sourceDb, "users");

  return insertRows(targetDb, "users", columns, rows);
}

function restoreUserSessions(sourceDb: SQLiteDatabase, targetDb: SQLiteDatabase) {
  const sourceColumns = getColumnNames(sourceDb, "users_sessions");
  const targetColumns = getColumnNames(targetDb, "users_sessions");

  if (sourceColumns.length === 0 || targetColumns.length === 0) {
    return 0;
  }

  const columns = targetColumns.filter((column) => sourceColumns.includes(column));
  const rows = getRows(sourceDb, "users_sessions");

  return insertRows(targetDb, "users_sessions", columns, rows);
}

function getMediaIdentity(row: SqlRow) {
  if (typeof row.filename === "string" && row.filename) {
    return `filename:${row.filename}`;
  }

  if (typeof row.url === "string" && row.url) {
    return `url:${row.url}`;
  }

  return null;
}

function restoreMedia(sourceDb: SQLiteDatabase, targetDb: SQLiteDatabase) {
  const sourceColumns = getColumnNames(sourceDb, "media");
  const targetColumns = getColumnNames(targetDb, "media");
  const columns = targetColumns.filter((column) => sourceColumns.includes(column) && column !== "id");
  const existingRows = getRows(targetDb, "media");
  const existingIds = new Set(existingRows.map(getMediaIdentity).filter((value): value is string => value !== null));
  const sourceRows = getRows(sourceDb, "media");
  const rowsToInsert = sourceRows.filter((row) => {
    const identity = getMediaIdentity(row);

    return identity !== null && !existingIds.has(identity);
  });

  return insertRows(targetDb, "media", columns, rowsToInsert);
}

function main() {
  const Database = loadDatabaseCtor();
  const sourceDb = new Database(path.resolve(sourceDbPath));
  const targetDb = new Database(targetDbPath);

  try {
    const restoredUsers = restoreUsers(sourceDb, targetDb);
    const restoredSessions = restoreUserSessions(sourceDb, targetDb);
    const restoredMedia = shouldSkipMediaRestore ? 0 : restoreMedia(sourceDb, targetDb);

    console.log(
      JSON.stringify(
        {
          sourceDbPath: path.resolve(sourceDbPath),
          targetDbPath,
          restoredUsers,
          restoredSessions,
          restoredMedia,
          skippedMediaRestore: shouldSkipMediaRestore,
        },
        null,
        2,
      ),
    );
  } finally {
    sourceDb.close();
    targetDb.close();
  }
}

main();
