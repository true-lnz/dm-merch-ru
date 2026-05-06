import type { CollectionConfig } from "payload";

import { createPageSeoFields } from "./page-shared.ts";

export const CasesPage: CollectionConfig = {
  slug: "cases-page",
  admin: {
    group: "Кейсы",
    useAsTitle: "documentTitle",
    defaultColumns: ["documentTitle", "updatedAt"],
  },
  labels: {
    singular: "Кейсы: настройки страницы",
    plural: "Кейсы: настройки страницы",
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
          documentTitle: "Настройки страницы",
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
      defaultValue: "Настройки страницы",
      admin: {
        hidden: true,
      },
    },
    ...createPageSeoFields(),
  ],
};
