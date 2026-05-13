import type { CollectionConfig, CollectionBeforeValidateHook } from "payload";

import { buildPreviewURL } from "../payload/preview.ts";

type CategoryDoc = {
  id: number | string;
  slug?: string | null;
  title?: string | null;
};

const syncPageSlugFromCategory: CollectionBeforeValidateHook = async ({ data, req }) => {
  if (!data || typeof data !== "object") {
    return data;
  }

  const categoryValue = data.category;

  if (typeof categoryValue === "object" && categoryValue !== null) {
    const slug = typeof categoryValue.slug === "string" ? categoryValue.slug : "";

    return {
      ...data,
      slug,
    };
  }

  if (typeof categoryValue !== "number" && typeof categoryValue !== "string") {
    return data;
  }

  try {
    const category = (await req.payload.findByID({
      collection: "catalog-categories",
      id: categoryValue,
      depth: 0,
      overrideAccess: true,
    })) as CategoryDoc;

    return {
      ...data,
      slug: typeof category?.slug === "string" ? category.slug : "",
    };
  } catch {
    return data;
  }
};

export const CatalogCategoryPages: CollectionConfig = {
  slug: "catalog-category-pages",
  admin: {
    group: "Страница Каталог",
    useAsTitle: "slug",
    defaultColumns: ["slug", "category", "updatedAt"],
    preview: (doc) => buildPreviewURL(doc?.slug === "catalog" ? "/catalog" : typeof doc?.slug === "string" ? `/catalog/${doc.slug}` : "/catalog"),
    livePreview: {
      url: ({ data }) =>
        buildPreviewURL(data?.slug === "catalog" ? "/catalog" : typeof data?.slug === "string" ? `/catalog/${data.slug}` : "/catalog"),
    },
  },
  labels: {
    singular: "Каталог: страница",
    plural: "Каталог: страницы",
  },
  access: {
    read: () => true,
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  hooks: {
    beforeValidate: [syncPageSlugFromCategory],
  },
  fields: [
    {
      type: "row",
      fields: [
        {
          name: "category",
          type: "relationship",
          relationTo: "catalog-categories",
          label: "Категория",
          required: true,
          unique: true,
        },
        {
          name: "slug",
          type: "text",
          label: "Slug страницы",
          required: true,
          unique: true,
          index: true,
          admin: {
            readOnly: true,
            description: "Заполняется автоматически из выбранной категории.",
          },
        },
      ],
    },
    {
      type: "row",
      fields: [
        {
          name: "heroTitle",
          type: "textarea",
          label: "Hero-заголовок",
          required: true,
          admin: {
            description: "Можно вводить текст с переносами строк.",
          },
        },
        {
          name: "heroImage",
          type: "upload",
          relationTo: "media",
          label: "Hero-изображение",
          required: true,
        },
      ],
    },
    {
      name: "subcategories",
      type: "array",
      label: "Карточки подкатегорий",
      labels: {
        singular: "Карточка",
        plural: "Карточки",
      },
      fields: [
        {
          name: "title",
          type: "text",
          label: "Название",
          required: true,
        },
        {
          name: "description",
          type: "textarea",
          label: "Описание",
          required: true,
        },
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          label: "Изображение",
          required: true,
        },
        {
          name: "buttonLabel",
          type: "text",
          label: "Название кнопки",
          required: true,
          defaultValue: "Отправить заявку",
        },
        {
          name: "useCustomLink",
          type: "checkbox",
          label: "Использовать кастомную ссылку",
          defaultValue: false,
        },
        {
          name: "customLink",
          type: "text",
          label: "Кастомная ссылка",
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.useCustomLink),
            description: "Показывается только если включена кастомная ссылка.",
          },
        },
      ],
    },
    {
      name: "casesLayout",
      type: "select",
      label: "Лэйаут кейсов",
      required: true,
      defaultValue: "default",
      options: [
        {
          label: "Стандартный",
          value: "default",
        },
        {
          label: "Stacked",
          value: "stacked",
        },
      ],
    },
    {
      name: "cases",
      type: "array",
      label: "Кейсы страницы",
      labels: {
        singular: "Кейс",
        plural: "Кейсы",
      },
      fields: [
        {
          name: "company",
          type: "text",
          label: "Компания",
          required: true,
        },
        {
          name: "description",
          type: "textarea",
          label: "Описание",
          required: true,
        },
        {
          name: "result",
          type: "textarea",
          label: "Что получил клиент",
          required: true,
        },
        {
          name: "images",
          type: "array",
          label: "Изображения",
          labels: {
            singular: "Изображение",
            plural: "Изображения",
          },
          fields: [
            {
              name: "image",
              type: "upload",
              relationTo: "media",
              label: "Изображение",
              required: true,
            },
            {
              name: "fit",
              type: "select",
              label: "Режим вписывания",
              options: [
                {
                  label: "По умолчанию",
                  value: "cover",
                },
                {
                  label: "Вписать целиком",
                  value: "contain",
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "x",
                  type: "number",
                  label: "Смещение X",
                },
                {
                  name: "y",
                  type: "number",
                  label: "Смещение Y",
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
