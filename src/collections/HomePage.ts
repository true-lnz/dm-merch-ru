import type { Field } from "payload";

import { createSettingsPageCollection } from "./page-shared.ts";

const mediaUploadField = (name: string, label: string, required = true): Field => ({
  name,
  type: "upload",
  relationTo: "media",
  label,
  required,
});

const textField = (name: string, label: string, required = true): Field => ({
  name,
  type: "text",
  label,
  required,
});

const textareaField = (name: string, label: string, required = true, rows = 3): Field => ({
  name,
  type: "textarea",
  label,
  required,
  admin: {
    rows,
  },
});

const linkTitleDescriptionFields = (withCta = false): Field[] => [
  textField("title", "Заголовок"),
  textareaField("description", "Описание"),
  ...(withCta ? [textField("ctaLabel", "Текст кнопки")] : []),
];

const featureCardsArrayField = (name: string, label: string): Field => ({
  name,
  type: "array",
  label,
  minRows: 1,
  labels: {
    singular: "Карточка",
    plural: label,
  },
  fields: [textField("title", "Заголовок"), textareaField("description", "Описание"), textField("backgroundImageUrl", "Фон / URL изображения")],
});

const digestCardGroupField = (name: string, label: string, variant: "default" | "wild"): Field => ({
  name,
  type: "group",
  label,
  fields: [
    textareaField("title", "Заголовок"),
    textareaField("description", "Описание"),
    ...(variant === "wild"
      ? [
          textareaField("mobileDescription", "Короткое описание для мобильной версии", true),
          textareaField("details", "Дополнительный текст", true),
          textField("backgroundImageSrc", "Фон расширенной карточки"),
        ]
      : []),
    mediaUploadField("image", "Изображение"),
  ],
});

