"use client";

import { cn } from "@/shared/lib/cn";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import Link from "next/link";
import { type ChangeEvent, type ClipboardEvent, type FocusEvent, type KeyboardEvent, type MouseEvent, useId, useState } from "react";

const DEFAULT_PRIVACY_CHECKBOX_ID = "request-form-privacy";

const fieldBaseClassName = "rounded-none border-0 border-b bg-transparent px-0 text-sm md:text-base shadow-none focus-visible:ring-0";

const fieldSurfaceClassName =
  "border-[var(--field-border)] text-[var(--text)] placeholder:text-[var(--field-text)] focus-visible:border-[var(--accent)] group-data-[surface=accent]/form:border-white/40 group-data-[surface=accent]/form:text-white group-data-[surface=accent]/form:placeholder:text-white/60 group-data-[surface=accent]/form:focus-visible:border-white";

const inputClassName = cn(fieldBaseClassName, fieldSurfaceClassName, "h-11 pt-3");

const textareaClassName = cn(fieldBaseClassName, fieldSurfaceClassName, "max-h-[4rem] min-h-[4rem] overflow-y-auto resize-none");

const checkboxClassName =
  "mt-0.5 border-[var(--field-border)] bg-transparent text-white focus-visible:border-[var(--accent)] focus-visible:ring-0 data-checked:border-[var(--accent)] data-checked:bg-[var(--accent)] group-data-[surface=accent]/form:border-white/55 group-data-[surface=accent]/form:focus-visible:border-white group-data-[surface=accent]/form:data-checked:border-white group-data-[surface=accent]/form:data-checked:bg-white group-data-[surface=accent]/form:data-checked:text-[var(--accent)]";

const privacyTextClassName =
  "mt-[3rem] flex items-center gap-3 text-sm md:text-base text-[var(--field-text)] cursor-pointer group-data-[surface=accent]/form:text-white/70";

const PHONE_MASK_TEMPLATE = "+7 (___) ___-__-__";
const PHONE_DIGIT_POSITIONS = [4, 5, 6, 9, 10, 11, 13, 14, 16, 17] as const;
const PHONE_MAX_DIGITS = PHONE_DIGIT_POSITIONS.length;
const PHONE_PATTERN = "^\\+7 \\(\\d{3}\\) \\d{3}-\\d{2}-\\d{2}$";

function normalizePhoneDigits(value: string) {
  const digitsOnly = value.replace(/\D/g, "");

  if (digitsOnly.length === 0) {
    return "";
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

type RequestFormProps = {
  includeEmail?: boolean;
  includeQuantity?: boolean;
  quantityRequired?: boolean;
  privacyCheckboxId?: string;
  formId?: string;
  formClassName?: string;
  submitClassName?: string;
  submitLabel?: string;
  showSubmitButton?: boolean;
  messageAsInput?: boolean;
  onAccentSurface?: boolean;
};

export function RequestForm({
  includeEmail = true,
  includeQuantity = false,
  quantityRequired = false,
  privacyCheckboxId = DEFAULT_PRIVACY_CHECKBOX_ID,
  formId,
  formClassName,
  submitClassName,
  submitLabel = "Отправить заявку",
  showSubmitButton = true,
  messageAsInput = false,
  onAccentSurface = false,
}: RequestFormProps) {
  const messageFieldId = useId();
  const [phoneDigits, setPhoneDigits] = useState("");
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
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

  return (
    <form
      id={formId}
      data-surface={onAccentSurface ? "accent" : "default"}
      className={cn("group/form space-y-4", formClassName)}
      action="/request-success"
      target="_blank"
      noValidate
    >
      <div className="block">
        <Input placeholder="Имя*" name="name" required className={inputClassName} />
      </div>

      <div className="block">
        <Input
          placeholder="Телефон*"
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
          className={inputClassName}
        />
      </div>

      {includeEmail ? (
        <div className="block">
          <Input placeholder="Email" type="email" name="email" className={inputClassName} />
        </div>
      ) : null}

      <div className="block">
        {messageAsInput ? (
          <Input id={messageFieldId} placeholder="Сообщение" name="message" className={inputClassName} />
        ) : (
          <>
            <label
              htmlFor={messageFieldId}
              className="mb-2 block text-sm md:text-base text-[var(--field-text)] group-data-[surface=accent]/form:text-white/60"
            >
              Сообщение
            </label>
            <Textarea id={messageFieldId} floatingLabel={false} placeholder="" name="message" rows={3} className={textareaClassName} />
          </>
        )}
      </div>

      {includeQuantity ? (
        <div className="block">
          <Input
            placeholder="Тираж*"
            type="number"
            inputMode="numeric"
            min={1}
            step={1}
            name="quantity"
            required={quantityRequired}
            className={inputClassName}
          />
        </div>
      ) : null}

      <div className={privacyTextClassName}>
        <Checkbox id={privacyCheckboxId} name="privacy" required className={checkboxClassName} />
        <div className="cursor-pointer">
          <label htmlFor={privacyCheckboxId}>
            Нажимая на&nbsp;кнопку &quot;Отправить&quot;, Вы&nbsp;соглашаетесь с&nbsp;
          </label>
          <Link href="/privacy" target="_blank" rel="noreferrer" className="border-b border-dotted border-current leading-none">
            Политикой конфиденциальности
          </Link>
          .
        </div>
      </div>

      {showSubmitButton ? (
        <Button type="submit" variant="blue" className={cn("h-[47px] w-full cursor-pointer text-lg", submitClassName)}>
          {submitLabel}
        </Button>
      ) : null}
    </form>
  );
}
