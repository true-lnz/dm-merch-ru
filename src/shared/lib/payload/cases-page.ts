import "server-only";

import type { Metadata } from "next";

import { buildSEOMetadata } from "./seo-metadata";
import { getPayloadClient } from "./get-payload-client";

type CasesPageDocument = {
  id: number | string;
  heroTitle?: null | string;
  meta?: {
    canonicalUrl?: null | string;
    description?: null | string;
    image?: unknown;
    keywords?: null | string;
    openGraph?: {
      description?: null | string;
      imageAlt?: null | string;
      title?: null | string;
      type?: null | "article" | "website";
    } | null;
    robots?: {
      noFollow?: boolean | null;
      noIndex?: boolean | null;
    } | null;
    title?: null | string;
    twitter?: {
      card?: null | "summary" | "summary_large_image";
      description?: null | string;
      imageAlt?: null | string;
      title?: null | string;
    } | null;
  } | null;
};

type PayloadFindResult<TDoc> = {
  docs?: TDoc[];
};

type CasesPagePayloadClient = {
  find: (args: {
    collection: "cases-page";
    depth: number;
    limit: number;
    pagination: boolean;
  }) => Promise<PayloadFindResult<CasesPageDocument>>;
};

export async function getCasesPageDocument(): Promise<CasesPageDocument | null> {
  try {
    const payload = (await getPayloadClient()) as CasesPagePayloadClient;
    const result = await payload.find({
      collection: "cases-page",
      depth: 0,
      limit: 1,
      pagination: false,
    });
    const doc = Array.isArray(result?.docs) ? result.docs[0] : null;

    if (!doc || typeof doc.id === "undefined") {
      return null;
    }

    return doc;
  } catch {
    return null;
  }
}

export async function getCasesPageMetadata(): Promise<Metadata> {
  const page = await getCasesPageDocument();

  return buildSEOMetadata({
    fallbackDescription: "Кейсы Держи Марку! по корпоративному мерчу и сувенирной продукции.",
    fallbackTitle: typeof page?.heroTitle === "string" && page.heroTitle ? page.heroTitle : "Кейсы",
    meta: page?.meta,
    pathname: "/cases",
    socialType: "website",
  });
}
