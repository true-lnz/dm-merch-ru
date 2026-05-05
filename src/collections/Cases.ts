import type { CollectionConfig } from "payload";

export const Cases: CollectionConfig = {
  slug: "cases",
  admin: {
    useAsTitle: "company",
    defaultColumns: ["company", "category", "sortOrder", "isActive"],
  },
  labels: {
    singular: "Кейс",
    plural: "Кейсы",
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
      name: "company",
      type: "text",
      label: "Компания",
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
      name: "teaser",
      type: "text",
      label: "Подзаголовок",
      required: true,
    },
    {
      name: "intro",
      type: "textarea",
      label: "Введение",
      required: true,
    },
    {
      name: "task",
      type: "textarea",
      label: "Задача",
      required: true,
    },
    {
      name: "solution",
      type: "textarea",
      label: "Решение",
      required: true,
    },
    {
      name: "result",
      type: "textarea",
      label: "Результат",
      required: true,
    },
    {
      name: "category",
      type: "relationship",
      label: "Категория",
      relationTo: "case-categories" as any,
      required: true,
      index: true,
    },
    {
      name: "gallery",
      type: "array",
      label: "Галерея",
      minRows: 1,
      required: true,
      labels: {
        singular: "Изображение",
        plural: "Изображения",
      },
      admin: {
        description: "Первое изображение используется как главное превью карточки кейса.",
        initCollapsed: true,
      },
      fields: [
        {
          name: "image",
          type: "relationship",
          label: "Файл из медиа",
          relationTo: "media",
          required: true,
        },
        {
          name: "fit",
          type: "select",
          label: "Режим вписывания",
          defaultValue: "cover",
          options: [
            {
              label: "Cover",
              value: "cover",
            },
            {
              label: "Contain",
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
              label: "Позиция X",
              min: 0,
              max: 100,
              admin: {
                step: 1,
              },
            },
            {
              name: "y",
              type: "number",
              label: "Позиция Y",
              min: 0,
              max: 100,
              admin: {
                step: 1,
              },
            },
          ],
        },
      ],
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
