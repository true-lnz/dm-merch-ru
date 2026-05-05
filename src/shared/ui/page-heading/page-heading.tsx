import { PageBreadcrumb } from "@/shared/ui/breadcrumb";

type PageHeadingBreadcrumb = {
  labelFrom: string;
  labelTo: string;
  href: string;
};

type PageHeadingProps = {
  title: string;
  breadcrumb?:
    | PageHeadingBreadcrumb
    | {
        items: { label: string; href: string }[];
        currentLabel: string;
        currentLabelClassName?: string;
        currentLabelTitle?: string;
      };
};

export function PageHeading({ title, breadcrumb }: PageHeadingProps) {
  return (
    <section className="flex flex-col">
      {breadcrumb
        ? "href" in breadcrumb
          ? <PageBreadcrumb item={breadcrumb} />
          : (
              <PageBreadcrumb
                items={breadcrumb.items}
                currentLabel={breadcrumb.currentLabel}
                currentLabelClassName={breadcrumb.currentLabelClassName}
                currentLabelTitle={breadcrumb.currentLabelTitle}
              />
            )
        : null}
      <h1 className="md:whitespace-pre-line m-0 font-heading text-4xl md:text-6xl xl:text-[72px] 2xl:text-7xl font-bold uppercase text-[var(--heading)]">
        {title}
      </h1>
    </section>
  );
}
