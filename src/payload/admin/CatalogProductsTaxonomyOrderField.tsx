"use client";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useField } from "@payloadcms/ui";
import { FieldDescription } from "@payloadcms/ui/fields/FieldDescription";
import { FieldLabel } from "@payloadcms/ui/fields/FieldLabel";
import type { UIFieldClientComponent } from "payload";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

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

type DragMeta = {
  childCount?: number;
  id: string;
  rootId?: string;
  title: string;
  type: "child" | "root";
};

const ROOT_SORTABLE_PREFIX = "root::";
const CHILD_SORTABLE_PREFIX = "child::";

function getRootSortableId(rootId: string) {
  return `${ROOT_SORTABLE_PREFIX}${rootId}`;
}

function getChildSortableId(rootId: string, childId: string) {
  return `${CHILD_SORTABLE_PREFIX}${rootId}::${childId}`;
}

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

function getActiveDragMeta(event: DragStartEvent | DragEndEvent): DragMeta | null {
  const data = event.active.data.current;

  if (!data || (data.type !== "root" && data.type !== "child") || typeof data.id !== "string" || typeof data.title !== "string") {
    return null;
  }

  return {
    childCount: typeof data.childCount === "number" ? data.childCount : undefined,
    id: data.id,
    rootId: typeof data.rootId === "string" ? data.rootId : undefined,
    title: data.title,
    type: data.type,
  };
}

function getOverlayTitle(activeDrag: DragMeta | null) {
  if (!activeDrag) {
    return "";
  }

  return activeDrag.type === "root" ? activeDrag.title : activeDrag.title;
}

function RootOverlayCard({ activeDrag }: { activeDrag: DragMeta }) {
  return (
    <div
      style={{
        ...cardStyle,
        border: "2px solid var(--theme-success-500)",
        boxShadow: "0 24px 60px rgba(0,0,0,0.18)",
        minWidth: "320px",
        opacity: 1,
      }}
    >
      <div style={{ alignItems: "center", display: "flex", gap: "10px", justifyContent: "space-between" }}>
        <strong style={{ fontSize: "16px", lineHeight: 1.3 }}>{getOverlayTitle(activeDrag)}</strong>
        <span style={badgeStyle}>Категория</span>
      </div>

      <p style={{ ...helperTextStyle, color: "var(--theme-text)", margin: 0 }}>
        {typeof activeDrag.childCount === "number" ? `Подкатегорий: ${activeDrag.childCount}` : "Переместите карточку в нужную колонку."}
      </p>
    </div>
  );
}

function ChildOverlayRow({ activeDrag }: { activeDrag: DragMeta }) {
  return (
    <div
      style={{
        ...rowButtonStyle,
        border: "2px solid var(--theme-success-500)",
        boxShadow: "0 20px 48px rgba(0,0,0,0.16)",
        minWidth: "280px",
        opacity: 1,
      }}
    >
      <span>{getOverlayTitle(activeDrag)}</span>
      <span style={badgeStyle}>Подкатегория</span>
    </div>
  );
}

const cardStyle = {
  background: "var(--theme-elevation-0)",
  border: "1px solid var(--theme-elevation-150)",
  borderRadius: "16px",
  boxShadow: "0 10px 24px rgba(0,0,0,0.04)",
  display: "flex",
  flexDirection: "column" as const,
  gap: "12px",
  minHeight: "100%",
  padding: "16px",
};

const rowButtonStyle = {
  alignItems: "center",
  background: "var(--theme-elevation-50)",
  border: "1px solid var(--theme-elevation-150)",
  borderRadius: "10px",
  color: "var(--theme-text)",
  cursor: "grab",
  display: "flex",
  fontSize: "14px",
  gap: "10px",
  justifyContent: "space-between",
  lineHeight: 1.35,
  padding: "10px 12px",
  textAlign: "left" as const,
  width: "100%",
};

const helperTextStyle = {
  color: "var(--theme-elevation-600)",
  fontSize: "13px",
  lineHeight: 1.5,
  margin: 0,
};

const actionButtonStyle = {
  background: "var(--theme-elevation-50)",
  border: "1px solid var(--theme-elevation-150)",
  borderRadius: "9px",
  color: "var(--theme-text)",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: 600,
  padding: "8px 12px",
};

const dragHandleStyle = {
  alignItems: "center",
  background: "var(--theme-elevation-50)",
  border: "1px solid var(--theme-elevation-150)",
  borderRadius: "8px",
  color: "var(--theme-text)",
  cursor: "grab",
  display: "inline-flex",
  fontSize: "12px",
  fontWeight: 700,
  gap: "8px",
  padding: "8px 10px",
  touchAction: "none" as const,
  userSelect: "none" as const,
};

const badgeStyle = {
  color: "var(--theme-elevation-500)",
  fontSize: "12px",
  fontWeight: 600,
};

const childListStyle = {
  display: "grid",
  gap: "8px",
};

