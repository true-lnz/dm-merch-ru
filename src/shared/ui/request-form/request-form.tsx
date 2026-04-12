"use client";

import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";

const DEFAULT_PRIVACY_CHECKBOX_ID = "request-form-privacy";

const fieldBaseClassName =
  "rounded-none border-0 border-b bg-transparent px-0 py-2 text-sm shadow-none focus-visible:ring-0";

const fieldSurfaceClassName =
  "border-[var(--field-border)] text-[var(--text)] placeholder:text-[var(--field-text)] focus-visible:border-[var(--accent)] group-data-[surface=accent]/form:border-white/40 group-data-[surface=accent]/form:text-white group-data-[surface=accent]/form:placeholder:text-white/60 group-data-[surface=accent]/form:focus-visible:border-white";

const inputClassName = cn(
  fieldBaseClassName,
  fieldSurfaceClassName,
  "h-11",
);

const textareaClassName = cn(
  fieldBaseClassName,
  fieldSurfaceClassName,
  "max-h-24 min-h-24 resize-none",
);

const checkboxClassName =
  "mt-0.5 border-[var(--field-border)] bg-transparent text-white focus-visible:border-[var(--accent)] focus-visible:ring-0 data-checked:border-[var(--accent)] data-checked:bg-[var(--accent)] group-data-[surface=accent]/form:border-white/55 group-data-[surface=accent]/form:focus-visible:border-white group-data-[surface=accent]/form:data-checked:border-white group-data-[surface=accent]/form:data-checked:bg-white group-data-[surface=accent]/form:data-checked:text-[var(--accent)]";

const privacyTextClassName =
  "mt-[3rem] flex items-center gap-3 text-xs text-[var(--field-text)] cursor-pointer group-data-[surface=accent]/form:text-white/70";

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
    <form
      data-surface={onAccentSurface ? "accent" : "default"}
      className={cn("group/form space-y-4", formClassName)}
      noValidate
    >
      <label className="block">
        <span className="sr-only">Имя</span>
        <Input
          placeholder="Имя*"
          name="name"
          required
          className={inputClassName}
        />
      </label>

      <label className="block">
        <span className="sr-only">Телефон</span>
        <Input
          placeholder="Телефон*"
          name="phone"
          required
          className={inputClassName}
        />
      </label>

      {includeEmail ? (
        <label className="block">
          <span className="sr-only">Email</span>
          <Input
            placeholder="Email"
            type="email"
            name="email"
            className={inputClassName}
          />
        </label>
      ) : null}

      <label className="block">
        <span className="sr-only">Сообщение</span>
        <Textarea
          placeholder="Сообщение"
          name="message"
          className={textareaClassName}
        />
      </label>

      <div className={privacyTextClassName}>
        <Checkbox
          id={privacyCheckboxId}
          name="privacy"
          required
          className={checkboxClassName}
        />
        <label htmlFor={privacyCheckboxId} className="cursor-pointer">
          Нажимая на&nbsp;кнопку &quot;Отправить&quot;, Вы&nbsp;соглашаетесь
          с&nbsp;Политикой конфиденциальности.
        </label>
      </div>

      <Button
        type="submit"
        variant="blue"
        className={cn("h-[47px] w-full cursor-pointer text-lg", submitClassName)}
      >
        {submitLabel}
      </Button>
    </form>
  );
}