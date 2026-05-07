import type { CollectionConfig, Field } from "payload";

import { buildPreviewURL } from "../payload/preview.ts";

export function createSettingsPageCollection(args: {
  slug: string;
  singular: string;
  plural: string;
  adminGroup: string;
  previewPath: string;
  extraFields?: Field[];
}): CollectionConfig {
  return {
    slug: args.slug,
    admin: {
      group: args.adminGroup,
      defaultColumns: ["heroTitle", "updatedAt"],
      preview: () => buildPreviewURL(args.previewPath),
      livePreview: {
        url: () => buildPreviewURL(args.previewPath),
      },
    },
    labels: {
      singular: args.singular,
      plural: args.plural,
    },
    access: {
      read: () => true,
      create: ({ req }) => Boolean(req.user),
      update: ({ req }) => Boolean(req.user),
      delete: ({ req }) => Boolean(req.user),
    },
    fields: [
      {
        name: "heroTitle",
        type: "text",
        label: "Hero-заголовок",
        required: true,
      },
      ...(args.extraFields ?? []),
    ],
  };
}

export function createPlaceholderSingletonCollection(args: { slug: string; singular: string; plural: string; adminGroup: string }): CollectionConfig {
  return {
    slug: args.slug,
    admin: {
      group: args.adminGroup,
      defaultColumns: ["updatedAt"],
    },
    labels: {
      singular: args.singular,
      plural: args.plural,
    },
    access: {
      read: () => true,
      create: ({ req }) => Boolean(req.user),
      update: ({ req }) => Boolean(req.user),
      delete: ({ req }) => Boolean(req.user),
    },
    fields: [],
  };
}
