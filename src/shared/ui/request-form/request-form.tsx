"use client";

import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { cn } from "@/shared/lib/cn";

const DEFAULT_PRIVACY_CHECKBOX_ID = "request-form-privacy";
const inputClassName =
  "h-11 rounded-none border-0 border-b border-[var(--field-border)] bg-transparent px-0 py-2 text-sm text-[var(--text)] shadow-none placeholder:text-[var(--field-text)] focus-visible:border-[var(--accent)] focus-visible:ring-0";
const textareaClassName =
  "max-h-24 min-h-24 resize-none rounded-none border-0 border-b border-[var(--field-border)] bg-transparent px-0 py-2 text-sm text-[var(--text)] shadow-none placeholder:text-[var(--field-text)] focus-visible:border-[var(--accent)] focus-visible:ring-0";
const checkboxClassName =
  "mt-0.5 border-[var(--field-border)] bg-transparent text-white focus-visible:border-[var(--accent)] focus-visible:ring-0 data-checked:border-[var(--accent)] data-checked:bg-[var(--accent)]";

type RequestFormProps = {
  includeEmail?: boolean;
  privacyCheckboxId?: string;
  formClassName?: string;
  submitClassName?: string;
};

export function RequestForm({
  includeEmail = true,
  privacyCheckboxId = DEFAULT_PRIVACY_CHECKBOX_ID,
  formClassName,
  submitClassName,
}: RequestFormProps) {
  return (
    <form className={cn("space-y-4", formClassName)} noValidate>
      <label className="block">
        <span className="sr-only">Имя</span>
        <Input placeholder="Имя*" name="name" required className={inputClassName} />
      </label>

      <label className="block">
        <span className="sr-only">Телефон</span>
        <Input placeholder="Телефон*" name="phone" required className={inputClassName} />
      </label>

      {includeEmail ? (
        <label className="block">
          <span className="sr-only">Email</span>
          <Input placeholder="Email" type="email" name="email" className={inputClassName} />
        </label>
      ) : null}

      <label className="block">
        <span className="sr-only">Сообщение</span>
        <Textarea placeholder="Сообщение" name="message" className={textareaClassName} />
      </label>

      <div className="flex items-center gap-3 text-xs text-[var(--field-text)] mt-[3rem]">
        <Checkbox id={privacyCheckboxId} name="privacy" required className={checkboxClassName} />
        <label htmlFor={privacyCheckboxId}>
          Нажимая на&nbsp;кнопку &quot;Отправить&quot;, Вы&nbsp;соглашаетесь с&nbsp;Политикой конфиденциальности.
        </label>
      </div>

      <Button type="submit" variant="blue" className={cn("w-full cursor-pointer", submitClassName)}>
        Отправить заявку
      </Button>
    </form>
  );
}
