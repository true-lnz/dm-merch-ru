import type { HeaderNavigationItem } from "@/shared/config/navigation";
import { staticHeaderSecondaryNavigation } from "@/shared/config/navigation";
import { getCatalogMenuCategories } from "@/shared/lib/payload/catalog-pages";
import { HeaderClient } from "./header.client";

export async function Header() {
  const catalogCategories = await getCatalogMenuCategories();
  const headerNavigation: HeaderNavigationItem[] = [
    {
      href: "/catalog",
      label: "Каталог",
      children: [
        ...catalogCategories.map((item) => ({
          href: item.slug === "catalog" ? "/catalog" : `/catalog/${item.slug}`,
          label: item.title,
        })),
        { href: "/catalog-products", label: "Каталог продукции" },
      ],
    },
    ...staticHeaderSecondaryNavigation,
  ];

  return <HeaderClient headerNavigation={headerNavigation} />;
}
