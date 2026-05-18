import "server-only";

import type { Metadata } from "next";
import { cache } from "react";

import { buildSEOMetadata } from "./seo-metadata";
import { getPayloadClient } from "./get-payload-client";
import { mapCmsImage } from "./media";

type CatalogProductsPageDocument = {
  id: number | string;
  heroImages?: {
    leftTop?: unknown;
  } | null;
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

type CatalogProductsPagePayloadClient = {
  find: (args: {
    collection: "catalog-products-page";
    depth: number;
    limit: number;
    pagination: boolean;
  }) => Promise<PayloadFindResult<CatalogProductsPageDocument>>;
};

const DEFAULT_TITLE = "Каталог продукции";
const DEFAULT_DESCRIPTION = "Посадочная страница каталога продукции: статьи, категории и подкатегории мерча и корпоративных подарков.";
const DEFAULT_IMAGE = {
  alt: "Каталог продукции Держи Марку!",
  url: "/catalog-products/1.webp",
};

export const getCatalogProductsPageDocument = cache(async (): Promise<CatalogProductsPageDocument | null> => {
  try {
    const payload = (await getPayloadClient()) as CatalogProductsPagePayloadClient;
    const result = await payload.find({
      collection: "catalog-products-page",
      depth: 1,
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
});

export async function getCatalogProductsPageMetadata(): Promise<Metadata> {
  const page = await getCatalogProductsPageDocument();
  const heroImage = mapCmsImage(page?.heroImages?.leftTop, DEFAULT_IMAGE.alt);

  return buildSEOMetadata({
    fallbackTitle: DEFAULT_TITLE,
    fallbackDescription: DEFAULT_DESCRIPTION,
    fallbackImage: {
      alt: heroImage?.alt || DEFAULT_IMAGE.alt,
      url: heroImage?.url || DEFAULT_IMAGE.url,
    },
    meta: page?.meta,
    pathname: "/catalog-products",
    socialType: "website",
  });
}
