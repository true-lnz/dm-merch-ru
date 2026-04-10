import { PageHeading } from "../../../shared/ui/page-heading";
import { Section } from "@/shared/ui/section";

export function CatalogPage() {
  return (
    <>
      <PageHeading
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