export const HomePage = createSettingsPageCollection({
  slug: "home-page",
  singular: "Главная: настройки",
  plural: "Главная: настройки",
  adminGroup: "Страница Главная",
  allowCreate: false,
  includeHeroTitle: false,
  previewPath: "/",
  extraFields: [
    {
      name: "hero",
      type: "group",
      label: "Hero-блок",
      fields: [
        textareaField("title", "Заголовок"),
        textareaField("description", "Описание"),
        mediaUploadField("image", "Изображение"),
        {
          name: "showCasesButton",
          type: "checkbox",
          label: "Показывать кнопку кейсов",
          defaultValue: true,
        },
        {
          name: "features",
          type: "array",
          label: "Блок Преимущества",
          minRows: 1,
          maxRows: 3,
          labels: {
            singular: "Блок Преимущества",
            plural: "Блок Преимущества",
          },
          fields: [textareaField("text", "Текст")],
        },
      ],
    },
    {
      name: "digest",
      type: "group",
      label: "Блок Дайджест направлений",
      fields: [
        textareaField("title", "Заголовок"),
        textareaField("description", "Описание"),
        digestCardGroupField("partnersCard", "Карточка 1 Default", "default"),
        digestCardGroupField("eventsCard", "Карточка 2 Default", "default"),
        digestCardGroupField("teamCard", "Карточка 3 Accent", "wild"),
        digestCardGroupField("souvenirsCard", "Карточка 4 Accent", "wild"),
        digestCardGroupField("uniformCard", "Карточка 5 Default", "default"),
        digestCardGroupField("workwearCard", "Карточка 6 Default", "default"),
      ],
    },
    {
      name: "results",
      type: "group",
      label: "Блок Кейсов с результатом",
      fields: [
        ...linkTitleDescriptionFields(true),
        {
          name: "slides",
          type: "array",
          label: "Слайды",
          minRows: 1,
          labels: {
            singular: "Слайд",
            plural: "Слайды",
          },
          fields: [
            textareaField("before", "Было", true, 5),
            textareaField("after", "Стало", true, 5),
            textareaField("result", "Результат", true, 5),
            mediaUploadField("image", "Изображение"),
          ],
        },
      ],
    },
    {
      name: "services",
      type: "group",
      label: "Блок Услуг",
      fields: [
        textField("title", "Заголовок"),
        mediaUploadField("image", "Изображение"),
        {
          name: "items",
          type: "array",
          label: "Услуги",
          minRows: 1,
          labels: {
            singular: "Услуга",
            plural: "Услуги",
          },
          fields: [...linkTitleDescriptionFields(true)],
        },
      ],
    },
    {
      name: "benefits",
      type: "group",
      label: "Блок Преимуществ: дизайн-отдел",
      fields: [textField("title", "Заголовок"), textareaField("description", "Описание", false), featureCardsArrayField("items", "Карточки")],
    },
    {
      name: "leadCta",
      type: "group",
      label: "Блок Отправки примеров",
      fields: [
        textField("title", "Заголовок"),
        textareaField("description", "Описание"),
        mediaUploadField("image", "Изображение"),
        textField("submitLabel", "Текст кнопки"),
      ],
    },
    {
      name: "partnerProducts",
      type: "group",
      label: "Блок Каталожных направлений",
      fields: [
        textField("title", "Заголовок"),
        textareaField("description", "Описание"),
        {
          name: "items",
          type: "array",
          label: "Карточки товаров",
          minRows: 1,
          labels: {
            singular: "Карточка",
            plural: "Карточки товаров",
          },
          fields: [
            textField("title", "Заголовок"),
            textareaField("description", "Описание"),
            mediaUploadField("image", "Изображение"),
            textField("href", "Ссылка при клике на кнопку"),
          ],
        },
      ],
    },
    {
      name: "urgentOrder",
      type: "group",
      label: "Блок Срочного заказа",
      fields: [
        textareaField("title", "Заголовок"),
        mediaUploadField("image", "Изображение"),
        textField("ctaLabel", "Текст кнопки"),
        {
          name: "paragraphs",
          type: "array",
          label: "Абзацы",
          minRows: 1,
          labels: {
            singular: "Абзац",
            plural: "Абзацы",
          },
          fields: [textareaField("text", "Текст")],
        },
      ],
    },
    {
      name: "reviews",
      type: "group",
      label: "Блок Отзывов",
      fields: [
        textareaField("title", "Заголовок"),
        {
          name: "items",
          type: "array",
          label: "Карточки отзывов",
          minRows: 1,
          labels: {
            singular: "Отзыв",
            plural: "Отзывы",
          },
          fields: [
            textField("company", "Компания"),
            textField("name", "Имя"),
            textField("role", "Должность / Роль"),
            mediaUploadField("image", "Изображение"),
            mediaUploadField("avatar", "Аватар"),
            {
              name: "quote",
              type: "array",
              label: "Абзацы отзыва",
              minRows: 1,
              labels: {
                singular: "Абзац",
                plural: "Абзацы отзыва",
              },
              fields: [textareaField("text", "Текст")],
            },
          ],
        },
      ],
    },
    {
      name: "workStages",
      type: "group",
      label: "Блок Этапы работы",
      fields: [
        textareaField("title", "Заголовок"),
        textareaField("description", "Описание"),
        {
          name: "items",
          type: "array",
          label: "Этапы",
          minRows: 4,
          maxRows: 4,
          labels: {
            singular: "Этап",
            plural: "Этапы",
          },
          fields: [textField("number", "Номер"), textareaField("title", "Заголовок"), textareaField("description", "Описание", true, 4)],
        },
      ],
    },
    {
      name: "features",
      type: "group",
      label: "Блок Преимуществ перед конкурентами",
      fields: [textareaField("title", "Заголовок"), textareaField("description", "Описание", false), featureCardsArrayField("items", "Карточки")],
    },
    {
      name: "layoutBlocks",
      type: "array",
      label: "Порядок блоков главной",
      minRows: 1,
      labels: {
        singular: "Блок",
        plural: "Порядок блоков",
      },
      admin: {
        description: "Определяет порядок и видимость блоков на главной странице. FAQ, Marquiz и CTA используют свои текущие источники данных.",
      },
      fields: [
        {
          name: "blockType",
          type: "select",
          label: "Тип блока",
          required: true,
          options: [
            { label: "Hero", value: "hero" },
            { label: "Дайджест", value: "digest" },
            { label: "Кейсы с результатом", value: "results" },
            { label: "Услуги", value: "services" },
            { label: "Marquiz", value: "marquiz" },
            { label: "Дизайн-отдел", value: "benefits" },
            { label: "Примеры мерча", value: "leadCta" },
            { label: "Категории товаров", value: "partnerProducts" },
            { label: "Срочный заказ", value: "urgentOrder" },
            { label: "Отзывы", value: "reviews" },
            { label: "Этапы работы", value: "workStages" },
            { label: "Преимущества перед конкурентами", value: "features" },
            { label: "FAQ", value: "faq" },
            { label: "Нижний CTA", value: "requestCta" },
          ],
        },
        {
          name: "enabled",
          type: "checkbox",
          label: "Показывать блок",
          defaultValue: true,
        },
      ],
    },
  ],
});
