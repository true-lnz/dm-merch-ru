import type { Metadata } from "next";
import { PartnerCatalogPage } from "@/views/partner-catalog";

export const metadata: Metadata = {
  title: "Каталог партнерских товаров",
};

export default function Page() {
  return <PartnerCatalogPage />;
}
