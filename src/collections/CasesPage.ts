import { createSettingsPageCollection } from "./page-shared.ts";

export const CasesPage = createSettingsPageCollection({
  slug: "cases-page",
  singular: "Кейсы: настройки",
  plural: "Кейсы: настройки",
  adminGroup: "Страница Кейсы",
  previewPath: "/cases",
});
