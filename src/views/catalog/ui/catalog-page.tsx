import { PageTitle } from "@/shared/ui/page-title";
import { Section } from "@/shared/ui/section";

export function CatalogPage() {
  return (
    <div className="page">
      <PageTitle subtitle="Список товарных категорий и карточек продукции.">
        Каталог
      </PageTitle>
      <Section className="content-card">
        <p>
          На следующем этапе здесь появятся фильтры, карточки позиций и блоки с
          ценовыми пакетами.
        </p>
      </Section>
    </div>
  );
}
