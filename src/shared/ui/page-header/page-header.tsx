import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/ui/breadcrumb";

export type PageHeaderBreadcrumbItem = {
  label: string;
  href?: string;
};

type PageHeaderProps = {
  title: string;
  breadcrumbs?: PageHeaderBreadcrumbItem[];
};

export function PageHeader({
  title,
  breadcrumbs = [],
}: PageHeaderProps) {
  return (
    <header className="mb-8 flex flex-col gap-4 md:mb-12">
      {breadcrumbs.length > 0 ? (
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((item, index) => (
              <Fragment key={`${item.label}-${index}`}>
                <BreadcrumbItem>
                  {item.href ? (
                    <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 ? <BreadcrumbSeparator /> : null}
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      ) : null}

      <h1 className="m-0 font-heading text-[2rem] font-bold uppercase leading-none tracking-[0.015em] text-[var(--heading)] md:text-[3.5rem]">
        {title}
      </h1>
    </header>
  );
}
