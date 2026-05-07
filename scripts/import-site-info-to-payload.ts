import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

import { defaultSiteInfo } from "../src/shared/config/site-info/site-info.ts";
import { getPayload } from "payload";

type SQLiteStatement = {
  all: () => unknown[];
  run: (...params: unknown[]) => unknown;
};

type SQLiteDatabase = {
  close: () => void;
  prepare: (sql: string) => SQLiteStatement;
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

type TableInfoRow = {
  name?: unknown;
};

function ensureSiteInfoSchema() {
  const Database = loadDatabaseCtor();
  const db = new Database(path.resolve(process.cwd(), "dm-merch.db"));

  try {
    const ensureColumn = (columnName: string, sqlType: "numeric" | "text") => {
      const columns = db.prepare(`PRAGMA table_info("site_info")`).all() as TableInfoRow[];
      const hasColumn = columns.some((column) => column.name === columnName);

      if (!hasColumn) {
        db.prepare(`ALTER TABLE "site_info" ADD COLUMN "${columnName}" ${sqlType}`).run();
      }
    };

    ensureColumn("office_latitude", "numeric");
    ensureColumn("office_longitude", "numeric");
    ensureColumn("default_zoom", "numeric");
    ensureColumn("yandex_maps_api_key", "text");
  } finally {
    db.close();
  }
}

async function main() {
  process.env.PAYLOAD_PUSH_SCHEMA = "false";
  dropConflictingPayloadIndexes();
  ensureSiteInfoSchema();

  const { default: config } = await import("../src/payload.config.ts");
  const payload = (await getPayload({ config })) as any;
  try {
    const result = await payload.updateGlobal({
      slug: "site-info",
      data: {
        ...defaultSiteInfo,
        officeLatitude: defaultSiteInfo.officeCoordinates[0],
        officeLongitude: defaultSiteInfo.officeCoordinates[1],
      },
    });

    console.log(
      JSON.stringify(
        {
          slug: "site-info",
          brandName: result.brandName,
          socials: Array.isArray(result.socials) ? result.socials.length : 0,
        },
        null,
        2,
      ),
    );
  } finally {
    await payload.destroy();
  }
}

await main();
