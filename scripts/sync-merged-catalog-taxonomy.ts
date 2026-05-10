import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

type MergedCatalogChild = {
  id: string;
  name: string;
};

type MergedCatalogRoot = {
  id: string;
  name: string;
  children: MergedCatalogChild[];
};

type MergedCatalogDataset = {
  categories: MergedCatalogRoot[];
};

type TaxonomyNodeType = "root" | "child";

type TaxonomySyncRecord = {
  key: string;
  nodeType: TaxonomyNodeType;
  nodeId: string;
  rootId: string;
  sourceRootName: string;
  sourceName: string;
  isActive: boolean;
  sortOrder: number;
};

type ExistingTaxonomyRow = TaxonomySyncRecord & {
  id: number;
  displayNameOverride?: string | null;
};

type SQLiteStatement = {
  all: () => unknown[];
  run: (...params: unknown[]) => unknown;
};

type SQLiteDatabase = {
  close: () => void;
  exec: (sql: string) => void;
  prepare: (sql: string) => SQLiteStatement;
};

const DEFAULT_DATABASE_PATH = path.resolve(process.cwd(), "dm-merch.db");

function readMergedCatalog() {
  return JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "public", "_temp", "merged-catalog.json"), "utf8"),
  ) as MergedCatalogDataset;
}

function buildKey(nodeType: TaxonomyNodeType, nodeId: string) {
  return `${nodeType}:${nodeId}`;
}

function buildExpectedRecords(dataset: MergedCatalogDataset) {
  const records: TaxonomySyncRecord[] = [];

  for (const root of dataset.categories) {
      records.push({
        key: buildKey("root", root.id),
        nodeType: "root",
        nodeId: root.id,
        rootId: root.id,
        sourceRootName: root.name,
        sourceName: root.name,
        isActive: true,
        sortOrder: records.filter((record) => record.nodeType === "root").length,
      });

    for (const [childIndex, child] of root.children.entries()) {
      records.push({
        key: buildKey("child", child.id),
        nodeType: "child",
        nodeId: child.id,
        rootId: root.id,
        sourceRootName: root.name,
        sourceName: child.name,
        isActive: true,
        sortOrder: childIndex,
      });
    }
  }

  return records;
}

function hasChanged(existing: ExistingTaxonomyRow, next: TaxonomySyncRecord) {
  return (
    existing.nodeType !== next.nodeType ||
    existing.nodeId !== next.nodeId ||
    existing.rootId !== next.rootId ||
    existing.sourceRootName !== next.sourceRootName ||
    existing.sourceName !== next.sourceName ||
    existing.isActive !== next.isActive
  );
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

function ensureSchema(db: SQLiteDatabase) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS merged_catalog_taxonomy (
      id integer PRIMARY KEY NOT NULL,
      updated_at text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
      created_at text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
      key text NOT NULL,
      node_type text NOT NULL,
      node_id text NOT NULL,
      root_id text NOT NULL,
      source_root_name text NOT NULL,
      source_name text NOT NULL,
      display_name_override text,
      is_active numeric DEFAULT 1 NOT NULL,
      sort_order integer DEFAULT 0 NOT NULL
    );

    CREATE UNIQUE INDEX IF NOT EXISTS merged_catalog_taxonomy_key_idx
      ON merged_catalog_taxonomy (key);
    CREATE INDEX IF NOT EXISTS merged_catalog_taxonomy_updated_at_idx
      ON merged_catalog_taxonomy (updated_at);
    CREATE INDEX IF NOT EXISTS merged_catalog_taxonomy_created_at_idx
      ON merged_catalog_taxonomy (created_at);
  `);
}

function loadExistingRows(db: SQLiteDatabase) {
  const hasSortOrderColumn = (db.prepare(`PRAGMA table_info("merged_catalog_taxonomy")`).all() as Array<Record<string, unknown>>).some(
    (column) => column.name === "sort_order",
  );

  if (!hasSortOrderColumn) {
    db.prepare(`ALTER TABLE merged_catalog_taxonomy ADD COLUMN sort_order integer DEFAULT 0 NOT NULL`).run();
  }

  const rows = db
    .prepare(`
      SELECT
        id,
        key,
        node_type,
        node_id,
        root_id,
        source_root_name,
        source_name,
        display_name_override,
        is_active,
        sort_order
      FROM merged_catalog_taxonomy
    `)
    .all() as Array<Record<string, unknown>>;

  return rows.map(
    (row): ExistingTaxonomyRow => ({
      id: Number(row.id),
      key: String(row.key),
      nodeType: String(row.node_type) as TaxonomyNodeType,
      nodeId: String(row.node_id),
      rootId: String(row.root_id),
      sourceRootName: String(row.source_root_name),
      sourceName: String(row.source_name),
      displayNameOverride: typeof row.display_name_override === "string" ? row.display_name_override : null,
      isActive: Number(row.is_active ?? 0) === 1,
      sortOrder: Number(row.sort_order ?? 0),
    }),
  );
}

function insertRow(db: SQLiteDatabase, record: TaxonomySyncRecord) {
  db.prepare(`
    INSERT INTO merged_catalog_taxonomy (
      key,
      node_type,
      node_id,
      root_id,
      source_root_name,
      source_name,
      is_active,
      sort_order
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    record.key,
    record.nodeType,
    record.nodeId,
    record.rootId,
    record.sourceRootName,
    record.sourceName,
    record.isActive ? 1 : 0,
    record.sortOrder,
  );
}

