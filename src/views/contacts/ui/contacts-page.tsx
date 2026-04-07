import { PageHeader } from "../../../shared/ui/page-header";
import { Section } from "@/shared/ui/section";

export function ContactsPage() {
  return (
    <div className="page">
      <PageHeader title="Контакты" />
      <Section className="content-card">
        <p>
          В следующей итерации добавим форму заявки, карту и каналы связи для
          разных типов запросов.
        </p>
      </Section>
    </div>
  );
}