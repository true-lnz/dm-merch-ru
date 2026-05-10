import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

import { defaultFaqSection } from "../src/shared/config/faq/faq.ts";
import { defaultRequestCtaContent } from "../src/shared/config/request-cta/request-cta.ts";
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

type PayloadInstance = {
  create: (args: {
    collection: "media";
    data: {
      alt: string;
    };
    filePath: string;
    overrideAccess: boolean;
  }) => Promise<{ id: number | string }>;
  find: (args: {
    collection: "media";
    depth: 0;
    limit: 1;
    pagination: false;
    where: {
      filename: {
        equals: string;
      };
    };
  }) => Promise<{ docs?: Array<{ id?: number | string }> }>;
  updateGlobal: (args: {
    slug: "site-info" | "request-cta" | "faq";
    data: Record<string, unknown>;
  }) => Promise<Record<string, unknown>>;
  destroy: () => Promise<void>;
};

const FAQ_IMAGE = {
  alt: "Фото фирменных бутылок Арт-Квадрат",
  publicPath: "/faq/img_faq_cover_desktop.webp",
} as const;

function hasColumn(db: SQLiteDatabase, tableName: string, columnName: string) {
  const columns = db.prepare(`PRAGMA table_info("${tableName}")`).all() as Array<{ name?: unknown }>;
  return columns.some((column) => column.name === columnName);
}

function ensureColumn(db: SQLiteDatabase, tableName: string, columnName: string, columnSqlType: string) {
  if (!hasColumn(db, tableName, columnName)) {
    db.prepare(`ALTER TABLE "${tableName}" ADD COLUMN "${columnName}" ${columnSqlType}`).run();
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

function toPublicFilePath(publicPath: string) {
  return path.resolve(process.cwd(), "public", publicPath.replace(/^\//, ""));
}

async function findMediaByFilename(payload: PayloadInstance, filename: string) {
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

  return Array.isArray(result.docs) ? result.docs[0] : null;
}

async function ensureMedia(payload: PayloadInstance, image: { alt: string; publicPath: string }) {
  const filename = path.basename(image.publicPath);
  const existing = await findMediaByFilename(payload, filename);

  if (existing?.id) {
    return existing.id;
  }

  const created = await payload.create({
    collection: "media",
    data: {
      alt: image.alt,
    },
    filePath: toPublicFilePath(image.publicPath),
    overrideAccess: true,
  });

  return created.id;
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

    ensureColumn(db, "faq", "image_id", "INTEGER");
    db.prepare(`
      CREATE TABLE IF NOT EXISTS "request_cta" (
        "id" integer PRIMARY KEY NOT NULL,
        "title" text NOT NULL,
        "description" text NOT NULL,
        "updated_at" text,
        "created_at" text
      )
    `).run();
  } finally {
    db.close();
  }
}

async function main() {
  process.env.PAYLOAD_PUSH_SCHEMA ??= "false";
  dropConflictingPayloadIndexes();

  const { default: config } = await import("../src/payload.config.ts");
  const payload = (await getPayload({ config })) as PayloadInstance;
  try {
    const faqImageId = await ensureMedia(payload, FAQ_IMAGE);
    const siteInfoResult = await payload.updateGlobal({
      slug: "site-info",
      data: {
        ...defaultSiteInfo,
      },
    });
    const requestCtaResult = await payload.updateGlobal({
      slug: "request-cta",
      data: {
        ...defaultRequestCtaContent,
      },
    });
    const faqResult = await payload.updateGlobal({
      slug: "faq",
      data: {
        image: faqImageId,
        title: defaultFaqSection.title,
        items: defaultFaqSection.items,
      },
    });

    console.log(
      JSON.stringify(
        {
          slug: "site-info",
          brandName: siteInfoResult.brandName,
          socials: Array.isArray(siteInfoResult.socials) ? siteInfoResult.socials.length : 0,
          requestCta: {
            slug: "request-cta",
            title: requestCtaResult.title,
          },
          faq: {
            slug: "faq",
            title: faqResult.title,
            items: Array.isArray(faqResult.items) ? faqResult.items.length : 0,
            image: faqResult.image ?? null,
          },
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
