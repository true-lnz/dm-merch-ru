import type { CollectionConfig } from "payload";

export const MergedCatalogTaxonomy: CollectionConfig = {
  slug: "merged-catalog-taxonomy",
  admin: {
    group: "Страница Каталог продукции",
    useAsTitle: "sourceName",
    defaultColumns: ["nodeType", "sourceRootName", "sourceName", "displayNameOverride", "isActive"],
  },
  labels: {
    singular: "Каталог продукции: категория",
    plural: "Каталог продукции: категории",
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: "key",
      type: "text",
      required: true,
      unique: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: "nodeType",
      type: "select",
      required: true,
      label: "Тип",
      options: [
        {
          label: "Категория",
          value: "root",
        },
        {
          label: "Подкатегория",
          value: "child",
        },
      ],
      admin: {
        readOnly: true,
      },
    },
    {
      name: "nodeId",
      type: "text",
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: "rootId",
      type: "text",
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: "sourceRootName",
      type: "text",
      required: true,
      label: "Базовая категория",
      admin: {
        readOnly: true,
        condition: (_, siblingData) => siblingData?.nodeType === "child",
      },
    },
    {
      name: "sourceName",
      type: "text",
      required: true,
      label: "Исходное наименование",
      admin: {
        readOnly: true,
      },
    },
    {
      name: "displayNameOverride",
      type: "text",
      label: "Именование на сайте",
    },
    {
      name: "isActive",
      type: "checkbox",
      label: "Активно",
      required: true,
      defaultValue: true,
    },
  ],
};
