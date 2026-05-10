import type { Block, Field } from "payload";

function blockThumbnail(filename: string, alt: string): NonNullable<Block["admin"]> {
  return {
    images: {
      thumbnail: {
        url: `/blog/section-thumbnails/${filename}`,
        alt,
      },
    },
  };
}

function textField(name: string, label: string): Field {
  return {
    name,
    type: "text",
    label,
    required: true,
  };
}

function textareaField(name: string, label: string): Field {
  return {
    name,
    type: "textarea",
    label,
    required: true,
  };
}

function optionalTextField(name: string, label: string): Field {
  return {
    name,
    type: "text",
    label,
  };
}

function imageField(name: string, label: string): Field {
  return {
    name,
    type: "upload",
    relationTo: "media",
    label,
    required: true,
  };
}

function paragraphItemsField(name = "paragraphs", label = "Параграфы"): Field {
  return {
    name,
    type: "array",
    label,
    required: true,
    minRows: 1,
    fields: [
      {
        name: "text",
        type: "textarea",
        label: "Текст",
        required: true,
      },
      {
        name: "variant",
        type: "select",
        label: "Вариант",
        options: [
          { label: "Обычный", value: "default" },
          { label: "Акцентный (серая подложка)", value: "highlighted" },
        ],
      },
    ],
  };
}

function textParagraphsField(name = "paragraphs", label = "Параграфы"): Field {
  return {
    name,
    type: "array",
    label,
    required: true,
    minRows: 1,
    fields: [
      {
        name: "text",
        type: "textarea",
        label: "Текст",
        required: true,
      },
    ],
  };
}

function textColumnsField(): Field {
  return {
    name: "columns",
    type: "array",
    label: "Колонки",
    required: true,
    minRows: 1,
    fields: [optionalTextField("title", "Заголовок"), textParagraphsField()],
  };
}

function miniCardsField(name = "cards", label = "Карточки"): Field {
  return {
    name,
    type: "array",
    label,
    required: true,
    minRows: 1,
    fields: [textField("title", "Заголовок"), textareaField("text", "Текст")],
  };
}

function checklistItemsField(name = "items", label = "Пункты"): Field {
  return {
    name,
    type: "array",
    label,
    required: true,
    minRows: 1,
    fields: [textField("number", "Номер"), textareaField("text", "Текст")],
  };
}

function merchCardsField(): Field {
  return {
    name: "cards",
    type: "array",
    label: "Карточки",
    required: true,
    minRows: 1,
    fields: [textField("title", "Заголовок"), textareaField("excerpt", "Описание"), imageField("image", "Изображение")],
  };
}

