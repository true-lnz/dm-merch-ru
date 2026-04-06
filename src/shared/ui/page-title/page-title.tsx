import type { PropsWithChildren } from "react";

type PageTitleProps = PropsWithChildren<{
  subtitle: string;
}>;

export function PageTitle({ subtitle, children }: PageTitleProps) {
  return (
    <header style={{ marginBottom: "1.5rem" }}>
      <h1 style={{ fontSize: "2rem", margin: 0 }}>{children}</h1>
      <p style={{ marginTop: "0.5rem", color: "var(--text-muted)" }}>{subtitle}</p>
    </header>
  );
}
