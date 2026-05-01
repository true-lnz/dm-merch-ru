import type { Metadata } from "next";
import { CatalogProductsPage } from "@/views/catalog-products";
import { getCatalogProductsLandingData } from "@/views/catalog-products/model/catalog-products-data";

export const metadata: Metadata = {
  title: "Каталог продукции",
  description: "Посадочная страница каталога продукции: статьи, категории и подкатегории мерча и корпоративных подарков.",
  alternates: {
    canonical: "/catalog-products",
  },
};

export default async function Page() {
  const data = await getCatalogProductsLandingData();

  return <CatalogProductsPage data={data} />;
}