export const blogPostBlocks: Block[] = [
  {
    slug: "text-columns",
    labels: { singular: "Текст в колонках", plural: "Текст в колонках" },
    admin: blockThumbnail("text-columns.jpg", "Текст в колонках"),
    fields: [
      optionalTextField("title", "Заголовок"),
      {
        name: "hideColumnTitles",
        type: "checkbox",
        label: "Скрыть заголовки колонок",
      },
      textColumnsField(),
    ],
  },
  {
    slug: "accent-mini-cards",
    labels: { singular: "Акцентные мини-карточки", plural: "Акцентные мини-карточки" },
    admin: blockThumbnail("accent-mini-cards.jpg", "Акцентные мини-карточки"),
    fields: [textField("title", "Заголовок"), optionalTextField("backgroundAssetUrl", "Фон (URL)"), miniCardsField()],
  },
  {
    slug: "text-mini-cards",
    labels: { singular: "Текст + мини-карточки", plural: "Текст + мини-карточки" },
    admin: blockThumbnail("text-mini-cards.jpg", "Текст + мини-карточки"),
    fields: [
      textField("title", "Заголовок"),
      {
        name: "description",
        type: "textarea",
        label: "Описание",
      },
      {
        name: "descriptionLayout",
        type: "select",
        label: "Лэйаут описания",
        options: [
          { label: "Две колонки", value: "two-columns" },
          { label: "Три колонки", value: "three-columns-middle" },
        ],
      },
      miniCardsField(),
      {
        name: "conclusion",
        type: "textarea",
        label: "Вывод",
      },
    ],
  },
  {
    slug: "merch-types",
    labels: { singular: "Заголовок + три карточки", plural: "Заголовок + тТри карточки" },
    admin: blockThumbnail("merch-types.jpg", "Заголовок + три карточки"),
    fields: [textField("title", "Заголовок"), merchCardsField()],
  },
  {
    slug: "checklist",
    labels: { singular: "Чек-лист", plural: "Чек-листы" },
    admin: blockThumbnail("checklist.jpg", "Чек-лист"),
    fields: [textField("title", "Заголовок"), optionalTextField("backgroundAssetUrl", "Фон (URL)"), checklistItemsField()],
  },
  {
    slug: "task-goals",
    labels: { singular: "Цели и задачи", plural: "Цели и задачи" },
    admin: blockThumbnail("task-goals.jpg", "Цели и задачи"),
    fields: [
      textField("title", "Заголовок"),
      textareaField("description", "Описание"),
      optionalTextField("label", "Плашка"),
      {
        name: "columns",
        type: "select",
        label: "Колонки",
        options: [
          { label: "2", value: "2" },
          { label: "3", value: "3" },
        ],
      },
      miniCardsField(),
      {
        name: "note",
        type: "textarea",
        label: "Примечание (текст снизу)",
      },
    ],
  },
  {
    slug: "text-image",
    labels: { singular: "Текст + изображение", plural: "Текст + изображение" },
    admin: blockThumbnail("text-image.jpg", "Текст + изображение"),
    fields: [
      textField("title", "Заголовок"),
      paragraphItemsField(),
      imageField("image", "Изображение"),
      {
        name: "variant",
        type: "select",
        label: "Вариант",
        options: [
          { label: "Обычный", value: "default" },
          { label: "Акцентный (синий фон)", value: "accent" },
        ],
      },
    ],
  },
  {
    slug: "numbered-mini-cards",
    labels: { singular: "Нумерованные карточки", plural: "Нумерованные карточки" },
    admin: blockThumbnail("numbered-mini-cards.jpg", "Нумерованные карточки"),
    fields: [
      textField("title", "Заголовок"),
      {
        name: "description",
        type: "textarea",
        label: "Описание",
      },
      {
        name: "descriptionLayout",
        type: "select",
        label: "Лэйаут описания",
        options: [
          { label: "Две колонки", value: "two-columns" },
          { label: "Три колонки", value: "three-columns-middle" },
        ],
      },
      {
        name: "descriptionPlacement",
        type: "select",
        label: "Положение описания",
        options: [
          { label: "Сбоку", value: "side" },
          { label: "Снизу", value: "bottom" },
        ],
      },
      {
        name: "variant",
        type: "select",
        label: "Вариант",
        options: [
          { label: "Акцентный (синий фон)", value: "accent" },
          { label: "Светлый (белый фон)", value: "light" },
        ],
      },
      checklistItemsField(),
      {
        name: "note",
        type: "textarea",
        label: "Примечание (текст снизу)",
      },
    ],
  },
  {
    slug: "budget-optimization",
    labels: { singular: "Нумерованный список + изображение", plural: "Нумерованный список + изображение" },
    admin: blockThumbnail("budget-optimization.jpg", "Нумерованный список + изображение"),
    fields: [textField("title", "Заголовок"), textareaField("description", "Описание"), checklistItemsField(), imageField("image", "Изображение")],
  },
  {
    slug: "text-columns-image",
    labels: { singular: "Колонки + широкое изображение", plural: "Колонки + широкое изображение" },
    admin: blockThumbnail("text-columns-image.jpg", "Колонки + широкое изображение"),
    fields: [textColumnsField(), imageField("image", "Изображение")],
  },
  {
    slug: "text-split",
    labels: { singular: "Заголовок + текст 50/50", plural: "Заголовок + текст 50/50" },
    admin: blockThumbnail("text-split.jpg", "Заголовок + текст 50/50"),
    fields: [
      textField("title", "Заголовок"),
      {
        name: "leftParagraphs",
        type: "array",
        label: "Левая колонка",
        required: true,
        minRows: 1,
        fields: [{ name: "text", type: "textarea", label: "Текст", required: true }],
      },
      {
        name: "rightParagraphs",
        type: "array",
        label: "Правая колонка",
        required: true,
        minRows: 1,
        fields: [{ name: "text", type: "textarea", label: "Текст", required: true }],
      },
    ],
  },
  {
    slug: "summary",
    labels: { singular: "Итог", plural: "Итоги" },
    admin: blockThumbnail("summary.jpg", "Итог"),
    fields: [textField("title", "Заголовок"), textParagraphsField(), imageField("image", "Изображение")],
  },
];
