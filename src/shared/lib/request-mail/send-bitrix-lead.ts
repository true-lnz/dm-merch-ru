import type { GeneralRequestPayload, RequestPayload, WishlistRequestPayload } from "./types";
import { formatRub, formatWishlistLineItems, requestSourceLabels } from "./request-formatters";

const BITRIX_REQUEST_TYPE_SITE_ID = "44";

type BitrixLeadFields = {
  TITLE: string;
  NAME: string;
  PHONE: Array<{ VALUE: string; VALUE_TYPE: "WORK" }>;
  EMAIL?: Array<{ VALUE: string; VALUE_TYPE: "WORK" }>;
  COMMENTS: string;
  UF_CRM_1778571350: string;
  OPPORTUNITY?: number;
  CURRENCY_ID?: "RUB";
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
  return payload.type === "wishlist" ? `Заявка на КП от ${payload.name}` : `Заявка от ${payload.name}`;
}

function buildGeneralComments(payload: GeneralRequestPayload) {
  const lines = [
    `Источник: ${requestSourceLabels[payload.source]}`,
    "",
    "Комментарий клиента:",
    payload.message || "Без комментария",
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

  if (payload.email) {
    fields.EMAIL = [{ VALUE: payload.email, VALUE_TYPE: "WORK" }];
  }

  if (payload.type === "wishlist") {
    fields.OPPORTUNITY = payload.totalRub;
    fields.CURRENCY_ID = "RUB";
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
