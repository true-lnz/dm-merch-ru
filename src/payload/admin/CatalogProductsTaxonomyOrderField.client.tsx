"use client";

import { useField } from "@payloadcms/ui";
import { FieldDescription } from "@payloadcms/ui/fields/FieldDescription";
import { FieldLabel } from "@payloadcms/ui/fields/FieldLabel";
import type { UIFieldClientComponent } from "payload";
import { useCallback, useEffect, useMemo, useState } from "react";

type TaxonomyDoc = {
  displayNameOverride?: null | string;
  id: number | string;
  isActive?: boolean | null;
  nodeId: string;
  nodeType: "child" | "root";
  rootId: string;
  sortOrder?: number | null;
  sourceName: string;
  sourceRootName?: null | string;
};

type TaxonomyOrderDraft = {
  roots: Array<{
    children: string[];
    id: string;
  }>;
};

type ChildItem = {
  id: string;
  title: string;
};

type RootItem = {
  children: ChildItem[];
  id: string;
  title: string;
};

type MoveDirection = "left" | "right" | "up" | "down";

function getNodeTitle(doc: Pick<TaxonomyDoc, "displayNameOverride" | "sourceName">) {
  return doc.displayNameOverride?.trim() || doc.sourceName;
}

function sortDocs(left: Pick<TaxonomyDoc, "sortOrder" | "sourceName">, right: Pick<TaxonomyDoc, "sortOrder" | "sourceName">) {
  const leftSortOrder = typeof left.sortOrder === "number" ? left.sortOrder : Number.MAX_SAFE_INTEGER;
  const rightSortOrder = typeof right.sortOrder === "number" ? right.sortOrder : Number.MAX_SAFE_INTEGER;

  return leftSortOrder - rightSortOrder || left.sourceName.localeCompare(right.sourceName, "ru");
}

function buildRootItems(docs: TaxonomyDoc[]) {
  const rootDocs = docs.filter((doc) => doc.nodeType === "root").sort(sortDocs);
  const childDocsByRootId = new Map<string, TaxonomyDoc[]>();

  docs
    .filter((doc) => doc.nodeType === "child")
    .sort(sortDocs)
    .forEach((doc) => {
      const bucket = childDocsByRootId.get(doc.rootId) ?? [];
      bucket.push(doc);
      childDocsByRootId.set(doc.rootId, bucket);
    });

  return rootDocs.map<RootItem>((rootDoc) => ({
    id: rootDoc.nodeId,
    title: getNodeTitle(rootDoc),
    children: (childDocsByRootId.get(rootDoc.nodeId) ?? []).map((childDoc) => ({
      id: childDoc.nodeId,
      title: getNodeTitle(childDoc),
    })),
  }));
}

