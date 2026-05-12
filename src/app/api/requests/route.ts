import type { RequestErrorResponse, RequestPayload, RequestSuccessResponse, WishlistRequestItem } from "@/shared/lib/request-mail/types";
import { sendRequestEmail } from "@/shared/lib/request-mail/send-request-email";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const PHONE_PATTERN = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REQUEST_SOURCES = new Set<RequestPayload["source"]>([
  "request-cta",
  "home-lead-cta",
  "request-dialog",
  "catalog-work-stages",
  "catalog-product-card",
  "home-digest-card",
  "home-hero",
  "catalog-hero",
  "home-results",
  "home-services",
  "home-urgent-order",
  "contacts-page",
  "wishlist-dialog",
]);

function sanitizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function sanitizeOptionalString(value: unknown) {
  const normalized = sanitizeString(value);
  return normalized.length > 0 ? normalized : undefined;
}

function parseQuantity(value: unknown) {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  const parsed = Number(value);

  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new Error("Укажите корректный тираж.");
  }

  return parsed;
}

function parseWishlistItems(value: unknown): WishlistRequestItem[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error("Добавьте товары в вишлист.");
  }

  return value.map((item) => {
    if (!item || typeof item !== "object") {
      throw new Error("Некорректный состав вишлиста.");
    }

    const title = sanitizeString("title" in item ? item.title : "");
    const articleNumber = sanitizeString("articleNumber" in item ? item.articleNumber : "");
    const id = sanitizeString("id" in item ? item.id : "");
    const quantity = Number("quantity" in item ? item.quantity : NaN);
    const unitPriceRub = Number("unitPriceRub" in item ? item.unitPriceRub : NaN);

    if (!id || !title || !articleNumber || !Number.isInteger(quantity) || quantity < 1 || !Number.isFinite(unitPriceRub) || unitPriceRub < 0) {
      throw new Error("Некорректный состав вишлиста.");
    }

    return {
      id,
      title,
      articleNumber,
      quantity,
      unitPriceRub,
    };
  });
}

function buildRedirectUrl(name: string) {
  const params = new URLSearchParams({ name });
  return `/request-success?${params.toString()}`;
}

function buildError(message: string, status = 400) {
  const body: RequestErrorResponse = {
    ok: false,
    error: message,
  };

  return NextResponse.json(body, { status });
}

function validateBasePayload(body: Record<string, unknown>) {
  const name = sanitizeString(body.name);
  const phone = sanitizeString(body.phone);
  const email = sanitizeOptionalString(body.email);
  const message = sanitizeOptionalString(body.message);
  const pagePath = sanitizeString(body.pagePath);
  const source = sanitizeString(body.source);
  const pageTitle = sanitizeOptionalString(body.pageTitle);

  if (!name) {
    throw new Error("Укажите имя.");
  }

  if (!PHONE_PATTERN.test(phone)) {
    throw new Error("Укажите корректный телефон.");
  }

  if (email && !EMAIL_PATTERN.test(email)) {
    throw new Error("Укажите корректный email.");
  }

  if (!pagePath) {
    throw new Error("Не удалось определить страницу заявки.");
  }

  if (!source) {
    throw new Error("Не удалось определить источник заявки.");
  }

  if (!REQUEST_SOURCES.has(source as RequestPayload["source"])) {
    throw new Error("Не удалось определить источник заявки.");
  }

  return {
    name,
    phone,
    email,
    message,
    pagePath,
    source,
    pageTitle,
  };
}

function parseRequestPayload(body: Record<string, unknown>): RequestPayload {
  const type = sanitizeString(body.type);
  const base = validateBasePayload(body);

  if (type === "wishlist") {
    const wishlistItems = parseWishlistItems(body.wishlistItems);
    const totalRub = Number(body.totalRub);

    if (!Number.isFinite(totalRub) || totalRub < 0) {
      throw new Error("Некорректная итоговая сумма вишлиста.");
    }

    return {
      type: "wishlist",
      source: "wishlist-dialog",
      pagePath: base.pagePath,
      pageTitle: base.pageTitle,
      name: base.name,
      phone: base.phone,
      email: base.email,
      message: base.message,
      wishlistItems,
      totalRub,
    };
  }

  if (type !== "general") {
    throw new Error("Неизвестный тип заявки.");
  }

  return {
      type: "general",
      source: base.source as RequestPayload["source"],
      pagePath: base.pagePath,
    pageTitle: base.pageTitle,
    name: base.name,
    phone: base.phone,
    email: base.email,
    message: base.message,
    quantity: parseQuantity(body.quantity),
    context: sanitizeOptionalString(body.context),
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const payload = parseRequestPayload(body);

    await sendRequestEmail(payload);

    const responseBody: RequestSuccessResponse = {
      ok: true,
      redirectTo: buildRedirectUrl(payload.name),
    };

    return NextResponse.json(responseBody);
  } catch (error) {
    if (error instanceof Error) {
      const knownMessages = new Set([
        "Укажите имя.",
        "Укажите корректный телефон.",
        "Укажите корректный email.",
        "Не удалось определить страницу заявки.",
        "Не удалось определить источник заявки.",
        "Некорректный состав вишлиста.",
        "Добавьте товары в вишлист.",
        "Некорректная итоговая сумма вишлиста.",
        "Неизвестный тип заявки.",
        "Укажите корректный тираж.",
      ]);

      if (knownMessages.has(error.message)) {
        return buildError(error.message);
      }

      if (error.message.includes("Connection timeout") || error.message.includes("ECONNREFUSED") || error.message.includes("ETIMEDOUT")) {
        console.error("[requests] smtp connection failed", error);
        return buildError("Почтовый сервер недоступен. Повторите попытку позже.", 503);
      }

      console.error("[requests] failed to send request email", error);
    }

    return buildError("Не удалось отправить заявку. Попробуйте еще раз.", 500);
  }
}
