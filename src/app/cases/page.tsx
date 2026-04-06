import type { Metadata } from "next";
import { CasesPage } from "@/views/cases";

export const metadata: Metadata = {
  title: "Кейсы",
};

export default function Page() {
  return <CasesPage />;
}

