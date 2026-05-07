import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

function getSafeRedirect(value: string | null): string {
  if (!value || !value.startsWith("/")) {
    return "/";
  }

  return value;
}

export async function GET(request: Request) {
  const redirectTo = getSafeRedirect(new URL(request.url).searchParams.get("redirect"));
  const draft = await draftMode();

  draft.disable();

  return NextResponse.redirect(new URL(redirectTo, request.url));
}
