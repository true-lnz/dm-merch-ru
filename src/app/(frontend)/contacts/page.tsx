import type { Metadata } from "next";

import { getDocumentAdminPath } from "@/payload/preview";
import { getContactsPageDocument, getContactsPageMetadata } from "@/shared/lib/payload/contacts-page";
import { isDraftModeEnabled } from "@/shared/lib/payload/page-docs";
import { AdminBar } from "@/shared/ui/admin-bar";
import { ContactsPage } from "@/views/contacts";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return getContactsPageMetadata();
}

export default async function Page() {
  const isDraft = await isDraftModeEnabled();
  const page = await getContactsPageDocument();

  return (
    <>
      {isDraft && page ? (
        <AdminBar currentPath="/contacts" editHref={getDocumentAdminPath("contacts-page", page.id)} title="Контакты: настройки" />
      ) : null}
      <ContactsPage />
    </>
  );
}