function parseDraft(value: unknown): TaxonomyOrderDraft | null {
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

function serializeDraft(roots: RootItem[]) {
  return JSON.stringify({
    roots: roots.map((root) => ({
      id: root.id,
      children: root.children.map((child) => child.id),
    })),
  });
}

function applyDraft(baseRoots: RootItem[], draft: TaxonomyOrderDraft | null) {
  if (!draft) {
    return baseRoots;
  }

  const rootById = new Map(baseRoots.map((root) => [root.id, root]));
  const nextRoots: RootItem[] = [];

  draft.roots.forEach((draftRoot) => {
    const root = rootById.get(draftRoot.id);

    if (!root) {
      return;
    }

    const childById = new Map(root.children.map((child) => [child.id, child]));
    const orderedChildren = draftRoot.children
      .map((childId) => childById.get(childId))
      .filter((child): child is ChildItem => Boolean(child));
    const missingChildren = root.children.filter((child) => !draftRoot.children.includes(child.id));

    nextRoots.push({
      ...root,
      children: [...orderedChildren, ...missingChildren],
    });
    rootById.delete(draftRoot.id);
  });

  return [...nextRoots, ...baseRoots.filter((root) => rootById.has(root.id))];
}

function moveRootByOffset(roots: RootItem[], rootId: string, offset: -1 | 1) {
  const rootIndex = roots.findIndex((root) => root.id === rootId);
  const targetIndex = rootIndex + offset;

  if (rootIndex < 0 || targetIndex < 0 || targetIndex >= roots.length) {
    return roots;
  }

  const nextRoots = [...roots];
  const [root] = nextRoots.splice(rootIndex, 1);
  nextRoots.splice(targetIndex, 0, root);
  return nextRoots;
}

function moveChildByOffset(roots: RootItem[], rootId: string, childId: string, offset: -1 | 1) {
  const rootIndex = roots.findIndex((root) => root.id === rootId);

  if (rootIndex < 0) {
    return roots;
  }

  const childIndex = roots[rootIndex].children.findIndex((child) => child.id === childId);
  const targetIndex = childIndex + offset;

  if (childIndex < 0 || targetIndex < 0 || targetIndex >= roots[rootIndex].children.length) {
    return roots;
  }

  const nextRoots = roots.map((root) => ({
    ...root,
    children: [...root.children],
  }));
  const [child] = nextRoots[rootIndex].children.splice(childIndex, 1);
  nextRoots[rootIndex].children.splice(targetIndex, 0, child);
  return nextRoots;
}

function getMoveButtonLabel(direction: MoveDirection) {
  switch (direction) {
    case "left":
      return "Слева";
    case "right":
      return "Справа";
    case "up":
      return "Вверх";
    case "down":
      return "Вниз";
  }
}

function MoveIcon({ direction }: { direction: MoveDirection }) {
  const rotationByDirection: Record<MoveDirection, string> = {
    left: "rotate(180deg)",
    right: "rotate(0deg)",
    up: "rotate(-90deg)",
    down: "rotate(90deg)",
  };

  return (
    <svg aria-hidden="true" height="14" viewBox="0 0 16 16" width="14">
      <path
        d="M5 3.5L9.5 8 5 12.5"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
        style={{ transform: rotationByDirection[direction], transformOrigin: "center" }}
      />
    </svg>
  );
}

async function fetchTaxonomyDocs() {
  const params = new URLSearchParams({
    depth: "0",
    limit: "1000",
    pagination: "false",
    "where[isActive][equals]": "true",
  });
  const response = await fetch(`/api/merged-catalog-taxonomy?${params.toString()}`, {
    credentials: "same-origin",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch taxonomy docs: ${response.status}`);
  }

  const data = (await response.json()) as { docs?: TaxonomyDoc[] };
  return Array.isArray(data.docs) ? data.docs : [];
}

const cardStyle = {
  background: "var(--theme-elevation-50)",
  border: "1px solid var(--theme-elevation-150)",
  borderRadius: "14px",
  height: "420px",
  overflow: "hidden",
} satisfies React.CSSProperties;

const headerRowStyle = {
  alignItems: "flex-start",
  display: "flex",
  gap: "10px",
  justifyContent: "space-between",
} satisfies React.CSSProperties;

const cardScrollAreaStyle = {
  display: "flex",
  flexDirection: "column",
  height: "100%",
  overflowX: "hidden",
  overflowY: "auto",
  padding: "0 16px 16px",
} satisfies React.CSSProperties;

const stickyHeaderStyle = {
  background: "var(--theme-elevation-50)",
  display: "flex",
  alignItems: "flex-start",
  gap: "10px",
  flexShrink: 0,
  justifyContent: "space-between",
  padding: "16px 0 12px",
  position: "sticky",
  top: 0,
  zIndex: 1,
} satisfies React.CSSProperties;

const childListStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  minHeight: 0,
} satisfies React.CSSProperties;

const rowStyle = {
  alignItems: "center",
  background: "var(--theme-bg)",
  border: "1px solid var(--theme-elevation-150)",
  borderRadius: "10px",
  display: "flex",
  gap: "8px",
  justifyContent: "space-between",
  padding: "5px 6px",
} satisfies React.CSSProperties;

const rootTitleStyle = {
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  display: "-webkit-box",
  lineHeight: 1.3,
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
} satisfies React.CSSProperties;

const childTitleStyle = {
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  display: "-webkit-box",
  lineHeight: 1.35,
  minWidth: 0,
  overflow: "hidden",
  paddingRight: "8px",
  textOverflow: "ellipsis",
} satisfies React.CSSProperties;

const badgeStyle = {
  background: "var(--theme-elevation-100)",
  borderRadius: "999px",
  color: "var(--theme-text)",
  fontSize: "12px",
  lineHeight: 1,
  padding: "6px 8px",
  whiteSpace: "nowrap",
} satisfies React.CSSProperties;

const helperTextStyle = {
  color: "var(--theme-elevation-600)",
  fontSize: "13px",
  lineHeight: 1.5,
} satisfies React.CSSProperties;

const actionButtonStyle = {
  alignItems: "center",
  background: "var(--theme-elevation-100)",
  border: "1px solid var(--theme-elevation-150)",
  borderRadius: "8px",
  color: "var(--theme-text)",
  cursor: "pointer",
  display: "inline-flex",
  height: "30px",
  justifyContent: "center",
  lineHeight: 1,
  padding: "0",
  width: "30px",
} satisfies React.CSSProperties;

const disabledActionButtonStyle = {
  cursor: "not-allowed",
  opacity: 0.45,
} satisfies React.CSSProperties;

const CatalogProductsTaxonomyOrderFieldClient: UIFieldClientComponent = ({ field, path }) => {
  const adminCustom = field.admin?.custom;
  const draftFieldPath = typeof adminCustom === "object" && adminCustom && "draftFieldPath" in adminCustom && typeof adminCustom.draftFieldPath === "string"
    ? adminCustom.draftFieldPath
    : "taxonomyOrderDraft";

  const description = ("description" in field ? field.description : undefined) as never;
  const label = ("label" in field ? field.label : undefined) as never;
  const { setValue, value } = useField<string>({ path: draftFieldPath });
  const customDocs = useMemo(() => {
    const docsValue = (field.admin?.custom as { docs?: TaxonomyDoc[] } | undefined)?.docs;
    return Array.isArray(docsValue) ? docsValue : [];
  }, [field.admin?.custom]);
  const [docs, setDocs] = useState<TaxonomyDoc[]>(customDocs);
  const [isLoading, setIsLoading] = useState(customDocs.length === 0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const roots = useMemo(() => applyDraft(buildRootItems(docs), parseDraft(value)), [docs, value]);

  const updateRoots = useCallback(
    (nextRoots: RootItem[]) => {
      setValue(serializeDraft(nextRoots));
    },
    [setValue],
  );

  useEffect(() => {
    if (customDocs.length > 0) {
      setDocs(customDocs);
      setIsLoading(false);
      setErrorMessage(null);
      return;
    }

    let isMounted = true;

    void fetchTaxonomyDocs()
      .then((nextDocs) => {
        if (!isMounted) {
          return;
        }

        setDocs(nextDocs);
        setErrorMessage(null);
      })
      .catch((error: unknown) => {
        if (!isMounted) {
          return;
        }

        console.error(error);
        setErrorMessage("Не удалось загрузить категории каталога.");
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [customDocs]);

  return (
    <div style={{ display: "grid", gap: "14px" }}>
      <FieldLabel htmlFor={path} label={label} required={false} />

      <FieldDescription description={description} path={path} />

      <div style={{ display: "grid", gap: "12px" }}>
        <p style={{ ...helperTextStyle, margin: 0 }}>
          Категории двигаются на одну позицию кнопками «Слева» и «Справа». Подкатегории двигаются внутри своей категории кнопками
          «Вверх» и «Вниз». Порядок сохранится после обычного сохранения документа.
        </p>

        {isLoading ? <div style={helperTextStyle}>Загрузка категорий...</div> : null}
        {errorMessage ? <div style={{ ...helperTextStyle, color: "var(--theme-error-500)" }}>{errorMessage}</div> : null}

        {!isLoading && !errorMessage ? (
          <div
            style={{
              alignItems: "start",
              display: "grid",
              gap: "16px",
              gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
            }}
          >
            {roots.map((root, rootIndex) => (
              <div key={root.id} style={cardStyle}>
                <div style={cardScrollAreaStyle}>
                  <div style={stickyHeaderStyle}>
                    <div style={{ ...headerRowStyle, minWidth: 0, flex: "1 1 auto" }}>
                      <strong style={rootTitleStyle}>{root.title}</strong>
                      <span style={badgeStyle}>{root.children.length}</span>
                    </div>

                    <div style={{ display: "flex", flexShrink: 0, gap: "8px" }}>
                      <button
                        aria-label={getMoveButtonLabel("left")}
                        disabled={rootIndex === 0}
                        onClick={() => updateRoots(moveRootByOffset(roots, root.id, -1))}
                        style={{
                          ...actionButtonStyle,
                          ...(rootIndex === 0 ? disabledActionButtonStyle : null),
                        }}
                        title={getMoveButtonLabel("left")}
                        type="button"
                      >
                        <MoveIcon direction="left" />
                      </button>
                      <button
                        aria-label={getMoveButtonLabel("right")}
                        disabled={rootIndex === roots.length - 1}
                        onClick={() => updateRoots(moveRootByOffset(roots, root.id, 1))}
                        style={{
                          ...actionButtonStyle,
                          ...(rootIndex === roots.length - 1 ? disabledActionButtonStyle : null),
                        }}
                        title={getMoveButtonLabel("right")}
                        type="button"
                      >
                        <MoveIcon direction="right" />
                      </button>
                    </div>
                  </div>

                  <div style={childListStyle}>
                    {root.children.map((child, childIndex) => (
                      <div key={child.id} style={rowStyle}>
                        <span style={childTitleStyle}>{child.title}</span>
                        <div style={{ display: "flex", flexShrink: 0, gap: "8px" }}>
                          <button
                            aria-label={getMoveButtonLabel("up")}
                            disabled={childIndex === 0}
                            onClick={() => updateRoots(moveChildByOffset(roots, root.id, child.id, -1))}
                            style={{
                              ...actionButtonStyle,
                              ...(childIndex === 0 ? disabledActionButtonStyle : null),
                            }}
                            title={getMoveButtonLabel("up")}
                            type="button"
                          >
                            <MoveIcon direction="up" />
                          </button>
                          <button
                            aria-label={getMoveButtonLabel("down")}
                            disabled={childIndex === root.children.length - 1}
                            onClick={() => updateRoots(moveChildByOffset(roots, root.id, child.id, 1))}
                            style={{
                              ...actionButtonStyle,
                              ...(childIndex === root.children.length - 1 ? disabledActionButtonStyle : null),
                            }}
                            title={getMoveButtonLabel("down")}
                            type="button"
                          >
                            <MoveIcon direction="down" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CatalogProductsTaxonomyOrderFieldClient;
