import type { Block, Field } from "payload";

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
          { label: "Акцент", value: "highlighted" },
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
    fields: [
      optionalTextField("title", "Заголовок"),
      textParagraphsField(),
    ],
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
    fields: [
      textField("title", "Заголовок"),
      textareaField("excerpt", "Описание"),
      imageField("image", "Изображение"),
    ],
  };
}

export const blogPostBlocks: Block[] = [
  {
    slug: "text-columns",
    labels: { singular: "Текст в колонках", plural: "Текст в колонках" },
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
    fields: [
      textField("title", "Заголовок"),
      optionalTextField("backgroundAssetUrl", "Фон (URL)"),
      miniCardsField(),
    ],
  },
  {
    slug: "text-mini-cards",
    labels: { singular: "Текст + мини-карточки", plural: "Текст + мини-карточки" },
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
          { label: "Two columns", value: "two-columns" },
          { label: "Three columns middle", value: "three-columns-middle" },
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
    labels: { singular: "Типы мерча", plural: "Типы мерча" },
    fields: [textField("title", "Заголовок"), merchCardsField()],
  },
  {
    slug: "checklist",
    labels: { singular: "Чек-лист", plural: "Чек-листы" },
    fields: [
      textField("title", "Заголовок"),
      optionalTextField("backgroundAssetUrl", "Фон (URL)"),
      checklistItemsField(),
    ],
  },
  {
    slug: "task-goals",
    labels: { singular: "Цели и задачи", plural: "Цели и задачи" },
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
      optionalTextField("backgroundAssetUrl", "Фон (URL)"),
      miniCardsField(),
      {
        name: "note",
        type: "textarea",
        label: "Примечание",
      },
    ],
  },
  {
    slug: "text-image",
    labels: { singular: "Текст + изображение", plural: "Текст + изображение" },
    fields: [
      textField("title", "Заголовок"),
      paragraphItemsField(),
      imageField("image", "Изображение"),
      {
        name: "variant",
        type: "select",
        label: "Вариант",
        options: [
          { label: "Default", value: "default" },
          { label: "Accent", value: "accent" },
        ],
      },
      optionalTextField("imageAspectRatio", "Aspect ratio"),
    ],
  },
  {
    slug: "numbered-mini-cards",
    labels: { singular: "Нумерованные карточки", plural: "Нумерованные карточки" },
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
          { label: "Two columns", value: "two-columns" },
          { label: "Three columns middle", value: "three-columns-middle" },
        ],
      },
      {
        name: "descriptionPlacement",
        type: "select",
        label: "Положение описания",
        options: [
          { label: "Side", value: "side" },
          { label: "Bottom", value: "bottom" },
        ],
      },
      {
        name: "variant",
        type: "select",
        label: "Вариант",
        options: [
          { label: "Accent", value: "accent" },
          { label: "Light", value: "light" },
        ],
      },
      checklistItemsField(),
      {
        name: "note",
        type: "textarea",
        label: "Примечание",
      },
    ],
  },
  {
    slug: "budget-optimization",
    labels: { singular: "Оптимизация бюджета", plural: "Оптимизация бюджета" },
    fields: [
      textField("title", "Заголовок"),
      textareaField("description", "Описание"),
      checklistItemsField(),
      imageField("image", "Изображение"),
    ],
  },
  {
    slug: "text-columns-image",
    labels: { singular: "Колонки + широкое изображение", plural: "Колонки + широкое изображение" },
    fields: [textColumnsField(), imageField("image", "Изображение"), optionalTextField("imageAspectRatio", "Aspect ratio")],
  },
  {
    slug: "text-split",
    labels: { singular: "Текст 50/50", plural: "Текст 50/50" },
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
    fields: [textField("title", "Заголовок"), textParagraphsField(), imageField("image", "Изображение")],
  },
];
