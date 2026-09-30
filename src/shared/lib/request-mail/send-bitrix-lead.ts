import type { GeneralRequestPayload, RequestPayload, WishlistRequestPayload } from "./types";
import { formatRub, formatWishlistLineItems, requestSourceLabels } from "./request-formatters";

const BITRIX_REQUEST_TYPE_SITE_ID = "44";

type BitrixLeadFields = {
  TITLE: string;
  NAME: string;
  COMPANY_TITLE?: string;
  PHONE: Array<{ VALUE: string; VALUE_TYPE: "WORK" }>;
  EMAIL?: Array<{ VALUE: string; VALUE_TYPE: "WORK" }>;
  COMMENTS: string;
  SOURCE_ID?: string;
  UF_CRM_1778571350: string;
  OPPORTUNITY?: number;
  CURRENCY_ID?: "RUB";
  UTM_SOURCE?: string;
  UTM_MEDIUM?: string;
  UTM_CAMPAIGN?: string;
  UTM_CONTENT?: string;
  UTM_TERM?: string;
};

type BitrixSuccessResponse = {
  result: number;
};

type BitrixErrorResponse = {
  error?: string;
  error_description?: string;
};

type BitrixConfig = {
  leadAddUrl: string;
  requestTypeId: string;
};

class BitrixLeadError extends Error {
  constructor(
    message: string,
    readonly details?: unknown,
  ) {
    super(message);
  }
}

function getBitrixConfig(): BitrixConfig | null {
  const leadAddUrl = process.env.BITRIX24_LEAD_ADD_URL?.trim();

  if (!leadAddUrl) {
    return null;
  }

  return {
    leadAddUrl,
    requestTypeId: process.env.BITRIX24_SITE_REQUEST_TYPE_ID?.trim() || BITRIX_REQUEST_TYPE_SITE_ID,
  };
}

function normalizePhoneForBitrix(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (digits.length === 11 && (digits.startsWith("7") || digits.startsWith("8"))) {
    return `+7${digits.slice(1)}`;
  }

  if (digits.length === 10) {
    return `+7${digits}`;
  }

  return phone;
}

function buildLeadTitle(payload: RequestPayload) {
  if (payload.type !== "general" || payload.source !== "home-hero") {
    if (payload.type === "general" && payload.source === "tilda-lead") {
      return `Заявка с лид-формы от ${payload.name}`;
    }

    return payload.type === "wishlist" ? `Заявка на КП от ${payload.name}` : `Заявка от ${payload.name}`;
  }

  const utmSource = payload.attribution?.utmSource?.toLowerCase() ?? "";

  if (utmSource.includes("yandex") || utmSource.includes("яндекс") || utmSource === "ya") {
    return "Заявка из Яндекс.Директ";
  }

  if (utmSource.includes("instagram") || utmSource === "insta" || utmSource === "ig") {
    return "Заявка из Instagram";
  }

  const date = new Intl.DateTimeFormat("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Asia/Yekaterinburg",
  }).format(new Date());

  return `Заявка от ${date}`;
}

function buildAttachedWishlistLines(payload: GeneralRequestPayload) {
  if (!payload.wishlistItems?.length) return [];

  const totalRub = payload.wishlistItems.reduce((sum, item) => sum + item.unitPriceRub * item.quantity, 0);
  return [
    "",
    "Также товары в вишлисте:",
    `Позиций в вишлисте: ${payload.wishlistItems.length}`,
    `Итого: ${formatRub(totalRub)}`,
    "",
    "Позиции вишлиста:",
    ...formatWishlistLineItems(payload.wishlistItems),
  ];
}

function buildGeneralComments(payload: GeneralRequestPayload) {
  if (payload.source === "tilda-lead") {
    const tildaLines = [
      payload.context ? `Выбранные товары:\n${payload.context}` : "",
      payload.message ? `Персональные позиции от клиента: ${payload.message}` : "",
      payload.quantity ? `Тираж от:\n${payload.quantity}` : "",
    ];
    return [...tildaLines.filter(Boolean), ...buildAttachedWishlistLines(payload)].join("\n");
  }
  const lines = [
    `Источник: ${requestSourceLabels[payload.source]}`,
    "",
    "Комментарий клиента:",
    payload.message || "Без комментария",
    ...buildAttachedWishlistLines(payload),
  ];

  return lines.filter((line) => line !== undefined).join("\n");
}

function buildWishlistComments(payload: WishlistRequestPayload) {
  const itemLines = formatWishlistLineItems(payload.wishlistItems);
  const lines = [
    `Источник: ${requestSourceLabels[payload.source]}`,
    `Позиций: ${payload.wishlistItems.length}`,
    `Итого: ${formatRub(payload.totalRub)}`,
    "",
    "Позиции вишлиста:",
    ...itemLines,
    "",
    "Комментарий клиента:",
    payload.message || "Без комментария",
  ];

  return lines.join("\n");
}

function buildBitrixLeadFields(payload: RequestPayload, config: BitrixConfig): BitrixLeadFields {
  const fields: BitrixLeadFields = {
    TITLE: buildLeadTitle(payload),
    NAME: payload.name,
    PHONE: [{ VALUE: normalizePhoneForBitrix(payload.phone), VALUE_TYPE: "WORK" }],
    COMMENTS: payload.type === "wishlist" ? buildWishlistComments(payload) : buildGeneralComments(payload),
    UF_CRM_1778571350: config.requestTypeId,
  };

  if (payload.type === "general" && payload.source === "tilda-lead") {
    fields.SOURCE_ID = "WEBFORM";
  }

  if (payload.email) {
    fields.EMAIL = [{ VALUE: payload.email, VALUE_TYPE: "WORK" }];
  }

  if (payload.type === "general" && payload.company) {
    fields.COMPANY_TITLE = payload.company;
  }

  if (payload.type === "wishlist") {
    fields.OPPORTUNITY = payload.totalRub;
    fields.CURRENCY_ID = "RUB";
  }

  if (payload.attribution) {
    const { utmSource, utmMedium, utmCampaign, utmContent, utmTerm } = payload.attribution;
    if (utmSource) fields.UTM_SOURCE = utmSource;
    if (utmMedium) fields.UTM_MEDIUM = utmMedium;
    if (utmCampaign) fields.UTM_CAMPAIGN = utmCampaign;
    if (utmContent) fields.UTM_CONTENT = utmContent;
    if (utmTerm) fields.UTM_TERM = utmTerm;
  }

  return fields;
}

export async function sendBitrixLead(payload: RequestPayload) {
  const config = getBitrixConfig();

  if (!config) {
    return { skipped: true as const };
  }

  const response = await fetch(config.leadAddUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fields: buildBitrixLeadFields(payload, config),
      params: {
        REGISTER_SONET_EVENT: "Y",
      },
    }),
  });

  const responseBody = (await response.json().catch(() => null)) as BitrixSuccessResponse | BitrixErrorResponse | null;

  if (!response.ok) {
    throw new BitrixLeadError(`Bitrix24 HTTP ${response.status}`, responseBody);
  }

  if (!responseBody || typeof responseBody !== "object" || !("result" in responseBody) || typeof responseBody.result !== "number") {
    throw new BitrixLeadError("Bitrix24 returned an unexpected response", responseBody);
  }

  return { skipped: false as const, leadId: responseBody.result };
}

export function getBitrixLeadErrorDetails(error: unknown) {
  if (error instanceof BitrixLeadError) {
    return {
      message: error.message,
      details: error.details,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  return {
    message: "Unknown Bitrix24 error",
  };
}
