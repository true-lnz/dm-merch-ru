"use client";

import { RefreshRouteOnSave } from "@payloadcms/live-preview-react";
import { useRouter } from "next/navigation";

const fallbackServerURL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

export function PreviewRefresh() {
  const router = useRouter();
  const serverURL = typeof window === "undefined" ? fallbackServerURL : window.location.origin;

  return <RefreshRouteOnSave refresh={() => router.refresh()} serverURL={serverURL} />;
}
