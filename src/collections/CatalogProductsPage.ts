import { createSingletonPageCollection } from "./page-shared.ts";

export const CatalogProductsPage = createSingletonPageCollection({
  slug: "catalog-products-page",
  singular: "Каталог продукции",
  plural: "Каталог продукции",
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
