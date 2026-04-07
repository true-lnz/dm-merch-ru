import type { PropsWithChildren } from "react";

type PageTitleProps = PropsWithChildren;

export function PageTitle({
  children,
}: PageTitleProps) {
  return (
      <h1 className="page-title-heading">{children}</h1>
  );
}
