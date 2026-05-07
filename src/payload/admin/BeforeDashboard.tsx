import Link from "next/link";
import type { ReactNode } from "react";

type Shortcut = {
  href: string;
  title: string;
  description: string;
};

const shortcuts: Shortcut[] = [
  {
    href: "/admin/collections/pages",
    title: "Pages",
    description: "SEO, preview и редакторские настройки ключевых страниц.",
  },
  {
    href: "/admin/collections/posts",
    title: "Posts",
    description: "Материалы блога с draft/publish и preview-потоком.",
  },
  {
    href: "/admin/collections/media",
    title: "Media",
    description: "Изображения и assets для SEO и контентных блоков.",
  },
  {
    href: "/admin/globals/site-info",
    title: "Site Info",
    description: "Контакты, адрес и общая информация витрины.",
  },
];

function Card({ children, href }: { children: ReactNode; href: string }) {
  return (
    <Link
      href={href}
      style={{
        display: "block",
        padding: "16px",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 12,
        textDecoration: "none",
        color: "inherit",
        background: "rgba(255,255,255,0.03)",
      }}
    >
      {children}
    </Link>
  );
}

export default function BeforeDashboard() {
  return (
    <div
      style={{
        marginBottom: 24,
        padding: 20,
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.12)",
        background:
          "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ margin: 0, fontSize: 24, lineHeight: 1.2 }}>Редакторский старт</h2>
        <p style={{ margin: "8px 0 0", opacity: 0.8 }}>
          Основной маркетинговый контент теперь живёт в `Pages` и `Posts`. Рабочий поток: черновик,
          preview, публикация.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gap: 12,
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          marginBottom: 16,
        }}
      >
        {shortcuts.map((shortcut) => (
          <Card key={shortcut.href} href={shortcut.href}>
            <strong style={{ display: "block", marginBottom: 6 }}>{shortcut.title}</strong>
            <span style={{ opacity: 0.78 }}>{shortcut.description}</span>
          </Card>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "center",
          fontSize: 14,
          opacity: 0.82,
        }}
      >
        <span>Preview и Live Preview доступны из edit view документа.</span>
        <Link href="/" style={{ color: "inherit" }}>
          Открыть публичный сайт
        </Link>
      </div>
    </div>
  );
}
