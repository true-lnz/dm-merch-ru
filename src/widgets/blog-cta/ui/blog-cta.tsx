import { siteInfo } from "@/shared/config/site-info";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";

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
          <div className="space-y-3">
            <a
              href={`mailto:${siteInfo.email}`}
              className="inline-flex rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white"
            >
              {siteInfo.email}
            </a>
            <div>
              <a
                href={`tel:${siteInfo.phone.replace(/\D+/g, "")}`}
                className="inline-flex rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white"
              >
                {siteInfo.phone}
              </a>
            </div>
          </div>
        </div>

        <form className="space-y-4" noValidate>
          <label className="block">
            <span className="sr-only">Имя</span>
            <Input placeholder="Имя*" name="name" required />
          </label>
          <label className="block">
            <span className="sr-only">Телефон</span>
            <Input placeholder="Телефон*" name="phone" required />
          </label>
          <label className="block">
            <span className="sr-only">Email</span>
            <Input placeholder="Email" type="email" name="email" />
          </label>
          <label className="block">
            <span className="sr-only">Сообщение</span>
            <Textarea placeholder="Сообщение" name="message" />
          </label>

          <label className="flex items-start gap-3 text-xs text-[var(--field-text)]">
            <Checkbox name="privacy" required className="mt-0.5" />
            Нажимая на кнопку &quot;Отправить&quot;, Вы соглашаетесь с Политикой
            конфиденциальности.
          </label>

          <Button type="submit" className="w-full sm:w-[320px]">
            Отправить заявку
          </Button>
        </form>
      </div>
    </section>
  );
}
