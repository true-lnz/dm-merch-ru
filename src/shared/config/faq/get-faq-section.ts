import "server-only";

import { getPayloadClient } from "@/shared/lib/payload/get-payload-client";
import { isPopulatedMedia } from "@/shared/lib/payload/media";
import { unstable_noStore as noStore } from "next/cache";

import { defaultFaqSection, type FaqItem, type FaqSectionData, type FaqSectionImage } from "./faq";

function normalizeMultilineText(value: string): string {
  return value.replace(/\r\n?/g, "\n").trim();
}

function normalizeFaqItem(value: unknown): FaqItem | null {
  if (typeof value !== "object" || value === null) {
    return null;
  }

  const item = value as Partial<Record<keyof FaqItem, unknown>>;
  const question = typeof item.question === "string" ? item.question.trim() : "";
  const answer = typeof item.answer === "string" ? normalizeMultilineText(item.answer) : "";

  if (!question || !answer) {
    return null;
  }

  return {
    question,
    answer,
  };
}

function mapFaqImage(value: unknown, fallback: FaqSectionImage): FaqSectionImage {
  if (!isPopulatedMedia(value) || typeof value.url !== "string" || !value.url) {
    return fallback;
  }

  return {
    url: value.url,
    alt: typeof value.alt === "string" ? value.alt : fallback.alt,
  };
}

export async function getFaqSection(): Promise<FaqSectionData | null> {
  noStore();

  try {
    const payload = (await getPayloadClient()) as any;
    const global = await payload.findGlobal({
      slug: "faq",
      depth: 1,
    });

    const title = typeof global.title === "string" ? normalizeMultilineText(global.title) : "";
    const items = Array.isArray(global.items) ? global.items.map(normalizeFaqItem).filter((item: FaqItem | null): item is FaqItem => item !== null) : [];

    if (!title || items.length === 0) {
      return null;
    }

    return {
      image: mapFaqImage(global.image, defaultFaqSection.image),
      title,
      items,
    };
  } catch {
    return null;
  }
}
