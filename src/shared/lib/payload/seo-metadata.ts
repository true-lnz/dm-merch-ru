import type { Metadata } from "next";

import { DEFAULT_SERVER_URL } from "@/payload/preview";
import { mapCmsImage } from "@/shared/lib/payload/media";

type SEOFields = {
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
} | null | undefined;

function trimText(value: null | string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function toAbsoluteURL(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return new URL(value.startsWith("/") ? value : `/${value}`, DEFAULT_SERVER_URL).toString();
}

function getKeywords(value: string | undefined): string[] | undefined {
  if (!value) {
    return undefined;
  }

  const keywords = value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return keywords.length > 0 ? keywords : undefined;
}

function getMetadataImage(meta: SEOFields, fallbackAlt: string) {
  const image = mapCmsImage(meta?.image, fallbackAlt);

  if (!image) {
    return null;
  }

  return {
    alt: trimText(meta?.openGraph?.imageAlt) || trimText(meta?.twitter?.imageAlt) || image.alt,
    height: image.height,
    url: toAbsoluteURL(image.url) || image.url,
    width: image.width,
  };
}

export function buildSEOMetadata(args: {
  fallbackDescription?: string;
  fallbackImage?: {
    alt: string;
    url: string;
  };
  fallbackOpenGraph?: Metadata["openGraph"];
  fallbackTitle: string;
  fallbackTwitter?: Metadata["twitter"];
  meta?: SEOFields;
  pathname?: string;
  socialType?: "article" | "website";
}): Metadata {
  const title = trimText(args.meta?.title) || args.fallbackTitle;
  const description = trimText(args.meta?.description) || args.fallbackDescription;
  const canonical = toAbsoluteURL(trimText(args.meta?.canonicalUrl) || args.pathname);
  const image = getMetadataImage(args.meta, title);
  const fallbackOpenGraph = args.fallbackOpenGraph as
    | (NonNullable<Metadata["openGraph"]> & {
        type?: "article" | "website";
        url?: string;
      })
    | undefined;
  const fallbackTwitter = args.fallbackTwitter as
    | (NonNullable<Metadata["twitter"]> & {
        card?: "summary" | "summary_large_image";
      })
    | undefined;
  const fallbackImage = args.fallbackImage
    ? {
        alt: args.fallbackImage.alt,
        url: toAbsoluteURL(args.fallbackImage.url) || args.fallbackImage.url,
      }
    : null;
  const sharedImage = image || fallbackImage;

  return {
    title,
    description,
    alternates: canonical
      ? {
          canonical,
        }
      : undefined,
    keywords: getKeywords(trimText(args.meta?.keywords)),
    robots:
      args.meta?.robots?.noIndex || args.meta?.robots?.noFollow
        ? {
            follow: args.meta?.robots?.noFollow ? false : undefined,
            index: args.meta?.robots?.noIndex ? false : undefined,
          }
        : undefined,
    openGraph: {
      ...fallbackOpenGraph,
      title: trimText(args.meta?.openGraph?.title) || title,
      description: trimText(args.meta?.openGraph?.description) || description || fallbackOpenGraph?.description,
      type: args.meta?.openGraph?.type || args.socialType || fallbackOpenGraph?.type,
      url: canonical || fallbackOpenGraph?.url,
      images: sharedImage
        ? [
            {
              ...sharedImage,
              alt: trimText(args.meta?.openGraph?.imageAlt) || sharedImage.alt,
            },
          ]
        : fallbackOpenGraph?.images,
    },
    twitter: {
      ...fallbackTwitter,
      card: args.meta?.twitter?.card || fallbackTwitter?.card || "summary_large_image",
      title: trimText(args.meta?.twitter?.title) || title,
      description: trimText(args.meta?.twitter?.description) || description || fallbackTwitter?.description,
      images: sharedImage ? [sharedImage.url] : fallbackTwitter?.images,
    },
  };
}
