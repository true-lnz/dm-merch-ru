import "server-only";

import { getPayloadClient } from "@/shared/lib/payload/get-payload-client";

import type { CaseGalleryImage, CaseImageFit, CaseItem, CaseThemeFilter } from "./cases-types";

type MediaDoc = {
  id: string;
  url?: string | null;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
};

function isMediaDoc(value: unknown): value is MediaDoc {
  return typeof value === "object" && value !== null && "id" in value;
}

function normalizeImageFit(value: unknown): CaseImageFit | undefined {
  if (value === "cover" || value === "contain") {
    return value;
  }

  return undefined;
}

function normalizePosition(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function mapGalleryItem(item: unknown): CaseGalleryImage | null {
  if (typeof item !== "object" || item === null || !("image" in item)) {
    return null;
  }

  const image = item.image;

  if (!isMediaDoc(image) || !image.url || !image.alt || !image.width || !image.height) {
    return null;
  }

  return {
    src: image.url,
    alt: image.alt,
    width: image.width,
    height: image.height,
    fit: normalizeImageFit("fit" in item ? item.fit : undefined),
    x: normalizePosition("x" in item ? item.x : undefined),
    y: normalizePosition("y" in item ? item.y : undefined),
  };
}

export async function getCasesPageData(): Promise<{
  items: CaseItem[];
  themes: CaseThemeFilter[];
}> {
  const payload = (await getPayloadClient()) as any;
  const [filtersResult, cardsResult] = await Promise.all([
    payload.find({
      collection: "case-filters",
      depth: 0,
      limit: 100,
      pagination: false,
      sort: "sortOrder",
      where: {
        isActive: {
          equals: true,
        },
      },
    }),
    payload.find({
      collection: "case-cards",
      depth: 2,
      limit: 100,
      pagination: false,
      sort: "sortOrder",
      where: {
        isActive: {
          equals: true,
        },
      },
    }),
  ]);
  const themes = Array.isArray(filtersResult?.docs)
    ? filtersResult.docs
        .map((theme: any): CaseThemeFilter | null => {
          if (typeof theme?.slug !== "string" || typeof theme?.label !== "string") {
            return null;
          }

          return {
            slug: theme.slug,
            label: theme.label,
          };
        })
        .filter((theme: CaseThemeFilter | null): theme is CaseThemeFilter => theme !== null)
    : [];
  const activeCategorySlugs = new Set(themes.map((theme: CaseThemeFilter) => theme.slug));

  const items = Array.isArray(cardsResult?.docs)
    ? cardsResult.docs
        .map((doc: any): CaseItem | null => {
          const gallery = Array.isArray(doc.gallery)
            ? doc.gallery.map(mapGalleryItem).filter((item: CaseGalleryImage | null): item is CaseGalleryImage => item !== null)
            : [];
          const themeSlug =
            typeof doc.theme === "object" && doc.theme !== null && typeof doc.theme.slug === "string" ? doc.theme.slug : null;

          if (
            typeof doc.slug !== "string" ||
            typeof doc.company !== "string" ||
            typeof doc.teaser !== "string" ||
            typeof doc.intro !== "string" ||
            typeof doc.task !== "string" ||
            typeof doc.solution !== "string" ||
            typeof doc.result !== "string" ||
            !themeSlug ||
            !activeCategorySlugs.has(themeSlug) ||
            gallery.length === 0
          ) {
            return null;
          }

          return {
            id: doc.slug,
            company: doc.company,
            teaser: doc.teaser,
            intro: doc.intro,
            task: doc.task,
            solution: doc.solution,
            result: doc.result,
            themeSlug,
            gallery,
          };
        })
        .filter((item: CaseItem | null): item is CaseItem => item !== null)
    : [];

  return { items, themes };
}
