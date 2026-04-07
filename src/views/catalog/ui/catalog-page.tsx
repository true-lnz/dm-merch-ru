import { PageHeader } from "../../../shared/ui/page-header";
import { Section } from "@/shared/ui/section";

export function CatalogPage() {
  return (
    <div className="page">
      <PageHeader>
        Каталог
      </PageHeader>
      <Section className="content-card">
        <p>
          На следующем этапе здесь появятся фильтры, карточки позиций и блоки с
          ценовыми пакетами.
        </p>
      </Section>
    </div>
  );
}
