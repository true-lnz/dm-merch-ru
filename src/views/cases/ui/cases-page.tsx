import { PageHeader } from "../../../shared/ui/page-header";
import { Section } from "@/shared/ui/section";

export function CasesPage() {
  return (
    <div className="page">
      <PageHeader title="Кейсы" />
      <Section className="content-card">
        <p>
          Здесь будет витрина работ: задачи клиента, формат мерча, сроки и эффект
          после запуска.
        </p>
      </Section>
    </div>
  );
}