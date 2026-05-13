import type { CollectionConfig, FieldHook } from "payload";

import { slugifyCatalogCategory } from "./catalog-category-shared.ts";

const syncSlugFromTitle: FieldHook = ({ data, operation, value }) => {
  if (typeof value === "string" && value.trim().length > 0) {
    return slugifyCatalogCategory(value);
  }

  if (typeof data?.title === "string" && data.title.trim().length > 0) {
    return slugifyCatalogCategory(data.title);
  }

  if (operation === "create") {
    return "";
  }

  return value;
};

export const CatalogCategories: CollectionConfig = {
  slug: "catalog-categories",
  admin: {
    group: "Страница Каталог",
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "menuOrder", "isActive", "updatedAt"],
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
    {
      name: "slug",
      type: "text",
      label: "Slug",
      required: true,
      unique: true,
      index: true,
      hooks: {
        beforeValidate: [syncSlugFromTitle],
      },
      admin: {
        description: "Используется в URL и для связи со страницей каталога. Если поле пустое, формируется из названия.",
      },
    },
    {
      name: "menuOrder",
      type: "number",
      label: "Позиция в меню",
      required: true,
      defaultValue: 1,
    },
    {
      name: "isActive",
      type: "checkbox",
      label: "Показывать в меню",
      required: true,
      defaultValue: true,
    },
  ],
};
