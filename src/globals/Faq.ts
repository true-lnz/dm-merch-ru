import type { GlobalConfig } from "payload";

export const FaqGlobal: GlobalConfig = {
  slug: "faq",
  label: "FAQ",
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: "title",
      type: "text",
      label: "Заголовок блока",
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      label: "Изображение FAQ",
    },
    {
      name: "items",
      type: "array",
      label: "Вопросы и ответы",
      labels: {
        singular: "Вопрос",
        plural: "Вопросы",
      },
      fields: [
        {
          name: "question",
          type: "text",
          label: "Вопрос",
          required: true,
        },
        {
          name: "answer",
          type: "textarea",
          label: "Ответ",
          required: true,
          admin: {
            rows: 6,
            description: "Можно вводить ответ в несколько строк. Переносы будут показаны на сайте.",
          },
        },
      ],
    },
  ],
};
