import fs from "node:fs";
import path from "node:path";

import Database from "libsql";
import { getPayload } from "payload";

type MediaDoc = {
  id: number | string;
  alt?: null | string;
  filename?: null | string;
  url?: null | string;
};

type RawMediaRow = {
  id: number | string;
  alt?: null | string;
  filename?: null | string;
  prefix?: null | string;
  url?: null | string;
};

type PayloadInstance = Awaited<ReturnType<typeof getPayload>> & {
  destroy: () => Promise<void>;
  find: (args: {
    collection: "media";
    depth: 0;
    limit: number;
    overrideAccess: boolean;
    page: number;
    pagination: true;
  }) => Promise<{
    docs: MediaDoc[];
    hasNextPage: boolean;
    nextPage?: null | number;
    page: number;
    totalDocs?: number;
  }>;
  update: (args: {
    collection: "media";
    data: {
      alt: string;
    };
    filePath: string;
    id: number | string;
    overrideAccess: boolean;
  }) => Promise<MediaDoc>;
};

const MEDIA_DIR = path.resolve(process.cwd(), "media");
const DATABASE_URL = process.env.DATABASE_URL || "file:./dm-merch.db";
const S3_PUBLIC_BASE_URL = process.env.S3_PUBLIC_BASE_URL || "https://cdn.dm-merch.ru";

function normalizeBaseURL(url: string) {
  return url.replace(/\/+$/, "");
}

function isMigratedDoc(doc: Pick<RawMediaRow, "prefix" | "url">) {
  if (!doc.url || !doc.prefix) {
    return false;
  }

  return doc.url.startsWith(`${normalizeBaseURL(S3_PUBLIC_BASE_URL)}/`);
}

function getLocalFilePath(filename: string) {
  return path.resolve(MEDIA_DIR, filename);
}

function getSQLiteFilePath(databaseURL: string) {
  if (!databaseURL.startsWith("file:")) {
    throw new Error(`Поддерживается только file: DATABASE_URL для миграции media, получено: ${databaseURL}`);
  }

  const rawPath = databaseURL.slice("file:".length);
  return path.isAbsolute(rawPath) ? rawPath : path.resolve(process.cwd(), rawPath);
}

function loadRawMediaRows() {
  const db = new Database(getSQLiteFilePath(DATABASE_URL), { readonly: true });

  try {
    return db.prepare(`SELECT "id", "alt", "filename", "prefix", "url" FROM "media" ORDER BY "id" ASC`).all() as RawMediaRow[];
  } finally {
    db.close();
  }
}

function ensureRowPrefix(id: number | string, prefix: string) {
  const db = new Database(getSQLiteFilePath(DATABASE_URL));

  try {
    db.prepare(`UPDATE "media" SET "prefix" = ? WHERE "id" = ? AND ("prefix" IS NULL OR "prefix" = '')`).run(prefix, id);
  } finally {
    db.close();
  }
}

async function main() {
  if (!process.env.S3_ACCESS_KEY_ID || !process.env.S3_SECRET_ACCESS_KEY) {
    throw new Error("Для миграции в S3 нужны S3_ACCESS_KEY_ID и S3_SECRET_ACCESS_KEY в окружении.");
  }

  const { default: config } = await import("../src/payload.config.ts");
  const payload = (await getPayload({ config })) as PayloadInstance;

  try {
    const mediaDocs = loadRawMediaRows();
    let migrated = 0;
    let skippedAlreadyMigrated = 0;
    let skippedMissingFile = 0;

    for (const doc of mediaDocs) {
      if (!doc.filename) {
        skippedMissingFile += 1;
        console.warn(`skip:no-filename media#${doc.id}`);
        continue;
      }

      if (isMigratedDoc(doc)) {
        skippedAlreadyMigrated += 1;
        continue;
      }

      const filePath = getLocalFilePath(doc.filename);

      if (!fs.existsSync(filePath)) {
        skippedMissingFile += 1;
        console.warn(`skip:missing-file media#${doc.id} -> ${filePath}`);
        continue;
      }

      if (!doc.prefix) {
        ensureRowPrefix(doc.id, "media");
      }

      await payload.update({
        collection: "media",
        data: {
          alt: doc.alt || doc.filename,
        },
        filePath,
        id: doc.id,
        overrideAccess: true,
      });

      migrated += 1;
      console.log(`migrated media#${doc.id} -> ${doc.filename}`);
    }

    console.log(
      JSON.stringify(
        {
          total: mediaDocs.length,
          migrated,
          skippedAlreadyMigrated,
          skippedMissingFile,
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
