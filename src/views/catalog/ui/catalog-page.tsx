import { PageHeader } from "../../../shared/ui/page-header";
import { Section } from "@/shared/ui/section";

export function CatalogPage() {
  return (
    <>
      <PageHeader
        title="Каталог"
        breadcrumb={{
          labelFrom: "Главная",
          labelTo: "Каталог",
          href: "/"
        }}
      />

      <Section className="content-card">
        <p>
          На следующем этапе здесь появятся фильтры, карточки позиций и блоки с
          ценовыми пакетами.
        </p>
      </Section>
    </>
  );
}