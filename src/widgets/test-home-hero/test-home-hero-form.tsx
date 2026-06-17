"use client";

import type { RequestErrorResponse, RequestSuccessResponse } from "@/shared/lib/request-mail/types";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { Input } from "@/shared/ui/input";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useState, type ChangeEvent, type ClipboardEvent, type FocusEvent, type FormEvent, type KeyboardEvent, type MouseEvent } from "react";

const PHONE_MASK_TEMPLATE = "+7 (___) ___-__-__";
const PHONE_DIGIT_POSITIONS = [4, 5, 6, 9, 10, 11, 13, 14, 16, 17] as const;
const PHONE_MAX_DIGITS = PHONE_DIGIT_POSITIONS.length;
const PHONE_PATTERN = "^\\+7 \\(\\d{3}\\) \\d{3}-\\d{2}-\\d{2}$";
const HONEYPOT_FIELD_NAME = "website";

function normalizePhoneDigits(value: string) {
  const digitsOnly = value.replace(/\D/g, "");

  if (digitsOnly.length === 0) {
    return "";
  }

  if (value.trim().startsWith("+7") && digitsOnly.startsWith("7")) {
    return digitsOnly.slice(1, 1 + PHONE_MAX_DIGITS);
  }

  if (digitsOnly.length >= 11 && (digitsOnly.startsWith("7") || digitsOnly.startsWith("8"))) {
    return digitsOnly.slice(1, 1 + PHONE_MAX_DIGITS);
  }

  return digitsOnly.slice(0, PHONE_MAX_DIGITS);
}

function applyPhoneMask(digits: string) {
  const normalizedDigits = normalizePhoneDigits(digits);
  const maskedChars = PHONE_MASK_TEMPLATE.split("");

  for (let index = 0; index < PHONE_DIGIT_POSITIONS.length; index += 1) {
    const char = normalizedDigits[index];

    if (!char) {
      break;
    }

    maskedChars[PHONE_DIGIT_POSITIONS[index]] = char;
  }

  return maskedChars.join("");
}

function getPhoneCursorPosition(digitsCount: number) {
  if (digitsCount <= 0) {
    return PHONE_DIGIT_POSITIONS[0];
  }

  if (digitsCount >= PHONE_MAX_DIGITS) {
    return PHONE_MASK_TEMPLATE.length;
  }

  return PHONE_DIGIT_POSITIONS[digitsCount];
}

function countDigitsBeforePosition(position: number) {
  let count = 0;

  for (const digitPosition of PHONE_DIGIT_POSITIONS) {
    if (digitPosition < position) {
      count += 1;
    }
  }

  return count;
}

function countDigitsInRange(start: number, end: number) {
  let count = 0;

  for (const digitPosition of PHONE_DIGIT_POSITIONS) {
    if (digitPosition >= start && digitPosition < end) {
      count += 1;
    }
  }

  return count;
}