const SortableChildRow = memo(function SortableChildRow({
  child,
  isDragSource,
  readOnly,
  rootId,
}: {
  child: ChildItem;
  isDragSource: boolean;
  readOnly?: boolean;
  rootId: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: getChildSortableId(rootId, child.id),
    disabled: readOnly,
    data: {
      id: child.id,
      rootId,
      title: child.title,
      type: "child",
    },
  });

  return (
    <button
      ref={setNodeRef}
      type="button"
      style={{
        ...rowButtonStyle,
        opacity: isDragSource ? 0.3 : 1,
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1 : 0,
      }}
      {...attributes}
      {...listeners}
    >
      <span>{child.title}</span>
      <span style={badgeStyle}>Подкатегория</span>
    </button>
  );
});

const SortableRootCard = memo(function SortableRootCard({
  activeDrag,
  readOnly,
  root,
}: {
  activeDrag: DragMeta | null;
  readOnly?: boolean;
  root: RootItem;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: getRootSortableId(root.id),
    disabled: readOnly,
    data: {
      childCount: root.children.length,
      id: root.id,
      title: root.title,
      type: "root",
    },
  });

  const childSortableIds = useMemo(() => root.children.map((child) => getChildSortableId(root.id, child.id)), [root.children, root.id]);
  const isChildDragActive = activeDrag?.type === "child" && activeDrag.rootId === root.id;
  const isRootDragSource = activeDrag?.type === "root" && activeDrag.id === root.id;

  return (
    <section
      ref={setNodeRef}
      style={{
        ...cardStyle,
        border: isChildDragActive ? "1px dashed var(--theme-success-500)" : cardStyle.border,
        opacity: isRootDragSource ? 0.35 : 1,
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1 : 0,
      }}
    >
      <div style={{ alignItems: "center", display: "flex", gap: "10px", justifyContent: "space-between" }}>
        <div style={{ display: "grid", gap: "4px" }}>
          <strong style={{ fontSize: "16px", lineHeight: 1.3 }}>{root.title}</strong>
          <span style={badgeStyle}>Категория</span>
        </div>

        <button type="button" style={dragHandleStyle} {...attributes} {...listeners}>
          <span>::</span>
          <span>Перетащить</span>
        </button>
      </div>

      <SortableContext items={childSortableIds} strategy={verticalListSortingStrategy}>
        <div style={childListStyle}>
          {root.children.map((child) => (
            <SortableChildRow
              key={child.id}
              child={child}
              isDragSource={activeDrag?.type === "child" && activeDrag.id === child.id}
              readOnly={readOnly}
              rootId={root.id}
            />
          ))}
        </div>
      </SortableContext>
    </section>
  );
});

