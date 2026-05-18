import "server-only";

import type { Metadata } from "next";
import { cache } from "react";

import { buildSEOMetadata } from "./seo-metadata";
import { getPayloadClient } from "./get-payload-client";
import { mapCmsImage, type MappedCmsImage } from "./media";

export type ContactsMapSettings = {
  defaultZoom: number;
  officeCoordinates: [number, number];
  yandexMapsApiKey: string;
};

export type ContactsPageData = {
  heroImage: MappedCmsImage;
  mapSettings: ContactsMapSettings;
};

const defaultContactsHeroImage: MappedCmsImage = {
  url: "/contacts/img_contacts_cover.webp",
  alt: "Команда в фирменном мерче",
  width: 1600,
  height: 1200,
};

const defaultContactsMapSettings: ContactsMapSettings = {
  officeCoordinates: [54.756355, 56.023118],
  defaultZoom: 16,
  yandexMapsApiKey: "120f734b-f91c-4c91-ab98-3b5561794961",
};

type ContactsPageDocument = {
  id: number | string;
  defaultZoom?: null | number;
  heroImage?: unknown;
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
  officeLatitude?: null | number;
  officeLongitude?: null | number;
  yandexMapsApiKey?: null | string;
};

export const getContactsPageDocument = cache(async (): Promise<ContactsPageDocument | null> => {
  try {
    const payload = (await getPayloadClient()) as any;
    const result = await payload.find({
      collection: "contacts-page",
      depth: 1,
      limit: 1,
      pagination: false,
    });
    const doc = (Array.isArray(result?.docs) ? result.docs[0] : null) as ContactsPageDocument | null;

    if (!doc || typeof doc.id === "undefined") {
      return null;
    }

    return doc;
  } catch {
    return null;
  }
});

export const getContactsPageData = cache(async (): Promise<ContactsPageData> => {
  const doc = await getContactsPageDocument();

  if (!doc) {
    return {
      heroImage: defaultContactsHeroImage,
      mapSettings: defaultContactsMapSettings,
    };
  }

  const officeLatitude =
    typeof doc.officeLatitude === "number" && Number.isFinite(doc.officeLatitude)
      ? doc.officeLatitude
      : defaultContactsMapSettings.officeCoordinates[0];
  const officeLongitude =
    typeof doc.officeLongitude === "number" && Number.isFinite(doc.officeLongitude)
      ? doc.officeLongitude
      : defaultContactsMapSettings.officeCoordinates[1];
  const heroImage = mapCmsImage(doc.heroImage, "Команда в фирменном мерче");

  return {
    heroImage: heroImage ?? defaultContactsHeroImage,
    mapSettings: {
      officeCoordinates: [officeLatitude, officeLongitude],
      defaultZoom:
        typeof doc.defaultZoom === "number" && Number.isFinite(doc.defaultZoom) ? doc.defaultZoom : defaultContactsMapSettings.defaultZoom,
      yandexMapsApiKey:
        typeof doc.yandexMapsApiKey === "string" && doc.yandexMapsApiKey
          ? doc.yandexMapsApiKey
          : defaultContactsMapSettings.yandexMapsApiKey,
    },
  };
});

export const getContactsMapSettings = cache(async (): Promise<ContactsMapSettings> => {
  const { mapSettings } = await getContactsPageData();
  return mapSettings;
});

export async function getContactsPageMetadata(): Promise<Metadata> {
  const page = await getContactsPageDocument();
  const heroImage = mapCmsImage(page?.heroImage, defaultContactsHeroImage.alt);

  return buildSEOMetadata({
    fallbackTitle: typeof page?.heroTitle === "string" && page.heroTitle.trim() ? page.heroTitle : "Контакты",
    fallbackDescription: "Контакты Держи Марку!: адрес, телефон, email и карта офиса.",
    fallbackImage: {
      alt: heroImage?.alt || defaultContactsHeroImage.alt,
      url: heroImage?.url || defaultContactsHeroImage.url,
    },
    meta: page?.meta,
    pathname: "/contacts",
    socialType: "website",
  });
}
