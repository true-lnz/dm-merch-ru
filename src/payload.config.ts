import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { seoPlugin } from "@payloadcms/plugin-seo";
import { FixedToolbarFeature, lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import path from "path";
import { buildConfig } from "payload";
import { en } from "payload/i18n/en";
import { ru } from "payload/i18n/ru";
import sharp from "sharp";
import { fileURLToPath } from "url";

import { BlogPage } from "./collections/BlogPage.ts";
import { CaseCards } from "./collections/CaseCards.ts";
import { CaseFilters } from "./collections/CaseFilters.ts";
import { CasesPage } from "./collections/CasesPage.ts";
import { CatalogCategoryPages } from "./collections/CatalogCategoryPages.ts";
import { CatalogCategories } from "./collections/CatalogCategories.ts";
import { CatalogProductsPage } from "./collections/CatalogProductsPage.ts";
import { ContactsPage } from "./collections/ContactsPage.ts";
import { HomeMarquiz } from "./collections/HomeMarquiz.ts";
import { HomePage } from "./collections/HomePage.ts";
import { Media } from "./collections/Media.ts";
import { MergedCatalogTaxonomy } from "./collections/MergedCatalogTaxonomy.ts";
import { Pages } from "./collections/Pages.ts";
import { Posts } from "./collections/Posts.ts";
import { FaqGlobal } from "./globals/Faq.ts";
import { RequestCtaGlobal } from "./globals/RequestCta.ts";
import { Users } from "./collections/Users.ts";
import { SiteInfoGlobal } from "./globals/SiteInfo.ts";
import {
  ensureCatalogCategoryColumns,
  ensureCatalogCategoryPageColumns,
  ensureCatalogProductsPageColumns,
  ensureHomePageColumns,
  ensureMergedCatalogTaxonomySortOrderColumn,
} from "./payload/ensure-catalog-products-page-columns.ts";
import { LIVE_PREVIEW_BREAKPOINTS } from "./payload/preview.ts";
import { ensureSQLiteMediaPrefixColumn } from "./payload/ensure-sqlite-media-prefix-column.ts";
import { extendSEOFields } from "./payload/seo-fields.ts";
import { generateSEODescription, generateSEOImage, generateSEOTitle, generateSEOURL } from "./payload/seo.ts";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const DEFAULT_PAYLOAD_SECRET = "dm-merch-local-secret";
const DEFAULT_DATABASE_URL = `file:${path.resolve(dirname, "..", "dm-merch.db")}`;
const DEFAULT_S3_BUCKET = "cdn-dm-merch";
const DEFAULT_S3_ENDPOINT = "https://storage.yandexcloud.net";
const DEFAULT_S3_REGION = "ru-central1";
const DEFAULT_S3_PUBLIC_BASE_URL = "https://cdn.dm-merch.ru";
const ruAdmin = {
  ...ru,
  translations: {
    ...ru.translations,
    general: {
      ...ru.translations.general,
      true: "Да",
      false: "Нет",
      noLabel: "Не задано",
    },
  },
};

const s3Config = {
  bucket: process.env.S3_BUCKET || DEFAULT_S3_BUCKET,
  endpoint: process.env.S3_ENDPOINT || DEFAULT_S3_ENDPOINT,
  publicBaseURL: process.env.S3_PUBLIC_BASE_URL || DEFAULT_S3_PUBLIC_BASE_URL,
  region: process.env.S3_REGION || DEFAULT_S3_REGION,
  accessKeyId: process.env.S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
};

const hasAnyS3Credential = Boolean(s3Config.accessKeyId || s3Config.secretAccessKey);
const hasAllS3Credentials = Boolean(s3Config.accessKeyId && s3Config.secretAccessKey);

if (hasAnyS3Credential && !hasAllS3Credentials) {
  throw new Error("S3 storage configuration is incomplete: both S3_ACCESS_KEY_ID and S3_SECRET_ACCESS_KEY are required.");
}

function isNextBuildProcess() {
  return process.env.PAYLOAD_SKIP_SQLITE_ENSURE === "true" || process.argv.includes("build");
}

const shouldGeneratePayloadTypes = !isNextBuildProcess();

if (!isNextBuildProcess()) {
  ensureSQLiteMediaPrefixColumn(process.env.DATABASE_URL || DEFAULT_DATABASE_URL);
  ensureCatalogProductsPageColumns(process.env.DATABASE_URL || DEFAULT_DATABASE_URL);
  ensureCatalogCategoryColumns(process.env.DATABASE_URL || DEFAULT_DATABASE_URL);
  ensureCatalogCategoryPageColumns(process.env.DATABASE_URL || DEFAULT_DATABASE_URL);
  ensureHomePageColumns(process.env.DATABASE_URL || DEFAULT_DATABASE_URL);
  ensureMergedCatalogTaxonomySortOrderColumn(process.env.DATABASE_URL || DEFAULT_DATABASE_URL);
}

function trimSlashes(value: string) {
  return value.replace(/^\/+|\/+$/g, "");
}

function joinURL(base: string, ...parts: Array<string | null | undefined>) {
  const normalizedBase = base.replace(/\/+$/, "");
  const normalizedPath = parts
    .filter((part): part is string => typeof part === "string" && part.length > 0)
    .map(trimSlashes)
    .filter(Boolean)
    .join("/");

  return normalizedPath ? `${normalizedBase}/${normalizedPath}` : normalizedBase;
}

export default buildConfig({
  admin: {
    user: Users.slug,
    dateFormat: "dd.MM.yyyy / HH:mm",
    meta: {
      icons: {
        icon: "/favicon/favicon.ico",
        apple: "/favicon/apple-touch-icon.png",
      },
      titleSuffix: "— Держи Марку!",
    },
    components: {
      beforeDashboard: ["./payload/admin/BeforeDashboard.tsx"],
      graphics: {
        Icon: "./payload/graphics/AdminIcon.tsx",
        Logo: "./payload/graphics/AdminLogo.tsx",
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    livePreview: {
      breakpoints: LIVE_PREVIEW_BREAKPOINTS,
    },
  },
  folders: {
    browseByFolder: false,
  },
  collections: [
    Users,
    Media,
    Pages,
    HomePage,
    HomeMarquiz,
    CatalogCategories,
    CatalogCategoryPages,
    CatalogProductsPage,
    MergedCatalogTaxonomy,
    CasesPage,
    CaseFilters,
    CaseCards,
    BlogPage,
    Posts,
    ContactsPage,
  ],
  globals: [SiteInfoGlobal, RequestCtaGlobal, FaqGlobal],
  editor: lexicalEditor({
    features: ({ rootFeatures }) => [...rootFeatures, FixedToolbarFeature()],
  }),
  i18n: {
    fallbackLanguage: "ru",
    supportedLanguages: { ru: ruAdmin, en },
  },
  secret: process.env.PAYLOAD_SECRET || DEFAULT_PAYLOAD_SECRET,
  ...(shouldGeneratePayloadTypes
    ? {
        typescript: {
          outputFile: path.resolve(dirname, "payload-types.ts"),
        },
      }
    : {}),
  db: sqliteAdapter({
    busyTimeout: 5000,
    client: {
      url: process.env.DATABASE_URL || DEFAULT_DATABASE_URL,
    },
    push: process.env.PAYLOAD_PUSH_SCHEMA === "true",
    wal: true,
  }),
  sharp,
  plugins: [
    s3Storage({
      enabled: hasAllS3Credentials,
      alwaysInsertFields: true,
      acl: "public-read",
      bucket: s3Config.bucket,
      config: {
        credentials: hasAllS3Credentials
          ? {
              accessKeyId: s3Config.accessKeyId!,
              secretAccessKey: s3Config.secretAccessKey!,
            }
          : undefined,
        endpoint: s3Config.endpoint,
        forcePathStyle: true,
        region: s3Config.region,
      },
      collections: {
        media: {
          disablePayloadAccessControl: true,
          prefix: "media",
          generateFileURL: ({ filename, prefix }) => joinURL(s3Config.publicBaseURL, prefix, filename),
        },
      },
    }),
    seoPlugin({
      collections: ["pages", "posts", "home-page", "catalog-category-pages", "blog-page", "catalog-products-page", "contacts-page", "cases-page"],
      fields: ({ defaultFields }) => extendSEOFields(defaultFields),
      uploadsCollection: "media",
      tabbedUI: true,
      generateTitle: ({ doc }) => generateSEOTitle({ doc: doc as Record<string, unknown> }),
      generateDescription: ({ doc }) => generateSEODescription({ doc: doc as Record<string, unknown> }),
      generateImage: ({ doc }) => generateSEOImage({ doc: doc as Record<string, unknown> }),
      generateURL: ({ collectionConfig, doc, req }) =>
        generateSEOURL({
          collectionSlug: collectionConfig?.slug,
          doc: doc as Record<string, unknown>,
          req,
        }),
    }),
  ],
});
