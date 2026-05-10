import "server-only";

import { getPayloadClient } from "@/shared/lib/payload/get-payload-client";
import { cache } from "react";

import { defaultRequestCtaContent, type RequestCtaContent } from "./request-cta";

function normalizeMultilineText(value: string) {
  return value.replace(/\r\n?/g, "\n").trim();
}

export const getRequestCta = cache(async (): Promise<RequestCtaContent> => {
  try {
    const payload = (await getPayloadClient()) as any;
    const global = await payload.findGlobal({
      slug: "request-cta",
      depth: 0,
    });

    const title = typeof global.title === "string" ? normalizeMultilineText(global.title) : "";
    const description = typeof global.description === "string" ? normalizeMultilineText(global.description) : "";

    return {
      title: title || defaultRequestCtaContent.title,
      description: description || defaultRequestCtaContent.description,
    };
  } catch {
    return defaultRequestCtaContent;
  }
});
