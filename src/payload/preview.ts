import type { CollectionConfig, PayloadRequest } from "payload";

type PreviewableCollection = "pages" | "posts" | "blog-page" | "catalog-products-page" | "cases-page";
type AdminCollectionSlug =
  | "pages"
  | "posts"
  | "home-page"
  | "catalog-page"
  | "catalog-products-page"
  | "cases-page"
  | "blog-page";

export const DEFAULT_SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

export const LIVE_PREVIEW_BREAKPOINTS = [
  {
    label: "Mobile",
    name: "mobile",
    width: 375,
    height: 812,
  },
  {
    label: "Tablet",
    name: "tablet",
    width: 768,
    height: 1024,
  },
  {
    label: "Desktop",
    name: "desktop",
    width: 1440,
    height: 900,
  },
];

function normalizePath(path: string | null | undefined): string | null {
  if (!path) {
    return null;
  }

  if (path.startsWith("/")) {
    return path;
  }

  return `/${path}`;
}

export function resolvePagePath(slug: unknown): string | null {
  switch (slug) {
    case "home":
      return "/";
    case "catalog":
      return "/catalog";
    case "catalog-products":
      return "/catalog-products";
    case "cases":
      return "/cases";
    case "blog":
      return "/blog";
    default:
      return null;
  }
}

export function resolveDocumentPath(collection: PreviewableCollection, doc: Record<string, unknown>): string | null {
  if (collection === "pages") {
    return resolvePagePath(doc.slug);
  }

  if (collection === "blog-page") {
    return "/blog";
  }

  if (collection === "catalog-products-page") {
    return "/catalog-products";
  }

  if (collection === "cases-page") {
    return "/cases";
  }

  if (collection === "posts" && typeof doc.slug === "string" && doc.slug.length > 0) {
    return `/blog/${doc.slug}`;
  }

  return null;
}

export function buildPreviewURL(path: string | null | undefined): string | null {
  const normalizedPath = normalizePath(path);

  if (!normalizedPath) {
    return null;
  }

  return `/next/preview?redirect=${encodeURIComponent(normalizedPath)}`;
}

export function getPreviewURLForCollection(collection: PreviewableCollection): NonNullable<CollectionConfig["admin"]>["preview"] {
  return (doc) => buildPreviewURL(resolveDocumentPath(collection, doc));
}

export function getLivePreviewURLForCollection(collection: PreviewableCollection): NonNullable<CollectionConfig["admin"]>["livePreview"] {
  return {
    url: ({ data }) => buildPreviewURL(resolveDocumentPath(collection, data)),
  };
}

export function getServerURLFromRequest(req?: PayloadRequest): string {
  if (req) {
    const forwardedHost = req.headers.get("x-forwarded-host");
    const forwardedProto = req.headers.get("x-forwarded-proto");
    const host = forwardedHost || req.headers.get("host");

    if (host) {
      const protocol = forwardedProto || (host.includes("localhost") ? "http" : "https");
      return `${protocol}://${host}`;
    }
  }

  return DEFAULT_SERVER_URL;
}

export function getAbsolutePreviewURL(path: string | null | undefined, req?: PayloadRequest): string | null {
  const previewURL = buildPreviewURL(path);

  if (!previewURL) {
    return null;
  }

  return new URL(previewURL, getServerURLFromRequest(req)).toString();
}

export function getDocumentAdminPath(collection: AdminCollectionSlug, id: number | string): string {
  return `/admin/collections/${collection}/${id}`;
}
