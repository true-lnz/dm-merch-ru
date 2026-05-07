import { createSettingsPageCollection } from "./page-shared.ts";

export const CatalogProductsPage = createSettingsPageCollection({
  slug: "catalog-products-page",
  singular: "Каталог продукции: настройки",
  plural: "Каталог продукции: настройки",
  adminGroup: "Страница Каталог продукции",
  previewPath: "/catalog-products",
  extraFields: [
    {
      name: "hero",
      type: "group",
      label: "Первый экран",
      fields: [
        {
          name: "title",
          type: "text",
          label: "Заголовок",
          required: true,
        },
        {
          name: "description",
          type: "textarea",
          label: "Описание",
          required: true,
        },
        {
          name: "backgroundImageUrl",
          type: "text",
          label: "Фон hero-блока",
          required: true,
        },
      ],
    },
  ],
});
