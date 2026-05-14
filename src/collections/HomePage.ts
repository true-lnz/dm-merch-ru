import { createSettingsPageCollection } from "./page-shared.ts";

export const HomePage = createSettingsPageCollection({
  slug: "home-page",
  singular: "Главная: настройки",
  plural: "Главная: настройки",
  adminGroup: "Страница Главная",
  allowCreate: false,
  previewPath: "/",
});
