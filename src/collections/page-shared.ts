import type { CollectionConfig, Field } from "payload";

export function createPageSeoFields(): Field[] {
  return [
    {
      name: "seo",
      type: "group",
      label: "SEO",
      fields: [
        {
          name: "metaTitle",
          type: "text",
          label: "Meta title",
        },
        {
          name: "metaDescription",
          type: "textarea",
          label: "Meta description",
        },
      ],
    },
  ];
}

export function createSingletonPageCollection(args: {
  slug: string;
  singular: string;
  plural: string;
  extraFields?: Field[];
}): CollectionConfig {
  return {
    slug: args.slug,
    admin: {
      useAsTitle: "documentTitle",
      defaultColumns: ["documentTitle", "updatedAt"],
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
    hooks: {
      beforeValidate: [
        ({ data }) => {
          if (!data || typeof data !== "object") {
            return data;
          }

          return {
            ...data,
            documentTitle: args.singular,
          };
        },
      ],
    },
    fields: [
      {
        name: "documentTitle",
        type: "text",
        label: "Служебное название",
        required: true,
        defaultValue: args.singular,
        admin: {
          hidden: true,
        },
      },
      ...createPageSeoFields(),
      ...(args.extraFields ?? []),
    ],
  };
}
