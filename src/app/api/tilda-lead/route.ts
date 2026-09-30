import { NextResponse } from "next/server";
import { sendBitrixLead } from "@/shared/lib/request-mail/send-bitrix-lead";
import type { GeneralRequestPayload } from "@/shared/lib/request-mail/types";

export const dynamic = "force-dynamic";

const ALLOWED_ORIGIN = process.env.TILDA_LEAD_ORIGIN?.trim() || "https://lead.dm-merch.ru";
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const buckets = new Map<string, { count: number; resetAt: number }>();

function headers(origin: string | null) {
  return {
    "Access-Control-Allow-Origin": origin === ALLOWED_ORIGIN ? ALLOWED_ORIGIN : "null",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
}

function text(value: unknown, max = 1000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function clientIp(request: Request) {
  return request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, { status: 204, headers: headers(request.headers.get("origin")) });
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const responseHeaders = headers(origin);
  if (origin !== ALLOWED_ORIGIN) return NextResponse.json({ ok: false, error: "Недопустимый источник запроса." }, { status: 403, headers: responseHeaders });
  const now = Date.now();
  const key = clientIp(request);
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
  else if (++bucket.count > MAX_REQUESTS) return NextResponse.json({ ok: false, error: "Слишком много заявок." }, { status: 429, headers: responseHeaders });

  try {
    const body = await request.json() as Record<string, unknown>;
    const name = text(body.name, 200);
    const phone = text(body.phone, 80);
    if (!name || !phone) return NextResponse.json({ ok: false, error: "Необходимо указать имя и телефон." }, { status: 400, headers: responseHeaders });
    const products = Array.isArray(body.products) ? body.products.map((item) => text(item, 200)).filter(Boolean).slice(0, 50) : [];
    const requestedPosition = text(body.requested_position, 1000);
    const quantity = text(body.quantity_from, 100);
    const payload: GeneralRequestPayload = {
      type: "general", source: "tilda-lead", pagePath: "/tilda-lead", name, phone,
      company: text(body.company, 300) || undefined,
      message: requestedPosition,
      quantity: quantity ? Number(quantity.replace(/\s/g, "")) || undefined : undefined,
      context: products.map((product, index) => `${index + 1}. ${product}`).join("\n"),
    };
    const result = await sendBitrixLead(payload);
    if (result.skipped) throw new Error("BITRIX24_LEAD_ADD_URL is not configured");
    return NextResponse.json({ ok: true, leadId: result.leadId }, { headers: responseHeaders });
  } catch (error) {
    console.error("[tilda-lead] failed", error);
    return NextResponse.json({ ok: false, error: "Не удалось отправить заявку." }, { status: 500, headers: responseHeaders });
  }
}
