import { PageTitle } from "@/shared/ui/page-title";
import { Section } from "@/shared/ui/section";

export function ContactsPage() {
  return (
    <div className="page">
      <PageTitle>
        Контакты
      </PageTitle>
      <Section className="content-card">
        <p>
          В следующей итерации добавим форму заявки, карту и каналы связи для
          разных типов запросов.
        </p>
      </Section>
    </div>
  );
}
