import type { Metadata } from "next";
import { CatalogPage } from "@/views/catalog";
import { getCatalogData } from "@/views/catalog/model/catalog-data";

export const metadata: Metadata = {
  title: "Каталог",
};

type CatalogSearchParams = {
  category?: string;
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<CatalogSearchParams>;
}) {
  const { category } = await searchParams;
  const data = getCatalogData(category);

  return <CatalogPage data={data} />;
}
