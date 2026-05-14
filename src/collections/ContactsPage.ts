import { createSettingsPageCollection } from "./page-shared.ts";

export const ContactsPage = createSettingsPageCollection({
  slug: "contacts-page",
  singular: "Контакты: настройки",
  plural: "Контакты: настройки",
  adminGroup: "Страница Контактов",
  allowCreate: false,
  previewPath: "/contacts",
  extraFields: [
    {
      name: "heroImage",
      type: "upload",
      relationTo: "media",
      label: "Обложка блока",
      required: true,
    },
    {
      type: "row",
      fields: [
        {
          name: "officeLatitude",
          type: "number",
          label: "Широта офиса",
          required: true,
        },
        {
          name: "officeLongitude",
          type: "number",
          label: "Долгота офиса",
          required: true,
        },
        {
          name: "defaultZoom",
          type: "number",
          label: "Масштаб карты",
          required: true,
        },
      ],
    },
    {
      name: "yandexMapsApiKey",
      type: "text",
      label: "Yandex Maps API Key",
      required: true,
    },
  ],
});
