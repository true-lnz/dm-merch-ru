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
  const [categoriesResult, casesResult] = await Promise.all([
    payload.find({
      collection: "case-categories",
      depth: 0,
      limit: 100,
      sort: "sortOrder",
      where: {
        isActive: {
          equals: true,
        },
      },
    }),
    payload.find({
      collection: "cases",
      depth: 2,
      limit: 100,
      sort: "sortOrder",
      where: {
        isActive: {
          equals: true,
        },
      },
    }),
  ]);

  const themes = categoriesResult.docs.map((category: any) => ({
    slug: category.slug,
    label: category.title,
  }));
  const activeCategorySlugs = new Set(themes.map((theme: CaseThemeFilter) => theme.slug));

  const items = casesResult.docs
    .map((doc: any): CaseItem | null => {
      const category = typeof doc.category === "object" && doc.category !== null ? doc.category : null;
      const gallery = Array.isArray(doc.gallery)
        ? doc.gallery.map(mapGalleryItem).filter((item: CaseGalleryImage | null): item is CaseGalleryImage => item !== null)
        : [];

      if (!category?.slug || !activeCategorySlugs.has(category.slug) || gallery.length === 0) {
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
        themeSlug: category.slug,
        gallery,
      };
    })
    .filter((item: CaseItem | null): item is CaseItem => item !== null);

  return { items, themes };
}