function updateRow(db: SQLiteDatabase, id: number, record: TaxonomySyncRecord, sortOrder: number) {
  db.prepare(`
    UPDATE merged_catalog_taxonomy
    SET
      updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now'),
      node_type = ?,
      node_id = ?,
      root_id = ?,
      source_root_name = ?,
      source_name = ?,
      is_active = ?,
      sort_order = ?
    WHERE id = ?
  `).run(
    record.nodeType,
    record.nodeId,
    record.rootId,
    record.sourceRootName,
    record.sourceName,
    record.isActive ? 1 : 0,
    sortOrder,
    id,
  );
}

function deactivateRow(db: SQLiteDatabase, id: number) {
  db.prepare(`
    UPDATE merged_catalog_taxonomy
    SET
      updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now'),
      is_active = 0
    WHERE id = ?
  `).run(id);
}

async function main() {
  const Database = loadDatabaseCtor();
  const db = new Database(process.env.DATABASE_PATH || DEFAULT_DATABASE_PATH);

  try {
    ensureSchema(db);

    const mergedCatalog = readMergedCatalog();
    const expectedRecords = buildExpectedRecords(mergedCatalog);
    const expectedByKey = new Map(expectedRecords.map((record) => [record.key, record]));
    const existingRows = loadExistingRows(db);
    const existingByKey = new Map(existingRows.map((row) => [row.key, row]));
    const shouldInitializeSortOrder = existingRows.length > 0 && existingRows.every((row) => row.sortOrder === 0);

    let created = 0;
    let updated = 0;
    let deactivated = 0;

    for (const record of expectedRecords) {
      const existing = existingByKey.get(record.key);

      if (!existing) {
        insertRow(db, record);
        created += 1;
        continue;
      }

      if (!hasChanged(existing, record) && !(shouldInitializeSortOrder && existing.sortOrder !== record.sortOrder)) {
        continue;
      }

      updateRow(db, existing.id, record, shouldInitializeSortOrder ? record.sortOrder : existing.sortOrder);
      updated += 1;
    }

    for (const existing of existingRows) {
      if (expectedByKey.has(existing.key) || existing.isActive === false) {
        continue;
      }

      deactivateRow(db, existing.id);
      deactivated += 1;
    }

    console.log(
      JSON.stringify(
        {
          synced: expectedRecords.length,
          created,
          updated,
          deactivated,
        },
        null,
        2,
      ),
    );
  } finally {
    db.close();
  }
}

await main();
