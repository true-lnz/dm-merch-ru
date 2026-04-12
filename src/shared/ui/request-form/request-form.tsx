"use client";

import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";

const DEFAULT_PRIVACY_CHECKBOX_ID = "request-form-privacy";
const inputClassName =
  "h-11 rounded-none border-0 border-b border-[var(--field-border)] bg-transparent px-0 py-2 text-sm text-[var(--text)] shadow-none placeholder:text-[var(--field-text)] focus-visible:border-[var(--accent)] focus-visible:ring-0";
const inputClassNameOnAccent =
  "focus-visible:border-white";
const textareaClassName =
  "max-h-24 min-h-24 resize-none rounded-none border-0 border-b border-[var(--field-border)] bg-transparent px-0 py-2 text-sm text-[var(--text)] shadow-none placeholder:text-[var(--field-text)] focus-visible:border-[var(--accent)] focus-visible:ring-0";
const textareaClassNameOnAccent =
  "focus-visible:border-white";
const checkboxClassName =
  "mt-0.5 border-[var(--field-border)] bg-transparent text-white focus-visible:border-[var(--accent)] focus-visible:ring-0 data-checked:border-[var(--accent)] data-checked:bg-[var(--accent)]";
const checkboxClassNameOnAccent =
  "border-white/55 text-[var(--accent)] focus-visible:border-white data-checked:border-white data-checked:bg-white data-checked:text-[var(--accent)]";

type RequestFormProps = {
  includeEmail?: boolean;
  privacyCheckboxId?: string;
  formClassName?: string;
  submitClassName?: string;
  submitLabel?: string;
  onAccentSurface?: boolean;
};

export function RequestForm({
  includeEmail = true,
  privacyCheckboxId = DEFAULT_PRIVACY_CHECKBOX_ID,
  formClassName,
  submitClassName,
  submitLabel = "Отправить заявку",
  onAccentSurface = false,
}: RequestFormProps) {
  return (
    <form className={cn("space-y-4", formClassName)} noValidate>
      <label className="block">
        <span className="sr-only">Имя</span>
        <Input
          placeholder="Имя*"
          name="name"
          required
          className={cn(inputClassName, onAccentSurface && inputClassNameOnAccent)}
        />
      </label>

      <label className="block">
        <span className="sr-only">Телефон</span>
        <Input
          placeholder="Телефон*"
          name="phone"
          required
          className={cn(inputClassName, onAccentSurface && inputClassNameOnAccent)}
        />
      </label>

      {includeEmail ? (
        <label className="block">
          <span className="sr-only">Email</span>
          <Input
            placeholder="Email"
            type="email"
            name="email"
            className={cn(inputClassName, onAccentSurface && inputClassNameOnAccent)}
          />
        </label>
      ) : null}

      <label className="block">
        <span className="sr-only">Сообщение</span>
        <Textarea
          placeholder="Сообщение"
          name="message"
          className={cn(textareaClassName, onAccentSurface && textareaClassNameOnAccent)}
        />
      </label>

      <div className="flex items-center gap-3 text-xs text-[var(--field-text)] mt-[3rem] cursor-pointer">
        <Checkbox
          id={privacyCheckboxId}
          name="privacy"
          required
          className={cn(checkboxClassName, onAccentSurface && checkboxClassNameOnAccent)}
        />
        <label htmlFor={privacyCheckboxId} className="cursor-pointer">
          Нажимая на&nbsp;кнопку &quot;Отправить&quot;, Вы&nbsp;соглашаетесь с&nbsp;Политикой конфиденциальности.
        </label>
      </div>

      <Button type="submit" variant="blue" className={cn("w-full h-[47px] text-lg cursor-pointer", submitClassName)}>
        {submitLabel}
      </Button>
    </form>
  );
}
