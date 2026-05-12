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

  return activeDrag.title;
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
        boxShadow: "0 18px 46px rgba(0,0,0,0.18)",
        minWidth: "280px",
      }}
    >
      <span>{getOverlayTitle(activeDrag)}</span>
      <span style={badgeStyle}>Подкатегория</span>
    </div>
  );
}

function SortableRootCard({
  childIds,
  item,
  onChildContainerEnter,
}: {
  childIds: string[];
  item: RootItem;
  onChildContainerEnter: (rootId: string) => void;
}) {
  const sortableId = getRootSortableId(item.id);
  const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({
    data: {
      childCount: item.children.length,
      id: item.id,
      title: item.title,
      type: "root",
    },
    id: sortableId,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        ...cardStyle,
        opacity: isDragging ? 0.45 : 1,
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <button {...attributes} {...listeners} style={rootHandleStyle} type="button">
        <strong>{item.title}</strong>
        <span style={badgeStyle}>{item.children.length}</span>
      </button>

      <div onMouseEnter={() => onChildContainerEnter(item.id)} style={{ display: "grid", gap: "8px" }}>
        <SortableContext items={childIds} strategy={verticalListSortingStrategy}>
          {item.children.map((child) => (
            <SortableChildRow child={child} key={child.id} rootId={item.id} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

const SortableChildRow = memo(function SortableChildRow({ child, rootId }: { child: ChildItem; rootId: string }) {
  const sortableId = getChildSortableId(rootId, child.id);
  const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({
    data: {
      id: child.id,
      rootId,
      title: child.title,
      type: "child",
    },
    id: sortableId,
  });

  return (
    <button
      {...attributes}
      {...listeners}
      ref={setNodeRef}
      style={{
        ...rowButtonStyle,
        opacity: isDragging ? 0.45 : 1,
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      type="button"
    >
      <span>{child.title}</span>
    </button>
  );
});

function parseSortableId(sortableId: string) {
  if (sortableId.startsWith(ROOT_SORTABLE_PREFIX)) {
    return {
      id: sortableId.slice(ROOT_SORTABLE_PREFIX.length),
      type: "root" as const,
    };
  }

  if (sortableId.startsWith(CHILD_SORTABLE_PREFIX)) {
    const payload = sortableId.slice(CHILD_SORTABLE_PREFIX.length);
    const separatorIndex = payload.indexOf("::");

    if (separatorIndex <= 0) {
      return null;
    }

    return {
      id: payload.slice(separatorIndex + 2),
      rootId: payload.slice(0, separatorIndex),
      type: "child" as const,
    };
  }

  return null;
}

function moveRoot(roots: RootItem[], activeRootId: string, overRootId: string) {
  const activeIndex = roots.findIndex((root) => root.id === activeRootId);
  const overIndex = roots.findIndex((root) => root.id === overRootId);

  if (activeIndex < 0 || overIndex < 0 || activeIndex === overIndex) {
    return roots;
  }

  return arrayMove(roots, activeIndex, overIndex);
}

function moveChild(roots: RootItem[], activeRootId: string, childId: string, targetRootId: string, targetChildId?: string) {
  const sourceRootIndex = roots.findIndex((root) => root.id === activeRootId);
  const targetRootIndex = roots.findIndex((root) => root.id === targetRootId);

  if (sourceRootIndex < 0 || targetRootIndex < 0) {
    return roots;
  }

  const sourceRoot = roots[sourceRootIndex];
  const targetRoot = roots[targetRootIndex];
  const sourceChildIndex = sourceRoot.children.findIndex((child) => child.id === childId);

  if (sourceChildIndex < 0) {
    return roots;
  }

  const child = sourceRoot.children[sourceChildIndex];
  const nextRoots = roots.map((root) => ({
    ...root,
    children: [...root.children],
  }));

  nextRoots[sourceRootIndex].children.splice(sourceChildIndex, 1);

  const targetChildren = nextRoots[targetRootIndex].children;
  const targetIndex = targetChildId ? targetChildren.findIndex((candidate) => candidate.id === targetChildId) : targetChildren.length;

  if (targetIndex < 0) {
    targetChildren.push(child);
  } else {
    targetChildren.splice(targetIndex, 0, child);
  }

  return nextRoots;
}

const cardStyle: React.CSSProperties = {
  background: "var(--theme-elevation-50)",
  border: "1px solid var(--theme-elevation-150)",
  borderRadius: "14px",
  display: "grid",
  gap: "14px",
  padding: "16px",
};

const rootHandleStyle: React.CSSProperties = {
  alignItems: "center",
  background: "transparent",
  border: 0,
  cursor: "grab",
  display: "flex",
  gap: "10px",
  justifyContent: "space-between",
  padding: 0,
  textAlign: "left",
  width: "100%",
};

const rowButtonStyle: React.CSSProperties = {
  alignItems: "center",
  background: "var(--theme-bg)",
  border: "1px solid var(--theme-elevation-150)",
  borderRadius: "10px",
  cursor: "grab",
  display: "flex",
  justifyContent: "space-between",
  padding: "10px 12px",
  textAlign: "left",
  width: "100%",
};

const badgeStyle: React.CSSProperties = {
  background: "var(--theme-elevation-100)",
  borderRadius: "999px",
  color: "var(--theme-text)",
  fontSize: "12px",
  lineHeight: 1,
  padding: "6px 8px",
  whiteSpace: "nowrap",
};

const helperTextStyle: React.CSSProperties = {
  color: "var(--theme-elevation-600)",
  fontSize: "13px",
  lineHeight: 1.5,
};

const CatalogProductsTaxonomyOrderFieldClient: UIFieldClientComponent = ({ field, path }) => {
  const adminCustom = field.admin?.custom;
  const draftFieldPath = typeof adminCustom === "object" && adminCustom && "draftFieldPath" in adminCustom && typeof adminCustom.draftFieldPath === "string"
    ? adminCustom.draftFieldPath
    : "taxonomyOrderDraft";

  const description = ("description" in field ? field.description : undefined) as never;
  const label = ("label" in field ? field.label : undefined) as never;
  const { setValue, value } = useField<string>({ path: draftFieldPath });
  const [activeDrag, setActiveDrag] = useState<DragMeta | null>(null);
  const [hoveredRootId, setHoveredRootId] = useState<string | null>(null);
  const rootHoverRef = useRef<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const docs = useMemo<TaxonomyDoc[]>(() => {
    const docsValue = (field.admin?.custom as { docs?: TaxonomyDoc[] } | undefined)?.docs;
    return Array.isArray(docsValue) ? docsValue : [];
  }, [field.admin?.custom]);

  const roots = useMemo(() => applyDraft(buildRootItems(docs), parseDraft(value)), [docs, value]);
  const rootIds = useMemo(() => roots.map((root) => getRootSortableId(root.id)), [roots]);

  useEffect(() => {
    rootHoverRef.current = hoveredRootId;
  }, [hoveredRootId]);

  const updateRoots = useCallback(
    (nextRoots: RootItem[]) => {
      setValue(serializeDraft(nextRoots));
    },
    [setValue],
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveDrag(getActiveDragMeta(event));
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const activeMeta = getActiveDragMeta(event);
      const overId = event.over?.id;

      setActiveDrag(null);
      setHoveredRootId(null);

      if (!activeMeta || typeof overId !== "string") {
        return;
      }

      const overMeta = parseSortableId(overId);

      if (!overMeta) {
        return;
      }

      if (activeMeta.type === "root" && overMeta.type === "root") {
        updateRoots(moveRoot(roots, activeMeta.id, overMeta.id));
        return;
      }

      if (activeMeta.type === "child") {
        const targetRootId =
          overMeta.type === "root"
            ? overMeta.id
            : rootHoverRef.current ?? overMeta.rootId ?? activeMeta.rootId;

        if (!activeMeta.rootId || !targetRootId) {
          return;
        }

        updateRoots(
          moveChild(
            roots,
            activeMeta.rootId,
            activeMeta.id,
            targetRootId,
            overMeta.type === "child" ? overMeta.id : undefined,
          ),
        );
      }
    },
    [roots, updateRoots],
  );

  return (
    <div style={{ display: "grid", gap: "14px" }}>
      <FieldLabel htmlFor={path} label={label} required={false} />

      <FieldDescription description={description} path={path} />

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd} onDragStart={handleDragStart} sensors={sensors}>
        <SortableContext items={rootIds} strategy={rectSortingStrategy}>
          <div style={{ display: "grid", gap: "16px" }}>
            {roots.map((root) => (
              <SortableRootCard
                childIds={root.children.map((child) => getChildSortableId(root.id, child.id))}
                item={root}
                key={root.id}
                onChildContainerEnter={setHoveredRootId}
              />
            ))}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeDrag ? (
            activeDrag.type === "root" ? <RootOverlayCard activeDrag={activeDrag} /> : <ChildOverlayRow activeDrag={activeDrag} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default CatalogProductsTaxonomyOrderFieldClient;
