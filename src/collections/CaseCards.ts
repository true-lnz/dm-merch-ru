import type { CollectionConfig } from "payload";

import { buildCaseCardSlug } from "./cases-slug.ts";

export const CaseCards: CollectionConfig = {
  slug: "case-cards",
  admin: {
    group: "Страница Кейсы",
    useAsTitle: "company",
    defaultColumns: ["company", "teaser", "theme", "sortOrder", "isActive", "updatedAt"],
  },
  labels: {
    singular: "Кейсы: карточка",
    plural: "Кейсы: карточки",
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

        return {
          ...data,
          slug: buildCaseCardSlug(data),
        };
      },
    ],
  },
  fields: [
    {
      name: "slug",
      type: "text",
      label: "Slug",
      required: true,
      unique: true,
      index: true,
      admin: {
        readOnly: true,
        description: "Формируется автоматически из компании и короткого текста.",
      },
    },
    {
      name: "company",
      type: "text",
      label: "Компания",
      required: true,
    },
    {
      name: "teaser",
      type: "text",
      label: "Короткий текст",
      required: true,
    },
    {
      name: "theme",
      type: "relationship",
      relationTo: "case-filters" as any,
      label: "Фильтр",
      required: true,
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
      label: "Активна",
      required: true,
      defaultValue: true,
    },
    {
      name: "intro",
      type: "textarea",
      label: "Вводный текст",
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
      name: "gallery",
      type: "array",
      label: "Галерея",
      labels: {
        singular: "Изображение",
        plural: "Галерея",
      },
      admin: {
        description: "Первое изображение используется как превью карточки кейса.",
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
};
