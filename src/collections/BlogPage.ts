import { createSettingsPageCollection } from "./page-shared.ts";

export const BlogPage = createSettingsPageCollection({
  slug: "blog-page",
  singular: "Блог: настройки",
  plural: "Блог: настройки",
  adminGroup: "Страница Блог",
  allowCreate: false,
  previewPath: "/blog",
});
