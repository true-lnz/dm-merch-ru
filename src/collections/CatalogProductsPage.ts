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
      label: "Hero: боковые изображения",
      fields: [
        {
          type: "row",
          fields: [
            {
              name: "leftTop",
              type: "upload",
              relationTo: "media",
              label: "Слева сверху",
            },
            {
              name: "leftMiddle",
              type: "upload",
              relationTo: "media",
              label: "Слева по центру",
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "leftBottom",
              type: "upload",
              relationTo: "media",
              label: "Слева снизу",
            },
            {
              name: "rightTop",
              type: "upload",
              relationTo: "media",
              label: "Справа сверху",
            },
          ],
        },
        {
          type: "row",
          fields: [
            {
              name: "rightMiddle",
              type: "upload",
              relationTo: "media",
              label: "Справа по центру",
            },
            {
              name: "rightBottom",
              type: "upload",
              relationTo: "media",
              label: "Справа снизу",
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