const CatalogProductsTaxonomyOrderField: UIFieldClientComponent = ({ field, path, readOnly }) => {
  const draftFieldPath = typeof field.admin?.custom?.draftFieldPath === "string" ? field.admin.custom.draftFieldPath : "taxonomyOrderDraft";
  const { setValue, value } = useField<string>({ path: draftFieldPath });
  const [activeDrag, setActiveDrag] = useState<DragMeta | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [roots, setRoots] = useState<RootItem[]>([]);
  const [sourceRoots, setSourceRoots] = useState<RootItem[]>([]);
  const draftValueRef = useRef(typeof value === "string" ? value : "");

  const description = typeof field.admin?.description === "string" ? field.admin.description : "";
  const rootSortableIds = useMemo(() => roots.map((root) => getRootSortableId(root.id)), [roots]);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
  );

  const commitRoots = useCallback(
    (nextRoots: RootItem[] | ((previousRoots: RootItem[]) => RootItem[])) => {
      setRoots((previousRoots) => {
        const resolvedRoots = typeof nextRoots === "function" ? nextRoots(previousRoots) : nextRoots;
        const nextDraft = serializeDraft(resolvedRoots);

        if (nextDraft !== draftValueRef.current) {
          draftValueRef.current = nextDraft;
          setValue(nextDraft);
        }

        return resolvedRoots;
      });
    },
    [setValue],
  );

  useEffect(() => {
    let isCancelled = false;

    async function loadTaxonomy() {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/merged-catalog-taxonomy?limit=1000&depth=0&where[isActive][equals]=true", {
          credentials: "same-origin",
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const payload = (await response.json()) as { docs?: TaxonomyDoc[] };
        const nextSourceRoots = buildRootItems(payload.docs ?? []);
        const nextRoots = applyDraft(nextSourceRoots, parseDraft(draftValueRef.current));

        if (isCancelled) {
          return;
        }

        setSourceRoots(nextSourceRoots);
        setRoots(nextRoots);

        if (draftValueRef.current.trim().length === 0) {
          const initialDraft = serializeDraft(nextRoots);
          draftValueRef.current = initialDraft;
          setValue(initialDraft);
        }
      } catch (loadError) {
        if (isCancelled) {
          return;
        }

        setError(loadError instanceof Error ? loadError.message : "Не удалось загрузить категории.");
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadTaxonomy();

    return () => {
      isCancelled = true;
    };
  }, [setValue]);

  useEffect(() => {
    const nextDraftValue = typeof value === "string" ? value : "";

    if (nextDraftValue === draftValueRef.current) {
      return;
    }

    draftValueRef.current = nextDraftValue;

    if (sourceRoots.length > 0) {
      setRoots(applyDraft(sourceRoots, parseDraft(nextDraftValue)));
    }
  }, [sourceRoots, value]);

  const handleReset = useCallback(() => {
    setActiveDrag(null);
    commitRoots(sourceRoots);
  }, [commitRoots, sourceRoots]);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveDrag(getActiveDragMeta(event));
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const activeMeta = getActiveDragMeta(event);
      const overData = event.over?.data.current;

      setActiveDrag(null);

      if (!activeMeta || !overData || (overData.type !== "root" && overData.type !== "child")) {
        return;
      }

      if (activeMeta.type === "root") {
        if (overData.type !== "root" || activeMeta.id === overData.id) {
          return;
        }

        commitRoots((previousRoots) => {
          const activeIndex = previousRoots.findIndex((root) => root.id === activeMeta.id);
          const overIndex = previousRoots.findIndex((root) => root.id === overData.id);

          if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex) {
            return previousRoots;
          }

          return arrayMove(previousRoots, activeIndex, overIndex);
        });

        return;
      }

      if (activeMeta.type === "child" && activeMeta.rootId) {
        if (overData.type === "child") {
          if (overData.rootId !== activeMeta.rootId || overData.id === activeMeta.id) {
            return;
          }

          commitRoots((previousRoots) =>
            previousRoots.map((root) => {
              if (root.id !== activeMeta.rootId) {
                return root;
              }

              const activeIndex = root.children.findIndex((child) => child.id === activeMeta.id);
              const overIndex = root.children.findIndex((child) => child.id === overData.id);

              if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex) {
                return root;
              }

              return {
                ...root,
                children: arrayMove(root.children, activeIndex, overIndex),
              };
            }),
          );

          return;
        }

        if (overData.type === "root" && overData.id === activeMeta.rootId) {
          commitRoots((previousRoots) =>
            previousRoots.map((root) => {
              if (root.id !== activeMeta.rootId) {
                return root;
              }

              const activeIndex = root.children.findIndex((child) => child.id === activeMeta.id);

              if (activeIndex === -1 || activeIndex === root.children.length - 1) {
                return root;
              }

              const nextChildren = [...root.children];
              const [activeChild] = nextChildren.splice(activeIndex, 1);
              nextChildren.push(activeChild);

              return {
                ...root,
                children: nextChildren,
              };
            }),
          );
        }
      }
    },
    [commitRoots],
  );

  return (
    <div style={{ display: "grid", gap: "12px" }}>
      <FieldLabel label={field.label} path={path} />

      <div
        style={{
          background: "var(--theme-elevation-0)",
          border: "1px solid var(--theme-elevation-150)",
          borderRadius: "18px",
          display: "grid",
          gap: "16px",
          padding: "18px",
        }}
      >
        <div style={{ alignItems: "flex-start", display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "space-between" }}>
          <div style={{ display: "grid", gap: "6px", maxWidth: "720px" }}>
            <p style={helperTextStyle}>Категории можно менять местами между колонками. Подкатегории можно двигать только внутри своей категории.</p>
            <p style={helperTextStyle}>Изменения сохранятся после сохранения документа.</p>
          </div>

          <button type="button" onClick={handleReset} disabled={readOnly || isLoading || sourceRoots.length === 0} style={actionButtonStyle}>
            Сбросить к текущему порядку
          </button>
        </div>

        {isLoading ? <p style={helperTextStyle}>Загрузка категорий...</p> : null}
        {error ? <p style={{ ...helperTextStyle, color: "var(--theme-error-500)" }}>Ошибка: {error}</p> : null}

        {!isLoading && !error ? (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} onDragStart={handleDragStart}>
            <SortableContext items={rootSortableIds} strategy={rectSortingStrategy}>
              <div
                style={{
                  display: "grid",
                  gap: "16px",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                }}
              >
                {roots.map((root) => (
                  <SortableRootCard key={root.id} activeDrag={activeDrag} readOnly={readOnly} root={root} />
                ))}
              </div>
            </SortableContext>

            <DragOverlay>
              {activeDrag ? activeDrag.type === "root" ? <RootOverlayCard activeDrag={activeDrag} /> : <ChildOverlayRow activeDrag={activeDrag} /> : null}
            </DragOverlay>
          </DndContext>
        ) : null}
      </div>

      <FieldDescription className={`field-description-${path.replace(/\./g, "__")}`} description={description} path={path} />
    </div>
  );
};

export default CatalogProductsTaxonomyOrderField;
