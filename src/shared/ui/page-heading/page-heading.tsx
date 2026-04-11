import { PageBreadcrumb } from "@/shared/ui/breadcrumb";

type PageHeadingProps = {
  title: string;
  breadcrumb?: {
      labelFrom: string;
      labelTo: string;
      href: string;
  };
};

export function PageHeading({
  title,
  breadcrumb,
}: PageHeadingProps) {
  return (
    <section className="flex flex-col">
      {breadcrumb?.href ? (
          <PageBreadcrumb item={breadcrumb} />
      ) : null}
      <h1 className="m-0 font-heading text-4xl md:text-6xl xl:text-7xl font-bold uppercase text-[var(--heading)]">
        {title}
      </h1>
    </section>
  );
}