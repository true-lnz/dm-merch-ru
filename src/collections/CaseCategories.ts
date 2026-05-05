import type { CollectionConfig } from "payload";

export const CaseCategories: CollectionConfig = {
  slug: "case-categories",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "sortOrder", "isActive"],
  },
  labels: {
    singular: "Категория кейсов",
    plural: "Категории кейсов",
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  defaultSort: "sortOrder",
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
    },
    {
      name: "sortOrder",
      type: "number",
      label: "Порядок",
      required: true,
      defaultValue: 0,
      index: true,
    },
    {
      name: "isActive",
      type: "checkbox",
      label: "Активно",
      required: true,
      defaultValue: true,
      index: true,
    },
  ],
};
