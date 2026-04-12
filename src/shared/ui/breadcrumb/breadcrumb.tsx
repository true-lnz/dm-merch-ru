import type { ComponentPropsWithoutRef, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/shared/lib/cn";

type BreadcrumbLinkItem = {
  label: string;
  href: string;
};

type LegacyBreadcrumbItem = {
  labelFrom: string;
  labelTo: string;
  href: string;
};

type PageBreadcrumbProps = {
  item?: LegacyBreadcrumbItem;
  items?: BreadcrumbLinkItem[];
  currentLabel?: string;
  className?: string;
};

function normalizeBreadcrumbs({
  item,
  items,
  currentLabel,
}: Pick<PageBreadcrumbProps, "item" | "items" | "currentLabel">) {
  if (items?.length) {
    return {
      items,
      currentLabel,
    };
  }

  if (item) {
    return {
      items: [{ label: item.labelFrom, href: item.href }],
      currentLabel: item.labelTo,
    };
  }

  return {
    items: [],
    currentLabel: undefined,
  };
}

export function Breadcrumb({
  className,
  ...props
}: ComponentPropsWithoutRef<"nav">) {
  return (
    <nav
      aria-label="Хлебные крошки"
      className={cn(
        "flex flex-wrap items-center gap-2 text-xs leading-[1.3] tracking-[-0.02em] text-[var(--text-muted)] md:text-sm",
        className,
      )}
      {...props}
    />
  );
}

export function BreadcrumbItem({
  className,
  ...props
}: ComponentPropsWithoutRef<"span">) {
  return <span className={cn("inline-flex items-center gap-2", className)} {...props} />;
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
    <Link
      href={href}
      className={cn("transition-colors hover:text-[var(--text)]", className)}
    >
      {children}
    </Link>
  );
}

export function BreadcrumbList({
  className,
  ...props
}: ComponentPropsWithoutRef<"ol">) {
  return (
    <ol
      className={cn("flex flex-wrap items-center gap-2", className)}
      {...props}
    />
  );
}

export function BreadcrumbPage({
  className,
  ...props
}: ComponentPropsWithoutRef<"span">) {
  return <span aria-current="page" className={className} {...props} />;
}

export function BreadcrumbSeparator({
  className,
  children = "/",
  ...props
}: ComponentPropsWithoutRef<"span">) {
  return (
    <span aria-hidden="true" className={className} {...props}>
      {children}
    </span>
  );
}

export function PageBreadcrumb({
  item,
  items,
  currentLabel,
  className,
}: PageBreadcrumbProps) {
  const normalized = normalizeBreadcrumbs({ item, items, currentLabel });

  if (!normalized.items.length || !normalized.currentLabel) {
    return null;
  }

  return (
    <Breadcrumb className={cn("mb-4 mt-8 md:mb-4 md:mt-12 xl:mb-[36px] xl:mt-[70px]", className)}>
      <BreadcrumbList>
        {normalized.items.map((breadcrumbItem) => (
          <BreadcrumbItem key={breadcrumbItem.href}>
            <BreadcrumbLink href={breadcrumbItem.href}>{breadcrumbItem.label}</BreadcrumbLink>
            <BreadcrumbSeparator />
          </BreadcrumbItem>
        ))}
        <BreadcrumbItem>
          <BreadcrumbPage>{normalized.currentLabel}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
