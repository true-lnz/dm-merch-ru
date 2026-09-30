import type { RequestAttribution, RequestErrorResponse, RequestPayload, RequestSuccessResponse, WishlistRequestItem } from "@/shared/lib/request-mail/types";
import { getBitrixLeadErrorDetails, sendBitrixLead } from "@/shared/lib/request-mail/send-bitrix-lead";
import { sendRequestEmail } from "@/shared/lib/request-mail/send-request-email";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const PHONE_PATTERN = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parsePositiveIntegerEnv(value: string | undefined, fallback: number) {
  const parsed = Number(value);

  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

const HONEYPOT_FIELD_NAME = "website";
const RATE_LIMIT_WINDOW_MS = parsePositiveIntegerEnv(process.env.REQUEST_RATE_LIMIT_WINDOW_MS, 10 * 60 * 1000);
const RATE_LIMIT_MAX_REQUESTS = parsePositiveIntegerEnv(process.env.REQUEST_RATE_LIMIT_MAX, 5);
const RATE_LIMIT_SWEEP_INTERVAL_MS = 60 * 1000;
const REQUEST_SOURCES = new Set<RequestPayload["source"]>([
  "request-cta",
  "home-lead-cta",
  "request-dialog",
  "catalog-work-stages",
  "catalog-product-card",
  "home-digest-card",
  "home-hero",
  "catalog-hero",
  "catalog-products-hero",
  "tilda-lead",
  "home-results",
  "home-services",
  "home-urgent-order",
  "contacts-page",
  "wishlist-dialog",
]);

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

const requestBuckets = new Map<string, RateLimitBucket>();
let lastRateLimitSweepAt = 0;

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
  const normalizedName = name.trim();
  return normalizedName ? `/request-success?${new URLSearchParams({ name: normalizedName }).toString()}` : "/request-success";
}

function buildError(message: string, status = 400) {
  const body: RequestErrorResponse = {
    ok: false,
    error: message,
  };

  return NextResponse.json(body, { status });
}

function parseAttribution(value: unknown): RequestAttribution | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const input = value as Record<string, unknown>;
  const result: RequestAttribution = {};
  for (const key of ["utmSource", "utmMedium", "utmCampaign", "utmContent", "utmTerm", "landingPage", "referrer"] as const) {
    const normalized = sanitizeOptionalString(input[key]);
    if (normalized) result[key] = normalized.slice(0, key === "landingPage" || key === "referrer" ? 2000 : 500);
  }
  return Object.keys(result).length ? result : undefined;
}

function isHoneypotFilled(body: Record<string, unknown>) {
  return sanitizeString(body[HONEYPOT_FIELD_NAME]).length > 0;
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    const [firstIp] = forwardedFor.split(",");
    const ip = firstIp?.trim();

    if (ip) {
      return ip;
    }
  }

  return request.headers.get("cf-connecting-ip")?.trim() || request.headers.get("x-real-ip")?.trim() || "unknown";
}

function sweepExpiredRateLimitBuckets(now: number) {
  if (now - lastRateLimitSweepAt < RATE_LIMIT_SWEEP_INTERVAL_MS) {
    return;
  }

  lastRateLimitSweepAt = now;

  for (const [key, bucket] of requestBuckets.entries()) {
    if (bucket.resetAt <= now) {
      requestBuckets.delete(key);
    }
  }
}

function checkRequestRateLimit(request: Request) {
  const now = Date.now();
  const clientIp = getClientIp(request);
  const key = `requests:${clientIp}`;

  sweepExpiredRateLimitBuckets(now);

  const existingBucket = requestBuckets.get(key);

  if (!existingBucket || existingBucket.resetAt <= now) {
    requestBuckets.set(key, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  existingBucket.count += 1;

  if (existingBucket.count > RATE_LIMIT_MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((existingBucket.resetAt - now) / 1000)),
    };
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

function validateBasePayload(body: Record<string, unknown>) {
  const name = sanitizeString(body.name);
  const phone = sanitizeString(body.phone);
  const email = sanitizeOptionalString(body.email);
  const message = sanitizeOptionalString(body.message);
  const pagePath = sanitizeString(body.pagePath);
  const source = sanitizeString(body.source);
  const pageTitle = sanitizeOptionalString(body.pageTitle);
  const attribution = parseAttribution(body.attribution);
  const wishlistItems = Array.isArray(body.wishlistItems) && body.wishlistItems.length > 0 ? parseWishlistItems(body.wishlistItems) : undefined;

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
    attribution,
    wishlistItems,
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
      attribution: base.attribution,
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
    wishlistItems: base.wishlistItems,
    quantity: parseQuantity(body.quantity),
      context: sanitizeOptionalString(body.context),
      attribution: base.attribution,
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    if (isHoneypotFilled(body)) {
      const responseBody: RequestSuccessResponse = {
        ok: true,
        redirectTo: buildRedirectUrl(""),
      };

      console.warn("[requests] honeypot blocked request", {
        source: sanitizeOptionalString(body.source),
        pagePath: sanitizeOptionalString(body.pagePath),
        clientIp: getClientIp(request),
      });

      return NextResponse.json(responseBody);
    }

    const rateLimit = checkRequestRateLimit(request);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          ok: false,
          error: "Слишком много заявок. Повторите попытку позже.",
        } satisfies RequestErrorResponse,
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfterSeconds),
          },
        },
      );
    }

    const payload = parseRequestPayload(body);

    await sendRequestEmail(payload);
    try {
      await sendBitrixLead(payload);
    } catch (error) {
      console.error("[requests] failed to create Bitrix24 lead", {
        requestType: payload.type,
        source: payload.source,
        pagePath: payload.pagePath,
        ...getBitrixLeadErrorDetails(error),
      });
    }

    const responseBody: RequestSuccessResponse = {
      ok: true,
      redirectTo: buildRedirectUrl(payload.source === "home-hero" ? "" : payload.name),
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

      console.error("[requests] failed to process request", error);
    }

    return buildError("Не удалось отправить заявку. Попробуйте еще раз.", 500);
  }
}
