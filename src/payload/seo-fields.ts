import type { Field } from "payload";

function textField(name: string, label: string): Field {
  return {
    name,
    type: "text",
    label,
  };
}

function textareaField(name: string, label: string): Field {
  return {
    name,
    type: "textarea",
    label,
  };
}

export function extendSEOFields(defaultFields: Field[]): Field[] {
  return [
    ...defaultFields,
    textareaField("keywords", "Keywords"),
    textField("canonicalUrl", "Canonical URL"),
    {
      name: "robots",
      type: "group",
      label: "Robots",
      fields: [
        {
          name: "noIndex",
          type: "checkbox",
          label: "noindex",
        },
        {
          name: "noFollow",
          type: "checkbox",
          label: "nofollow",
        },
      ],
    },
    {
      name: "openGraph",
      type: "group",
      label: "Open Graph",
      fields: [
        textField("title", "og:title"),
        textareaField("description", "og:description"),
        {
          name: "type",
          type: "select",
          label: "og:type",
          options: [
            { label: "website", value: "website" },
            { label: "article", value: "article" },
          ],
        },
        textField("imageAlt", "og:image:alt"),
      ],
    },
    {
      name: "twitter",
      type: "group",
      label: "Twitter",
      fields: [
        {
          name: "card",
          type: "select",
          label: "twitter:card",
          options: [
            { label: "summary_large_image", value: "summary_large_image" },
            { label: "summary", value: "summary" },
          ],
        },
        textField("title", "twitter:title"),
        textareaField("description", "twitter:description"),
        textField("imageAlt", "twitter:image:alt"),
      ],
    },
  ];
}
