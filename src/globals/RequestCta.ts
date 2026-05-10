import type { GlobalConfig } from "payload";

export const RequestCtaGlobal: GlobalConfig = {
  slug: "request-cta",
  label: "CTA-блок заявки",
  access: {
    read: () => true,
    update: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: "title",
      type: "textarea",
      label: "Заголовок CTA",
      required: true,
      defaultValue: "Обсудим задачу\nи рассчитаем проект",
      admin: {
        rows: 3,
        description: "Используйте перенос строки, если заголовок нужно показать в две строки.",
      },
    },
    {
      name: "description",
      type: "textarea",
      label: "Описание CTA",
      required: true,
      defaultValue: "Ответим в течение 30 минут. Подскажем формат, сроки и бюджет.",
      admin: {
        rows: 3,
      },
    },
  ],
};
