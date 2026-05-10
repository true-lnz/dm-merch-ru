import { SlugField } from "@nouance/payload-better-fields-plugin/Slug";
import type { CollectionConfig } from "payload";
import { getLivePreviewURLForCollection, getPreviewURLForCollection } from "../payload/preview.ts";
import { blogPostBlocks } from "./post-blocks.ts";

async function getNextPostSortOrder(
  req: { payload: { find: (args: object) => Promise<{ docs?: Array<{ id?: number | string; sortOrder?: number }> }> } },
  originalId?: number | string,
) {
  const existing = await req.payload.find({
    collection: "posts",
    depth: 0,
    draft: true,
    limit: 1000,
    overrideAccess: true,
    pagination: false,
  });

  const values = Array.isArray(existing.docs)
    ? existing.docs
        .filter(
          (doc): doc is { id?: number | string; sortOrder: number } =>
            String(doc.id) !== String(originalId) && typeof doc.sortOrder === "number" && Number.isFinite(doc.sortOrder),
        )
        .map((doc) => doc.sortOrder)
    : [];

  return values.length > 0 ? Math.max(...values) + 1 : 1;
}

export const Posts: CollectionConfig = {
  slug: "posts",
  admin: {
    group: "Страница Блог",
    useAsTitle: "title",
    defaultColumns: ["sortOrder", "title", "slug", "updatedAt", "publishedAt", "_status"],
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
    beforeValidate: [
      async ({ data, originalDoc, req }) => {
        if (!data || typeof data !== "object") {
          return data;
        }

        const sortOrder =
          typeof data.sortOrder === "number"
            ? data.sortOrder
            : typeof originalDoc?.sortOrder === "number"
              ? originalDoc.sortOrder
              : await getNextPostSortOrder(req as unknown as Parameters<typeof getNextPostSortOrder>[0], originalDoc?.id);

        if (typeof data.sortOrder !== "number") {
          data.sortOrder = sortOrder;
        }

        const existing = await req.payload.find({
          collection: "posts",
          depth: 0,
          draft: true,
          limit: 10,
          overrideAccess: true,
          pagination: false,
          where: {
            sortOrder: {
              equals: sortOrder,
            },
          },
        });

        const hasConflict = Array.isArray(existing.docs) && existing.docs.some((doc) => String(doc.id) !== String(originalDoc?.id));

        if (hasConflict) {
          throw new Error(`Статья с порядковым номером ${sortOrder} уже существует. Укажите уникальный номер.`);
        }

        return data;
      },
    ],
    beforeChange: [
      ({ data, originalDoc }) => {
        let nextData = data;

        if (nextData?._status === "published" && !nextData.publishedAt) {
          nextData = {
            ...nextData,
            publishedAt: originalDoc?.publishedAt || new Date().toISOString(),
          };
        }

        const meta = typeof nextData?.meta === "object" && nextData.meta !== null ? nextData.meta : {};
        const hasMetaImage = typeof meta === "object" && meta !== null && "image" in meta && meta.image != null;
        const cardImage = nextData?.cardImage ?? originalDoc?.cardImage;

        if (!hasMetaImage && cardImage != null) {
          return {
            ...nextData,
            meta: {
              ...meta,
              image: cardImage,
            },
          };
        }

        return nextData;
      },
    ],
  },
  fields: [
    {
      type: "row",
      fields: [
        {
          type: "group",
          label: false,
          admin: {
            width: "50%",
          },
          fields: [
            {
              name: "title",
              type: "text",
              label: "Заголовок карточки",
              required: true,
            },
            {
              name: "excerpt",
              type: "text",
              label: "Краткое описание карточки",
            },
            {
              name: "cardImage",
              type: "upload",
              relationTo: "media",
              label: "Обложка карточки",
              required: true,
            },
            ...SlugField("title", {
              slugOverrides: {
                required: true,
              },
            }),
            {
              name: "sortOrder",
              type: "number",
              label: "Порядковый номер",
              required: true,
              admin: {
                step: 1,
                description: "Уникальное число. Меньшее значение показывается раньше.",
              },
            },
          ],
        },
        {
          type: "group",
          label: false,
          admin: {
            width: "50%",
          },
          fields: [
            {
              name: "pageTitle",
              type: "text",
              label: "Заголовок статьи",
              required: true,
            },
            {
              name: "breadcrumbCurrentLabel",
              type: "text",
              label: "Надпись для хлебных крошек",
              defaultValue: "Статья",
            },
            {
              name: "heroImage",
              type: "upload",
              relationTo: "media",
              label: "Обложка статьи",
              required: true,
            },
            {
              name: "publishedAt",
              type: "date",
              label: "Дата публикации",
            },
          ],
        },
      ],
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
