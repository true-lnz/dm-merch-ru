import type { CollectionConfig } from "payload";

import { slugify } from "./cases-slug.ts";

export const CaseFilters: CollectionConfig = {
  slug: "case-filters",
  admin: {
    group: "Кейсы",
    useAsTitle: "label",
    defaultColumns: ["label", "slug", "sortOrder", "isActive", "updatedAt"],
  },
  labels: {
    singular: "Кейсы: фильтр",
    plural: "Кейсы: фильтры",
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    beforeValidate: [
      ({ data }) => {
        if (!data || typeof data !== "object") {
          return data;
        }

        const nextLabel = typeof data.label === "string" ? data.label : "";

        return {
          ...data,
          slug: slugify(nextLabel),
        };
      },
    ],
  },
  fields: [
    {
      name: "label",
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
      admin: {
        readOnly: true,
        description: "Формируется автоматически из названия фильтра.",
      },
    },
    {
      name: "sortOrder",
      type: "number",
      label: "Порядок показа",
      required: true,
      defaultValue: 1,
      admin: {
        description: "Меньшее число показывается раньше.",
      },
    },
    {
      name: "isActive",
      type: "checkbox",
      label: "Активен",
      required: true,
      defaultValue: true,
    },
  ],
};
