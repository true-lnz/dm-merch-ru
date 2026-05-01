import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { ru } from "payload/i18n/ru";
import { en } from "payload/i18n/en";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Media } from "./collections/Media";
import { MergedCatalogTaxonomy } from "./collections/MergedCatalogTaxonomy";

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
      graphics: {
        Icon: "./payload/graphics/AdminIcon.tsx",
        Logo: "./payload/graphics/AdminLogo.tsx",
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, MergedCatalogTaxonomy],
  editor: lexicalEditor(),
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
    push: false,
  }),
  sharp,
  plugins: [],
});
