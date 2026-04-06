import { PageTitle } from "@/shared/ui/page-title";
import { Section } from "@/shared/ui/section";

export function HomePage() {
  return (
    <div className="page">
      <PageTitle subtitle="Базовая стартовая страница с вводным позиционированием.">
        Главная
      </PageTitle>
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
