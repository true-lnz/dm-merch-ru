import { NextResponse } from "next/server";

type ClientErrorBody = {
  kind?: "error" | "unhandledrejection";
  message?: string;
  stack?: string;
  url?: string;
  userAgent?: string;
};

export async function POST(request: Request) {
  let body: ClientErrorBody | null = null;

  try {
    body = (await request.json()) as ClientErrorBody;
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  console.error("[client-error]", {
    kind: body?.kind ?? "unknown",
    message: body?.message ?? "Missing message",
    stack: body?.stack,
    url: body?.url,
    userAgent: body?.userAgent,
  });

  return NextResponse.json({ ok: true });
}
