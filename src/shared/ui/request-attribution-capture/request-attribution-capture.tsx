"use client";

import { getRequestAttribution } from "@/shared/lib/request-mail/attribution";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/** Captures campaign parameters before the visitor reaches a form. */
export function RequestAttributionCapture() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    getRequestAttribution();
  }, [pathname, searchParams]);

  return null;
}
