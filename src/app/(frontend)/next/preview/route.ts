import { draftMode } from "next/headers";
import { NextResponse } from "next/server";

import { requirePreviewUser } from "@/shared/lib/payload/preview-session";

function getSafeRedirect(value: string | null): string {
  if (!value || !value.startsWith("/")) {
    return "/";
  }

  return value;
}

export async function GET(request: Request) {
  const user = await requirePreviewUser(request.headers);

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const redirectTo = getSafeRedirect(new URL(request.url).searchParams.get("redirect"));
  const draft = await draftMode();

  draft.enable();

  return NextResponse.redirect(new URL(redirectTo, request.url));
}
