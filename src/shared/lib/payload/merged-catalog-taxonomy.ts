import "server-only";

import { cache } from "react";
import { getPayloadClient } from "./get-payload-client";

type MergedCatalogTaxonomyDoc = {
  key: string;
  displayNameOverride?: string | null;
  isActive?: boolean | null;
};

function normalizeOverride(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export const getMergedCatalogTaxonomySettings = cache(async () => {
  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "merged-catalog-taxonomy" as never,
      depth: 0,
      limit: 1000,
      overrideAccess: true,
      pagination: false,
      where: {
        isActive: {
          equals: true,
        },
      },
    });

    const docs = result.docs as unknown as MergedCatalogTaxonomyDoc[];
    const settings = new Map<string, { override: string | null }>();

    for (const doc of docs) {
      settings.set(doc.key, {
        override: normalizeOverride(doc.displayNameOverride),
      });
    }

    return settings;
  } catch (error) {
    console.warn("Failed to load merged catalog taxonomy settings", error);
    return new Map<string, { override: string | null }>();
  }
});
