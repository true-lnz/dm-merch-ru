import type { ComponentPropsWithoutRef, ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/shared/lib/cn";

type PageBreadcrumbProps = {
  item: {
    labelFrom: string;
    labelTo: string;
    href: string;
  };
  className?: string;
};

export function Breadcrumb({
  className,
  ...props
}: ComponentPropsWithoutRef<"nav">) {
  return (
    <nav
      aria-label="Хлебные крошки"
      className={cn(
        "flex flex-wrap items-center gap-2 text-[0.8125rem] leading-[1.3] tracking-[-0.02em] text-[var(--text-muted)]",
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
  className,
}: PageBreadcrumbProps) {

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href={item.href}>{item.labelFrom}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{item.labelTo}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>

  );
}
