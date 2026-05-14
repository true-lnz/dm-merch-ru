import type { CollectionConfig, TextField } from "payload";

type SingleTextField = Omit<TextField, "type" | "hasMany"> & {
  hasMany?: false;
};

function createColourPickerField(overrides: SingleTextField): TextField {
  return {
    type: "text",
    hasMany: false,
    admin: {
      components: {
        Field: {
          path: "@nouance/payload-better-fields-plugin/ColourPicker/client#ColourPickerComponent",
          clientProps: {
            type: "hex",
            showPreview: true,
          },
        },
      },
    },
    ...overrides,
  } as TextField;
}

export const HomeMarquiz: CollectionConfig = {
  slug: "home-marquiz",
  admin: {
    group: "Страница Главная",
    defaultColumns: ["title", "updatedAt"],
  },
  labels: {
    singular: "Главная: марквиз",
    plural: "Главная: марквиз",
  },
  access: {
    read: () => true,
    create: () => false,
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: "title",
      type: "text",
      label: "Заголовок блока",
      required: true,
      defaultValue: "Ответьте на 5 простых вопросов и получите точный расчет стоимости вашего мерча",
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
      label: "Обложка блока",
    },
    {
      type: "group",
      name: "marquiz",
      label: "Настройки Marquiz",
      fields: [
        {
          name: "scriptUrl",
          type: "text",
          label: "URL скрипта",
          required: true,
          defaultValue: "https://script.marquiz.ru/v2.js",
        },
        {
          type: "group",
          name: "init",
          label: "Настройки инициализации",
          fields: [
            {
              name: "host",
              type: "text",
              label: "Host",
              required: true,
              defaultValue: "//quiz.marquiz.ru",
            },
            {
              name: "region",
              type: "text",
              label: "Регион",
              required: true,
              defaultValue: "ru",
            },
            {
              name: "id",
              type: "text",
              label: "ID квиза",
              required: true,
              defaultValue: "69ef0bea8ae1ec001990bdb0",
            },
            {
              type: "row",
              fields: [
                {
                  name: "autoOpen",
                  type: "checkbox",
                  label: "Автооткрытие",
                  defaultValue: false,
                },
                {
                  name: "autoOpenFreq",
                  type: "text",
                  label: "Частота автооткрытия",
                  required: true,
                  defaultValue: "once",
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "openOnExit",
                  type: "checkbox",
                  label: "Открывать при выходе",
                  defaultValue: false,
                },
                {
                  name: "disableOnMobile",
                  type: "checkbox",
                  label: "Отключить на мобильных",
                  defaultValue: false,
                },
              ],
            },
          ],
        },
        {
          type: "group",
          name: "inline",
          label: "Настройки inline-блока",
          fields: [
            {
              name: "buttonText",
              type: "text",
              label: "Текст кнопки",
              required: true,
              defaultValue: "«Старт»",
            },
            {
              type: "row",
              fields: [
                createColourPickerField({
                  name: "bgColor",
                  label: "Цвет фона",
                  required: true,
                  defaultValue: "#ecebe7",
                }),
                createColourPickerField({
                  name: "textColor",
                  label: "Цвет текста",
                  required: true,
                  defaultValue: "#0144a3",
                }),
              ],
            },
            {
              name: "shadow",
              type: "text",
              label: "Тень",
              required: true,
              defaultValue: "rgba(236, 235, 231, 0.5)",
            },
            {
              type: "row",
              fields: [
                {
                  name: "rounded",
                  type: "checkbox",
                  label: "Скругление",
                  defaultValue: true,
                },
                {
                  name: "blicked",
                  type: "checkbox",
                  label: "Анимация blicked",
                  defaultValue: true,
                },
                {
                  name: "fixed",
                  type: "checkbox",
                  label: "Фиксированная кнопка",
                  defaultValue: false,
                },
              ],
            },
            {
              type: "row",
              fields: [
                {
                  name: "buttonOnMobile",
                  type: "checkbox",
                  label: "Показывать кнопку на мобильных",
                  defaultValue: true,
                },
                {
                  name: "disableOnMobile",
                  type: "checkbox",
                  label: "Отключить inline на мобильных",
                  defaultValue: false,
                },
                {
                  name: "fullWidth",
                  type: "checkbox",
                  label: "Во всю ширину",
                  defaultValue: true,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
