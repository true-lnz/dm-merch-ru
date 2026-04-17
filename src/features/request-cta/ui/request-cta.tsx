import { siteInfo } from "@/shared/config/site-info";
import { ContactPills } from "@/shared/ui/contact-pills";
import { RequestForm } from "@/shared/ui/request-form";
import { PageSubheading } from "@/shared/ui/page-subheading";

export function RequestCta() {
  return (
    <section
      className="relative my-[43px] overflow-hidden md:my-[52px] xl:my-[70px]"
      aria-label="Форма заявки"
    >
      <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:grid-rows-[auto_1fr]">
        <div className="space-y-5">
          <PageSubheading
            title={(
              <>
                Обсудим задачу
                <br />
                и рассчитаем проект
              </>
            )}
          />
          <p className="max-w-[800px] text-base tracking-[0.0354] text-[var(--text)] md:text-2xl">
            Ответим в течение 30 минут. Подскажем формат, сроки и бюджет.
          </p>
        </div>

        <RequestForm
          formClassName="lg:row-span-2"
          privacyCheckboxId="request-cta-privacy"
          submitClassName="lg:w-[440px]"
        />

        <ContactPills
          email={siteInfo.email}
          phone={siteInfo.phone}
          variant="cta"
          className="w-full lg:w-auto lg:self-end"
        />
      </div>
    </section>
  );
}
