import { PageTitle } from "@/shared/ui/page-title";
import { Section } from "@/shared/ui/section";

export function CasesPage() {
  return (
    <div className="page">
      <PageTitle subtitle="Кейсы реализованных проектов с результатами.">
        Кейсы
      </PageTitle>
      <Section className="content-card">
        <p>
          Здесь будет витрина работ: задачи клиента, формат мерча, сроки и эффект
          после запуска.
        </p>
      </Section>
    </div>
  );
}
