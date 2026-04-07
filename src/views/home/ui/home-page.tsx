import { PageHeader } from "../../../shared/ui/page-header";
import { Section } from "@/shared/ui/section";

export function HomePage() {
  return (
    <div className="page">
      <PageHeader>
        Главная
      </PageHeader>
      <Section className="content-card">
        <h2>Мерч как инструмент роста бренда</h2>
        <p>
          Здесь будет лендинг с офферами, преимуществами и основными сценариями
          сотрудничества.
        </p>
      </Section>
    </div>
  );
}
