import { siteInfo } from "@/shared/config/site-info";
import { ContactPills } from "@/shared/ui/contact-pills";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const PRIVACY_CHECKBOX_ID = "blog-cta-privacy";

export function BlogCta() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24" aria-label="Форма заявки">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.05fr]">
        <div className="space-y-5">
          <h2 className="font-heading text-[56px] uppercase leading-[0.95] tracking-[-0.03em] text-[var(--heading)] md:text-[84px]">
            Обсудим задачу
            <br />
            и рассчитаем проект
          </h2>
          <p className="max-w-[600px] text-base text-[var(--text)] md:text-2xl">
            Ответим в течение 30 минут. Подскажем формат, сроки и бюджет.
          </p>
          <ContactPills
            email={siteInfo.email}
            phone={siteInfo.phone}
            direction="column"
            variant="cta"
            className="blog-cta-contact-pills"
          />
        </div>

        <form className="space-y-4" noValidate>
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
              className="min-h-24 rounded-none border-0 border-b border-[var(--field-border)] bg-transparent px-0 py-2 text-sm text-[var(--text)] shadow-none placeholder:text-[var(--field-text)] focus-visible:border-[var(--accent)] focus-visible:ring-0"
            />
          </label>

          <div className="flex items-start gap-3 text-xs text-[var(--field-text)]">
            <Checkbox
              id={PRIVACY_CHECKBOX_ID}
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
            className="h-11 w-full bg-[var(--accent)] px-5 text-sm font-semibold tracking-[-0.02em] text-white hover:bg-[var(--accent-hover)] sm:w-[320px]"
          >
            Отправить заявку
          </Button>
        </form>
      </div>
    </section>
  );
}
