import type { CollectionConfig } from "payload";

import { blogPostBlocks } from "./post-blocks.ts";
import { getLivePreviewURLForCollection, getPreviewURLForCollection } from "../payload/preview.ts";

export const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    group: "Страница Блог",
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "updatedAt", "publishedAt"],
    preview: getPreviewURLForCollection("posts"),
    livePreview: getLivePreviewURLForCollection("posts"),
  },
  labels: {
    singular: "Блог: статья",
    plural: "Блог: статьи",
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
  hooks: {
    beforeChange: [
      ({ data, originalDoc }) => {
        if (data?._status === "published" && !data.publishedAt) {
          return {
            ...data,
            publishedAt: originalDoc?.publishedAt || new Date().toISOString(),
          };
        }

        return data;
      },
    ],
  },
  fields: [
    {
      name: "title",
      type: "text",
      label: "Заголовок",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      label: "Slug",
      unique: true,
      index: true,
      required: true,
    },
    {
      name: "pageTitle",
      type: "text",
      label: "Заголовок страницы",
    },
    {
      name: "excerpt",
      type: "textarea",
      label: "Краткое описание",
    },
    {
      type: "row",
      fields: [
        {
          name: "cardImage",
          type: "upload",
          relationTo: "media",
          label: "Карточка",
          required: true,
        },
        {
          name: "heroImage",
          type: "upload",
          relationTo: "media",
          label: "Обложка",
          required: true,
        },
      ],
    },
    {
      name: "breadcrumbCurrentLabel",
      type: "text",
      label: "Breadcrumb label",
      defaultValue: "Статьи",
    },
    {
      name: "publishedAt",
      type: "date",
      label: "Дата публикации",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "layout",
      type: "blocks",
      label: "Секции",
      blocks: blogPostBlocks,
      required: true,
      minRows: 1,
    },
  ],
};
