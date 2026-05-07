import type { CollectionConfig } from "payload";

export const CatalogCategories: CollectionConfig = {
  slug: "catalog-categories",
  admin: {
    group: "Страница Каталог",
    useAsTitle: "title",
    defaultColumns: ["title", "updatedAt"],
  },
  labels: {
    singular: "Каталог: категория",
    plural: "Каталог: категории",
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: "title",
      type: "text",
      label: "Название",
      required: true,
    },
  ],
};
