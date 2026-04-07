import { Fragment, type ComponentPropsWithoutRef, type ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/shared/lib/cn";

export type PageBreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumb({
  className,
  ...props
}: ComponentPropsWithoutRef<"nav">) {
  return (
    <nav
      aria-label="Хлебные крошки"
      className={cn("breadcrumb", className)}
      {...props}
    />
  );
}

export function BreadcrumbList({
  className,
  ...props
}: ComponentPropsWithoutRef<"ol">) {
  return (
    <ol
      className={cn("flex flex-wrap items-center gap-2 text-inherit", className)}
      {...props}
    />
  );
}

export function BreadcrumbItem({
  className,
  ...props
}: ComponentPropsWithoutRef<"li">) {
  return <li className={cn("inline-flex items-center gap-2", className)} {...props} />;
}

export function BreadcrumbLink({
  className,
  href,
  children,
}: {
  className?: string;
  href: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={cn("transition-colors hover:text-[var(--text)]", className)}>
      {children}
    </Link>
  );
}

export function BreadcrumbPage({
  className,
  ...props
}: ComponentPropsWithoutRef<"span">) {
  return <span aria-current="page" className={cn("text-[var(--text-muted)]", className)} {...props} />;
}

export function BreadcrumbSeparator({
  className,
  children = "/",
  ...props
}: ComponentPropsWithoutRef<"li">) {
  return (
    <li
      aria-hidden="true"
      className={cn("inline-flex items-center text-[var(--text-muted)]", className)}
      {...props}
    >
      {children}
    </li>
  );
}

export function PageBreadcrumb({
  items,
  className,
}: {
  items: PageBreadcrumbItem[];
  className?: string;
}) {
  if (!items.length) {
    return null;
  }

  return (
    <Breadcrumb className={cn("page-title-crumbs", className)}>
      <BreadcrumbList>
        {items.map((item, index) => (
          <Fragment key={`${item.label}-${index}`}>
            <BreadcrumbItem>
              {item.href ? (
                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
            {index < items.length - 1 ? <BreadcrumbSeparator /> : null}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
