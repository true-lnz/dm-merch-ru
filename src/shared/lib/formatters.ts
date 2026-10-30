const rubFormatter = new Intl.NumberFormat("ru-RU");

export function formatRub(value: number) {
  return `${rubFormatter.format(value)} ₽`;
}
