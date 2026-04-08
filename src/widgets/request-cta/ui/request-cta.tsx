import { siteInfo } from "@/shared/config/site-info";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { ContactPills } from "@/shared/ui/contact-pills";
import { Input } from "@/shared/ui/input";
import { PageSubheader } from "@/shared/ui/page-subheader";
import { Textarea } from "@/shared/ui/textarea";

const PRIVACY_CHECKBOX_ID = "request-cta-privacy";

export function RequestCta() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24" aria-label="Форма заявки">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:grid-rows-[auto_1fr]">
        <div className="space-y-5">
          <PageSubheader
          title={
            <>
              Обсудим задачу
              <br />
              и рассчитаем проект
            </>
          }
          />
          <p className="max-w-[800px] text-base text-[var(--text)] md:text-[21.6px] tracking-[0.0354]">
            Ответим в течение 30 минут. Подскажем формат, сроки и бюджет.
          </p>
        </div>

        <form className="space-y-4 lg:row-span-2" noValidate>
          <label className="block">
            <span className="sr-only">Имя</span>
            <Input
              placeholder="Имя*"
              name="name"
              required
              className="h-11 rounded-none border-0 border-b border-[var(--field-border)] bg-transparent px-0 py-2 text-sm text-[var(--text)] shadow-none placeholder:text-[var(--field-text)] focus-visible:border-[var(--accent)] focus-visible:ring-0"
            />
          </label>
          <label className="block">
            <span className="sr-only">Телефон</span>
            <Input
              placeholder="Телефон*"
              name="phone"
              required
              className="h-11 rounded-none border-0 border-b border-[var(--field-border)] bg-transparent px-0 py-2 text-sm text-[var(--text)] shadow-none placeholder:text-[var(--field-text)] focus-visible:border-[var(--accent)] focus-visible:ring-0"
            />
          </label>
          <label className="block">
            <span className="sr-only">Email</span>
            <Input
              placeholder="Email"
              type="email"
              name="email"
              className="h-11 rounded-none border-0 border-b border-[var(--field-border)] bg-transparent px-0 py-2 text-sm text-[var(--text)] shadow-none placeholder:text-[var(--field-text)] focus-visible:border-[var(--accent)] focus-visible:ring-0"
            />
          </label>
          <label className="block">
            <span className="sr-only">Сообщение</span>
            <Textarea
              placeholder="Сообщение"
              name="message"
              className="min-h-24 resize-none rounded-none border-0 border-b border-[var(--field-border)] bg-transparent px-0 py-2 text-sm text-[var(--text)] shadow-none placeholder:text-[var(--field-text)] focus-visible:border-[var(--accent)] focus-visible:ring-0"
            />
          </label>

          <div className="flex items-center gap-3 text-xs text-[var(--field-text)]">
            <Checkbox
              name="privacy"
              required
              className="mt-0.5 border-[var(--field-border)] bg-transparent text-white focus-visible:border-[var(--accent)] focus-visible:ring-0 data-checked:border-[var(--accent)] data-checked:bg-[var(--accent)]"
            />
            <label htmlFor={PRIVACY_CHECKBOX_ID}>
              Нажимая на кнопку &quot;Отправить&quot;, Вы соглашаетесь с Политикой
              конфиденциальности.
            </label>
          </div>

          <Button
            type="submit"
            variant="blue"
            className="w-full lg:w-[440px] cursor-pointer"
          >
            Отправить заявку
          </Button>
        </form>

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
