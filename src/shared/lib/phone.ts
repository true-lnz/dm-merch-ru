export function formatPhoneHref(phone: string) {
  const hasLeadingPlus = phone.trim().startsWith("+");
  const digits = phone.replace(/\D+/g, "");

  return `tel:${hasLeadingPlus ? "+" : ""}${digits}`;
}
