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

export const HomePage = createSettingsPageCollection({
  slug: "home-page",
  singular: "Главная: настройки",
  plural: "Главная: настройки",
  adminGroup: "Страница Главная",
  previewPath: "/",
  extraFields: [
    {
      name: "hero",
      type: "group",
      label: "Hero-блок",
      fields: [
        textField("title", "Заголовок"),
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
          label: "Преимущества",
          minRows: 1,
          labels: {
            singular: "Преимущество",
            plural: "Преимущества",
          },
          fields: [textareaField("text", "Текст")],
        },
      ],
    },
    {
      name: "digest",
      type: "group",
      label: "Дайджест направлений",
      fields: [
        textField("title", "Заголовок"),
        textareaField("description", "Описание"),
        {
          name: "cards",
          type: "array",
          label: "Карточки дайджеста",
          minRows: 1,
          labels: {
            singular: "Карточка",
            plural: "Карточки дайджеста",
          },
          fields: [
            {
              name: "cardKey",
              type: "select",
              label: "Идентификатор карточки",
              required: true,
              options: [
                { label: "Подарки для партнеров", value: "partners" },
                { label: "Мерч для мероприятий", value: "events" },
                { label: "Мерч для команды", value: "team" },
                { label: "Сувенирная продукция", value: "souvenirs" },
                { label: "Корпоративная униформа", value: "uniform" },
                { label: "Корпоративная спецодежда", value: "workwear" },
              ],
            },
            {
              name: "variant",
              type: "select",
              label: "Тип карточки",
              required: true,
              defaultValue: "default",
              options: [
                { label: "Обычная", value: "default" },
                { label: "Расширенная", value: "wild" },
              ],
            },
            textField("title", "Заголовок"),
            textareaField("description", "Описание"),
            textareaField("mobileDescription", "Короткое описание для мобильной версии", false),
            textareaField("details", "Дополнительный текст", false),
            textField("backgroundImageSrc", "Фон расширенной карточки", false),
            mediaUploadField("image", "Изображение"),
          ],
        },
      ],
    },
    {
      name: "results",
      type: "group",
      label: "Блок кейсов с результатом",
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
      label: "Блок услуг",
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
      label: "Блок преимуществ: дизайн-отдел",
      fields: [textField("title", "Заголовок"), textareaField("description", "Описание", false), featureCardsArrayField("items", "Карточки")],
    },
    {
      name: "leadCta",
      type: "group",
      label: "Блок отправки примеров",
      fields: [textField("title", "Заголовок"), textareaField("description", "Описание"), mediaUploadField("image", "Изображение"), textField("submitLabel", "Текст кнопки")],
    },
    {
      name: "partnerProducts",
      type: "group",
      label: "Блок каталожных направлений",
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
            textField("href", "Ссылка"),
          ],
        },
      ],
    },
    {
      name: "urgentOrder",
      type: "group",
      label: "Блок срочного заказа",
      fields: [
        textField("title", "Заголовок"),
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
      label: "Отзывы",
      fields: [
        textField("title", "Заголовок"),
        {
          name: "items",
          type: "array",
          label: "Отзывы",
          minRows: 1,
          labels: {
            singular: "Отзыв",
            plural: "Отзывы",
          },
          fields: [
            textField("company", "Компания"),
            textField("name", "Имя"),
            textField("role", "Роль"),
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
      label: "Этапы работы",
      fields: [
        textField("title", "Заголовок"),
        textareaField("description", "Описание"),
        {
          name: "items",
          type: "array",
          label: "Этапы",
          minRows: 1,
          labels: {
            singular: "Этап",
            plural: "Этапы",
          },
          fields: [textField("number", "Номер"), textField("title", "Заголовок"), textareaField("description", "Описание", true, 4)],
        },
      ],
    },
    {
      name: "features",
      type: "group",
      label: "Блок преимуществ перед конкурентами",
      fields: [textField("title", "Заголовок"), textareaField("description", "Описание", false), featureCardsArrayField("items", "Карточки")],
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
