import type { CollectionConfig } from "payload";

export const Media: CollectionConfig = {
  slug: "media",
  folders: true,
  access: {
    read: () => true,
  },
  labels: {
    singular: "Медиа",
    plural: "Медиа",
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
    },
  ],
  upload: true,
};
