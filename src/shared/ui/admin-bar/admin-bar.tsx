import { PreviewRefresh } from "./preview-refresh";

type AdminBarProps = {
  currentPath: string;
  editHref?: string;
  title?: string;
};

export function AdminBar({ currentPath, editHref, title }: AdminBarProps) {
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        padding: "10px 16px",
        background: "rgba(16, 16, 16, 0.92)",
        color: "#fff",
        borderBottom: "1px solid rgba(255,255,255,0.12)",
        backdropFilter: "blur(14px)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <strong style={{ fontSize: 14 }}>Preview mode</strong>
        {title ? <span style={{ fontSize: 14, opacity: 0.8 }}>{title}</span> : null}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        {editHref ? (
          <a
            href={editHref}
            style={{
              color: "#fff",
              textDecoration: "none",
              fontSize: 14,
            }}
          >
            Edit in Payload
          </a>
        ) : null}
        <a
          href={`/next/exit-preview?redirect=${encodeURIComponent(currentPath)}`}
          style={{
            color: "#fff",
            textDecoration: "none",
            fontSize: 14,
            padding: "6px 10px",
            borderRadius: 999,
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          Exit preview
        </a>
      </div>
      <PreviewRefresh />
    </div>
  );
}
