import "server-only";

import { draftMode } from "next/headers";

import { getPayloadClient } from "./get-payload-client";

type FindResult<TDoc> = {
  docs?: TDoc[];
};

type PagesPayloadClient = {
  find: (args: {
    collection: "pages";
    depth: number;
    limit: number;
    pagination: boolean;
    draft?: boolean;
    overrideAccess?: boolean;
    where: {
      slug: {
        equals: ManagedPageSlug;
      };
    };
  }) => Promise<FindResult<ManagedPageDocument>>;
};

export type ManagedPageSlug = "blog" | "catalog" | "catalog-products" | "cases" | "home";

export type ManagedPageDocument = {
  id: number | string;
  title: string;
  slug: ManagedPageSlug;
  heroTitle?: null | string;
  intro?: null | string;
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

export async function isDraftModeEnabled(): Promise<boolean> {
  return (await draftMode()).isEnabled;
}

export async function getManagedPageBySlug(
  slug: ManagedPageSlug,
  options?: {
    draft?: boolean;
  },
): Promise<ManagedPageDocument | null> {
  try {
    const payload = (await getPayloadClient()) as PagesPayloadClient;
    const result = await payload.find({
      collection: "pages",
      depth: 1,
      draft: options?.draft,
      limit: 1,
      overrideAccess: options?.draft,
      pagination: false,
      where: {
        slug: {
          equals: slug,
        },
      },
    });

    const doc = Array.isArray(result?.docs) ? result.docs[0] : null;

    if (!doc || typeof doc.slug !== "string" || typeof doc.title !== "string") {
      return null;
    }

    return doc as ManagedPageDocument;
  } catch {
    return null;
  }
}
