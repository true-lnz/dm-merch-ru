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
    <section className="flex flex-col gap-12">
      {breadcrumb?.href ? (
          <PageBreadcrumb item={breadcrumb} />
      ) : null}
      <h1 className="m-0 font-heading text-[35.6px] font-bold uppercase leading-none tracking-[0.015em] text-[var(--heading)] md:text-[6.125rem]">
        {title}
      </h1>
    </section>
  );
}