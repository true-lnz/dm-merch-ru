import type { CollectionAfterChangeHook } from "payload";

type TaxonomyOrderDraft = {
  roots: Array<{
    id: string;
    children: string[];
  }>;
};

type TaxonomyDoc = {
  id: number | string;
  nodeType?: string | null;
  nodeId?: string | null;
  sortOrder?: number | null;
};

function parseTaxonomyOrderDraft(value: unknown): TaxonomyOrderDraft | null {
  if (typeof value !== "string" || value.trim().length === 0) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as TaxonomyOrderDraft;

    if (!parsed || !Array.isArray(parsed.roots)) {
      return null;
    }

    return {
      roots: parsed.roots
        .filter((root): root is TaxonomyOrderDraft["roots"][number] => Boolean(root && typeof root.id === "string" && Array.isArray(root.children)))
        .map((root) => ({
          id: root.id,
          children: root.children.filter((childId): childId is string => typeof childId === "string"),
        })),
    };
  } catch {
    return null;
  }
}

function getNodeKey(nodeType: "root" | "child", nodeId: string) {
  return `${nodeType}:${nodeId}`;
}

export const syncCatalogProductsTaxonomyOrder: CollectionAfterChangeHook = async ({ doc, req }) => {
  const draft = parseTaxonomyOrderDraft(doc?.taxonomyOrderDraft);

  if (!draft) {
    return doc;
  }

  const result = await req.payload.find({
    collection: "merged-catalog-taxonomy",
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

  const docs = result.docs as TaxonomyDoc[];
  const docsByKey = new Map(
    docs
      .filter((taxonomyDoc): taxonomyDoc is TaxonomyDoc & { nodeType: "root" | "child"; nodeId: string } => {
        return (taxonomyDoc.nodeType === "root" || taxonomyDoc.nodeType === "child") && typeof taxonomyDoc.nodeId === "string";
      })
      .map((taxonomyDoc) => [getNodeKey(taxonomyDoc.nodeType, taxonomyDoc.nodeId), taxonomyDoc]),
  );

  const updates: Array<{ id: number | string; sortOrder: number }> = [];

  draft.roots.forEach((root, rootIndex) => {
    const rootDoc = docsByKey.get(getNodeKey("root", root.id));

    if (rootDoc && rootDoc.sortOrder !== rootIndex) {
      updates.push({
        id: rootDoc.id,
        sortOrder: rootIndex,
      });
    }

    root.children.forEach((childId, childIndex) => {
      const childDoc = docsByKey.get(getNodeKey("child", childId));

      if (childDoc && childDoc.sortOrder !== childIndex) {
        updates.push({
          id: childDoc.id,
          sortOrder: childIndex,
        });
      }
    });
  });

  for (const update of updates) {
    await req.payload.update({
      collection: "merged-catalog-taxonomy" as never,
      id: update.id,
      data: {
        sortOrder: update.sortOrder,
      } as never,
      depth: 0,
      overrideAccess: true,
    });
  }

  return doc;
};
