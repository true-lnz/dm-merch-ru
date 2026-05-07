import { createSettingsPageCollection } from "./page-shared.ts";

export const CatalogPage = createSettingsPageCollection({
  slug: "catalog-page",
  singular: "Каталог: настройки",
  plural: "Каталог: настройки",
  adminGroup: "Страница Каталог",
  previewPath: "/catalog",
});
