import type { PropsWithChildren } from "react";

type PageHeaderProps = PropsWithChildren;

export function PageHeader({
  children,
}: PageHeaderProps) {
  return (
      <h1 className="page-title-heading">{children}</h1>
  );
}
