import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { seoPlugin } from "@payloadcms/plugin-seo";
import { FixedToolbarFeature, lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { ru } from "payload/i18n/ru";
import { en } from "payload/i18n/en";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { BlogPage } from "./collections/BlogPage.ts";
import { CaseCards } from "./collections/CaseCards.ts";
import { CaseFilters } from "./collections/CaseFilters.ts";
import { CasesPage } from "./collections/CasesPage.ts";
import { CatalogPage } from "./collections/CatalogPage.ts";
import { CatalogProductsPage } from "./collections/CatalogProductsPage.ts";
import { HomePage } from "./collections/HomePage.ts";
import { Pages } from "./collections/Pages.ts";
import { Posts } from "./collections/Posts.ts";
import { SiteInfoGlobal } from "./globals/SiteInfo.ts";
import { Media } from "./collections/Media.ts";
import { MergedCatalogTaxonomy } from "./collections/MergedCatalogTaxonomy.ts";
import { Users } from "./collections/Users.ts";
import { LIVE_PREVIEW_BREAKPOINTS } from "./payload/preview.ts";
import { extendSEOFields } from "./payload/seo-fields.ts";
import { generateSEODescription, generateSEOImage, generateSEOTitle, generateSEOURL } from "./payload/seo.ts";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const DEFAULT_PAYLOAD_SECRET = "dm-merch-local-secret";
const DEFAULT_DATABASE_URL = `file:${path.resolve(dirname, "..", "dm-merch.db")}`;
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

export default buildConfig({
  admin: {
    user: Users.slug,
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
  collections: [Users, Media, Pages, Posts, HomePage, CatalogPage, CatalogProductsPage, CasesPage, CaseFilters, CaseCards, BlogPage, MergedCatalogTaxonomy],
  globals: [SiteInfoGlobal],
  editor: lexicalEditor({
    features: ({ rootFeatures }) => [...rootFeatures, FixedToolbarFeature()],
  }),
  i18n: {
    fallbackLanguage: "ru",
    supportedLanguages: { ru: ruAdmin, en },
  },
  secret: process.env.PAYLOAD_SECRET || DEFAULT_PAYLOAD_SECRET,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || DEFAULT_DATABASE_URL,
    },
    push: process.env.PAYLOAD_PUSH_SCHEMA === "true",
  }),
  sharp,
  plugins: [
    seoPlugin({
      collections: ["pages", "posts"],
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
