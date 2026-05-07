import type { GlobalConfig } from "payload";

export const SiteInfoGlobal: GlobalConfig = {
  slug: "site-info",
  label: "Информация о сайте",
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: "brandName",
      type: "text",
      label: "Название бренда",
      required: true,
    },
    {
      type: "row",
      fields: [
        {
          name: "email",
          type: "email",
          label: "Email",
          required: true,
        },
        {
          name: "phone",
          type: "text",
          label: "Телефон",
          required: true,
        },
      ],
    },
    {
      name: "address",
      type: "text",
      label: "Адрес",
      required: true,
    },
    {
      name: "socials",
      type: "array",
      label: "Социальные сети",
      labels: {
        singular: "Соцсеть",
        plural: "Социальные сети",
      },
      minRows: 1,
      required: true,
      fields: [
        {
          name: "icon",
          type: "select",
          label: "Иконка",
          required: true,
          options: [
            {
              label: "Telegram",
              value: "tg",
            },
            {
              label: "VK",
              value: "vk",
            },
            {
              label: "MAX",
              value: "max",
            },
          ],
        },
        {
          name: "label",
          type: "text",
          label: "Подпись",
          required: true,
        },
        {
          name: "href",
          type: "text",
          label: "Ссылка",
          required: true,
        },
      ],
    },
    {
      name: "copyright",
      type: "text",
      label: "Копирайт",
      required: true,
    },
  ],
};
