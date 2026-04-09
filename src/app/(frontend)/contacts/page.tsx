import type { Metadata } from "next";
import { ContactsPage } from "@/views/contacts";

export const metadata: Metadata = {
  title: "Контакты",
};

export default function Page() {
  return <ContactsPage />;
}

