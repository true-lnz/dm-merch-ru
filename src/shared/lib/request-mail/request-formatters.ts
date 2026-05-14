import type { RequestSource, WishlistRequestItem } from "./types";

const rubFormatter = new Intl.NumberFormat("ru-RU");

export const requestSourceLabels: Record<RequestSource, string> = {
  "request-cta": "CTA-блок",
  "home-lead-cta": "Блок с примерами мерча",
  "request-dialog": "Модалка заявки",
  "catalog-work-stages": "Этапы работы в каталоге",
  "catalog-product-card": "Карточка товара",
  "home-digest-card": "Карточка подборки",
  "home-hero": "Главный экран",
  "catalog-hero": "Hero каталога",
  "catalog-products-hero": "Hero каталога продукции",
  "home-results": "Блок результатов",
  "home-services": "Блок услуг",
  "home-urgent-order": "Срочный заказ",
  "contacts-page": "Страница контактов",
  "wishlist-dialog": "Вишлист",
};

export function formatRub(value: number) {
  return `${rubFormatter.format(value)} ₽`;
}

export function formatWishlistLineItems(items: WishlistRequestItem[]) {
  return items.map((item, index) => {
    const lineTotalRub = item.quantity * item.unitPriceRub;

    return [
      `${index + 1}. ${item.title}`,
      `   Арт.: ${item.articleNumber}`,
      `   Кол-во: ${item.quantity}`,
      `   Цена: ${formatRub(item.unitPriceRub)}`,
      `   Сумма: ${formatRub(lineTotalRub)}`,
      item.productUrl ? `   Ссылка: ${item.productUrl}` : undefined,
    ]
      .filter(Boolean)
      .join("\n");
  });
}
