import type { Metadata } from "next";
import { CatalogPage } from "@/views/catalog";

export const metadata: Metadata = {
  title: "Каталог",
};

export default function Page() {
  return <CatalogPage />;
}