export function TestHomeHeroForm() {
  const privacyCheckboxId = useId();
  const honeypotFieldId = useId();
  const pathname = usePathname();
  const [phoneDigits, setPhoneDigits] = useState("");
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const maskedPhoneValue = isPhoneFocused || phoneDigits.length > 0 ? applyPhoneMask(phoneDigits) : "";

  function setPhoneCaret(target: HTMLInputElement, digitsCount: number) {
    const position = getPhoneCursorPosition(digitsCount);

    requestAnimationFrame(() => {
      target.setSelectionRange(position, position);
    });
  }

  function handlePhoneChange(event: ChangeEvent<HTMLInputElement>) {
    const nextDigits = normalizePhoneDigits(event.target.value);
    setPhoneDigits(nextDigits);
    setPhoneCaret(event.target, nextDigits.length);
  }

  function handlePhoneFocus(event: FocusEvent<HTMLInputElement>) {
    setIsPhoneFocused(true);
    setPhoneCaret(event.target, phoneDigits.length);
  }

  function handlePhoneBlur() {
    setIsPhoneFocused(false);
  }

  function handlePhoneClick(event: MouseEvent<HTMLInputElement>) {
    if (phoneDigits.length > 0) {
      return;
    }

    setPhoneCaret(event.currentTarget, 0);
  }

  function handlePhonePaste(event: ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();

    const pasted = event.clipboardData.getData("text");
    const nextDigits = normalizePhoneDigits(pasted);

    setPhoneDigits(nextDigits);
    setPhoneCaret(event.currentTarget, nextDigits.length);
  }

  function handlePhoneKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Backspace" && event.key !== "Delete") {
      return;
    }

    const selectionStart = event.currentTarget.selectionStart ?? 0;
    const selectionEnd = event.currentTarget.selectionEnd ?? 0;
    const hasSelection = selectionEnd > selectionStart;

    if (hasSelection) {
      event.preventDefault();

      const digitStartIndex = countDigitsBeforePosition(selectionStart);
      const selectedDigitsCount = countDigitsInRange(selectionStart, selectionEnd);
      const nextDigits = `${phoneDigits.slice(0, digitStartIndex)}${phoneDigits.slice(digitStartIndex + selectedDigitsCount)}`;

      setPhoneDigits(nextDigits);
      setPhoneCaret(event.currentTarget, digitStartIndex);
      return;
    }

    if (phoneDigits.length === 0) {
      event.preventDefault();
      setPhoneCaret(event.currentTarget, 0);
      return;
    }

    event.preventDefault();
    const digitIndexAtCaret = countDigitsBeforePosition(selectionStart);
    const removeIndex = event.key === "Backspace" ? digitIndexAtCaret - 1 : digitIndexAtCaret;

    if (removeIndex < 0 || removeIndex >= phoneDigits.length) {
      setPhoneCaret(event.currentTarget, digitIndexAtCaret);
      return;
    }

    const nextDigits = `${phoneDigits.slice(0, removeIndex)}${phoneDigits.slice(removeIndex + 1)}`;
    setPhoneDigits(nextDigits);
    setPhoneCaret(event.currentTarget, removeIndex);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setSubmitError(null);
    const form = event.currentTarget;

    if (!form.reportValidity()) {
      return;
    }

    const formData = new FormData(form);

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "general",
          source: "home-hero",
          pagePath: pathname,
          pageTitle: typeof document !== "undefined" ? document.title : undefined,
          name: "Hero",
          phone: maskedPhoneValue,
          [HONEYPOT_FIELD_NAME]: String(formData.get(HONEYPOT_FIELD_NAME) ?? "").trim(),
        }),
      });

      const result = (await response.json()) as RequestSuccessResponse | RequestErrorResponse;

      if (!response.ok || !result.ok) {
        throw new Error(("error" in result && result.error) || "Не удалось отправить заявку. Попробуйте еще раз.");
      }

      setPhoneDigits("");
      form.reset();
      window.open(result.redirectTo, "_blank", "noopener,noreferrer");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Не удалось отправить заявку. Попробуйте еще раз.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="max-w-[480px] xl:max-w-[550px]" noValidate onSubmit={handleSubmit}>
      <div aria-hidden="true" className="absolute left-[-10000px] top-auto size-px overflow-hidden">
        <label htmlFor={honeypotFieldId}>Website</label>
        <input id={honeypotFieldId} name={HONEYPOT_FIELD_NAME} type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center">
        <Input
          placeholder="Телефон"
          floatingLabel={false}
          name="phone"
          type="tel"
          autoComplete="tel"
          inputMode="numeric"
          required
          pattern={PHONE_PATTERN}
          value={maskedPhoneValue}
          onFocus={handlePhoneFocus}
          onBlur={handlePhoneBlur}
          onClick={handlePhoneClick}
          onChange={handlePhoneChange}
          onPaste={handlePhonePaste}
          onKeyDown={handlePhoneKeyDown}
          className="h-12 w-full rounded-[10px] border-[var(--field-border)] bg-white/30 px-4 text-[var(--field-text))] placeholder:text-[var(--text-muted)] focus-visible:border-[var(--field-text)] focus-visible:ring-0 md:flex-1"
        />
        <Button
          type="submit"
          variant="white"
          disabled={isSubmitting}
          className="h-12 w-full rounded-[10px] bg-white text-[var(--accent)] hover:bg-[#edf3ff] md:w-[220px]"
        >
          {isSubmitting ? "Отправляем..." : "Получить расчет"}
        </Button>
      </div>

      <div className="mt-3 flex items-center xl:items-start gap-3 text-sm tracking-[-0.03em] text-[var(--text-muted)]">
        <Checkbox
          id={privacyCheckboxId}
          name="privacy"
          required
          className="-mt-1 border-[var(--field-border)] bg-white/30 data-checked:border-white data-checked:bg-white data-checked:text-[var(--accent)]"
        />
        <label htmlFor={privacyCheckboxId}>
          Нажимая на кнопку, вы соглашаетесь с{" "}
          <Link href="/privacy" target="_blank" rel="noreferrer" className="border-b border-dotted border-current leading-none">
            обработкой персональных данных
          </Link>
          .
        </label>
      </div>

      {submitError ? <p className="mt-3 text-sm leading-[1.4] tracking-[-0.03em] text-[var(--destructive)]">{submitError}</p> : null}
    </form>
  );
}
