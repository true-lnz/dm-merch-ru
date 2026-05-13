import type { CollectionAfterChangeHook } from "payload";

import { createSettingsPageCollection } from "./page-shared.ts";

const syncCatalogProductsTaxonomyOrder: CollectionAfterChangeHook = async (args) => {
  const mod = await import("./catalog-products-taxonomy-order.ts");
  return mod.syncCatalogProductsTaxonomyOrder(args);
};

export const CatalogProductsPage = createSettingsPageCollection({
  slug: "catalog-products-page",
  singular: "Каталог продукции: настройки",
  plural: "Каталог продукции: настройки",
  adminGroup: "Страница Каталог продукции",
  previewPath: "/catalog-products",
  includeHeroTitle: false,
  defaultColumns: ["categoriesHeading", "updatedAt"],
  extraFields: [
    {
      name: "heroImages",
      type: "group",
      label: "Hero: обложки",
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "leftTop",
              type: "upload",
              relationTo: "media",
              label: "Слева [1]",
            },
            {
              name: "leftMiddle",
              type: "upload",
              relationTo: "media",
              label: "Слева [2]",
            },
            {
              name: "leftBottom",
              type: "upload",
              relationTo: "media",
              label: "Слева [3]",
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "rightTop",
              type: "upload",
              relationTo: "media",
              label: "Справа [5]",
            },
            {
              name: "rightMiddle",
              type: "upload",
              relationTo: "media",
              label: "Справа [6]",
            },
            {
              name: "rightBottom",
              type: "upload",
              relationTo: "media",
              label: "Справа [7]",
            },
          ],
        },
      ],
    },
    {
      name: "categoriesHeading",
      type: "text",
      label: "Заголовок над категориями",
      required: true,
      defaultValue: "Мерч и корпоративные подарки",
    },
    {
      name: "taxonomyOrderManager",
      type: "ui",
      label: "Порядок категорий и подкатегорий",
      admin: {
        components: {
          Field: "./payload/admin/CatalogProductsTaxonomyOrderField.tsx#default",
        },
        custom: {
          draftFieldPath: "taxonomyOrderDraft",
        },
      },
    },
    {
      name: "taxonomyOrderDraft",
      type: "textarea",
      label: "Черновик порядка категорий",
      admin: {
        hidden: true,
      },
      hooks: {
        beforeValidate: [
          ({ value }) => {
            return typeof value === "string" ? value : "";
          },
        ],
      },
    },
  ],
  hooks: {
    afterChange: [syncCatalogProductsTaxonomyOrder],
  },
});
