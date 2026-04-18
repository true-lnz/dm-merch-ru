import type { Metadata } from "next";
import { PartnerCatalogPage } from "@/views/partner-catalog";
import { getPartnerCatalogData } from "@/views/partner-catalog/model/partner-catalog-data";

export const metadata: Metadata = {
  title: "Каталог продукции",
};

export default function Page() {
  return <PartnerCatalogPage data={getPartnerCatalogData()} />;
}
