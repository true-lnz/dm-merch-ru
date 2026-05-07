import type { CollectionConfig } from "payload";

import { getLivePreviewURLForCollection, getPreviewURLForCollection } from "../payload/preview.ts";

export const Pages: CollectionConfig = {
  slug: "pages",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "updatedAt"],
    preview: getPreviewURLForCollection("pages"),
    livePreview: getLivePreviewURLForCollection("pages"),
  },
  labels: {
    singular: "Страница",
    plural: "Страницы",
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  versions: {
    drafts: true,
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
      type: "select",
      label: "Маршрут",
      unique: true,
      required: true,
      options: [
        { label: "Главная", value: "home" },
        { label: "Каталог", value: "catalog" },
        { label: "Каталог продукции", value: "catalog-products" },
        { label: "Кейсы", value: "cases" },
        { label: "Блог", value: "blog" },
      ],
    },
    {
      name: "heroTitle",
      type: "text",
      label: "Hero title",
    },
    {
      name: "intro",
      type: "textarea",
      label: "Краткое описание",
    },
  ],
};
