import { getCasesPageData } from "@/views/cases/model/get-cases-page-data";
import { CasesPage } from "@/views/cases";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Кейсы",
};

export default async function Page() {
  const data = await getCasesPageData();

  return <CasesPage items={data.items} themes={data.themes} />;
}
