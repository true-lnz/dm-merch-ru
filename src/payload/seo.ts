import type { PayloadRequest } from "payload";

import { getServerURLFromRequest, resolveDocumentPath } from "./preview.ts";

function trimText(value: string | null | undefined): string {
  return value?.replace(/\s+/g, " ").trim() || "";
}

export function generateSEOTitle(args: { doc: Record<string, unknown> }): string {
  const heroGroup = args.doc.hero;
  const heroTitle =
    heroGroup && typeof heroGroup === "object" && "title" in heroGroup && typeof heroGroup.title === "string"
      ? heroGroup.title
      : undefined;

  return trimText(
    (args.doc.metaTitle as string | undefined) ||
      (args.doc.title as string | undefined) ||
      (args.doc.heroTitle as string | undefined) ||
      heroTitle,
  );
}

export function generateSEODescription(args: { doc: Record<string, unknown> }): string {
  return trimText((args.doc.excerpt as string | undefined) || (args.doc.intro as string | undefined));
}

export function generateSEOImage(args: { doc: Record<string, unknown> }): number | string | { id: number | string } {
  const image = args.doc.heroImage || args.doc.cardImage;

  if (typeof image === "string" || typeof image === "number") {
    return image;
  }

  if (image && typeof image === "object" && "id" in image && typeof image.id !== "undefined") {
    return { id: image.id as number | string };
  }

  return "";
}

export function generateSEOURL(args: {
  collectionSlug?: string;
  doc: Record<string, unknown>;
  req: PayloadRequest;
}): string {
  const path =
    args.collectionSlug === "pages" ||
    args.collectionSlug === "posts" ||
    args.collectionSlug === "blog-page" ||
    args.collectionSlug === "catalog-category-pages" ||
    args.collectionSlug === "catalog-products-page" ||
    args.collectionSlug === "cases-page"
      ? resolveDocumentPath(args.collectionSlug, args.doc)
      : null;

  return new URL(path || "/", getServerURLFromRequest(args.req)).toString();
}
