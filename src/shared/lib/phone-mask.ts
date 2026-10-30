export const PHONE_MASK_TEMPLATE = "+7 (___) ___-__-__";
export const PHONE_DIGIT_POSITIONS = [4, 5, 6, 9, 10, 11, 13, 14, 16, 17] as const;
export const PHONE_MAX_DIGITS = PHONE_DIGIT_POSITIONS.length;
export const PHONE_PATTERN = "^\\+7 \\(\\d{3}\\) \\d{3}-\\d{2}-\\d{2}$";

export function normalizePhoneDigits(value: string) {
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

export function applyPhoneMask(digits: string) {
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

export function getPhoneCursorPosition(digitsCount: number) {
  if (digitsCount <= 0) {
    return PHONE_DIGIT_POSITIONS[0];
  }

  if (digitsCount >= PHONE_MAX_DIGITS) {
    return PHONE_MASK_TEMPLATE.length;
  }

  return PHONE_DIGIT_POSITIONS[digitsCount];
}

export function countDigitsBeforePosition(position: number) {
  let count = 0;

  for (const digitPosition of PHONE_DIGIT_POSITIONS) {
    if (digitPosition < position) {
      count += 1;
    }
  }

  return count;
}

export function countDigitsInRange(start: number, end: number) {
  let count = 0;

  for (const digitPosition of PHONE_DIGIT_POSITIONS) {
    if (digitPosition >= start && digitPosition < end) {
      count += 1;
    }
  }

  return count;
}
