import { PageSubheading } from "@/shared/ui/page-subheading";
import type { CatalogProductsLandingCategory } from "@/widgets/catalog-products/model/types";
import Link from "next/link";

type CatalogProductsCategoriesProps = {
  items: CatalogProductsLandingCategory[];
};

function CatalogCategoryIcon({ iconId }: { iconId?: string }) {
  if (!iconId) {
    return null;
  }

  return (
    <svg
      className="h-[30px] w-[60px] shrink-0 text-[var(--heading)]"
      viewBox="0 0 60 50"
      fill="none"
      aria-hidden="true"
      style={
        {
          "--catalog-icon-fill": "#ecebe6",
          "--color-print": "#0252c5",
        } as React.CSSProperties
      }
    >
      <use href={`/catalog-products/icons-catalog.svg#${iconId}`} />
    </svg>
  );
}

export function CatalogProductsCategories({ items }: CatalogProductsCategoriesProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="my-[35px] md:my-[45px]">
      <PageSubheading title="Мерч и корпоративные подарки" />

      <div className="mt-8 flex flex-col items-start gap-6 md:mt-10 md:flex-row md:flex-wrap md:justify-center md:gap-x-6 md:gap-y-8">
        {items.map((category) => (
          <article key={category.id} className="relative w-full max-w-[320px] overflow-hidden md:w-[220px] md:max-w-[220px]">
            <div className="absolute inset-x-0 bottom-0 h-[84px] bg-[linear-gradient(180deg,rgba(245,244,239,0)_0%,rgba(245,244,239,1)_100%)] pointer-events-none md:block hidden" />
            <div className="relative flex items-center gap-3">
              <CatalogCategoryIcon iconId={category.iconId} />
              <h3 className="text-lg font-medium leading-[1.2] tracking-[-0.03em] text-[var(--heading)]">
                {category.title}
              </h3>
            </div>

            <div className="mt-2 flex flex-col items-start">
              {category.subcategories.map((subcategory) => (
                <Link
                  key={subcategory.id}
                  href={subcategory.href}
                  className="inline-block max-w-full truncate rounded-[5px] px-[10px] py-[4px] text-[15px] leading-[1.3] tracking-[-0.03em] text-[var(--heading)] transition-colors duration-150 hover:bg-[var(--heading)] hover:text-white"
                  title={subcategory.title}
                >
                  {subcategory.title}
                </Link>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
