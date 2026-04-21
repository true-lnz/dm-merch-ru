import type { RequestPayload, RequestSource, WishlistRequestItem } from "./types";

const rubFormatter = new Intl.NumberFormat("ru-RU");

const sourceLabels: Record<RequestSource, string> = {
  "request-cta": "CTA-блок",
  "home-lead-cta": "Блок с примерами мерча",
  "request-dialog": "Модалка заявки",
  "catalog-work-stages": "Этапы работы в каталоге",
  "catalog-product-card": "Карточка товара",
  "home-digest-card": "Карточка подборки",
  "home-hero": "Главный экран",
  "catalog-hero": "Hero каталога",
  "home-results": "Блок результатов",
  "home-services": "Блок услуг",
  "home-urgent-order": "Срочный заказ",
  "contacts-page": "Страница контактов",
  "wishlist-dialog": "Вишлист",
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function nl2br(value: string) {
  return escapeHtml(value).replaceAll("\n", "<br />");
}

function formatRub(value: number) {
  return `${rubFormatter.format(value)} ₽`;
}

function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Yekaterinburg",
  }).format(value);
}

function renderDetailRow(label: string, value: string) {
  return `
    <tr>
      <td style="padding:0 0 10px; width:168px; color:#6b7280; font-size:13px; line-height:18px; vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:0 0 10px; color:#111827; font-size:14px; line-height:20px; font-weight:600; vertical-align:top;">${value}</td>
    </tr>
  `;
}

function renderLayout(title: string, eyebrow: string, content: string) {
  return `
    <!DOCTYPE html>
    <html lang="ru">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${escapeHtml(title)}</title>
      </head>
      <body style="margin:0; padding:24px; background:#edf2f7; font-family:Arial,Helvetica,sans-serif; color:#111827;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:760px; border-collapse:collapse; background:#ffffff; border-radius:24px; overflow:hidden;">
                <tr>
                  <td style="padding:32px; background:linear-gradient(135deg,#0f4bb5 0%,#0f7fcf 100%); color:#ffffff;">
                    <div style="font-size:12px; line-height:18px; text-transform:uppercase; letter-spacing:0.14em; opacity:0.8;">${escapeHtml(eyebrow)}</div>
                    <div style="margin-top:12px; font-size:28px; line-height:32px; font-weight:700;">${escapeHtml(title)}</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:32px;">${content}</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

function buildGeneralContent(payload: Extract<RequestPayload, { type: "general" }>, createdAt: Date) {
  const sourceLabel = sourceLabels[payload.source];
  const emailValue = payload.email ? escapeHtml(payload.email) : '<span style="color:#9ca3af; font-weight:500;">Не указан</span>';
  const messageValue = payload.message ? nl2br(payload.message) : '<span style="color:#9ca3af; font-weight:500;">Без комментария</span>';
  const quantityValue =
    typeof payload.quantity === "number" ? escapeHtml(String(payload.quantity)) : '<span style="color:#9ca3af; font-weight:500;">Не указан</span>';
  const contextValue = payload.context ? escapeHtml(payload.context) : '<span style="color:#9ca3af; font-weight:500;">Без уточнения</span>';
  const pageLabel = payload.pageTitle ? `${escapeHtml(payload.pageTitle)} (${escapeHtml(payload.pagePath)})` : escapeHtml(payload.pagePath);

  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
      <tr>
        <td style="padding:0 0 24px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse; background:#f8fafc; border:1px solid #e5e7eb; border-radius:18px;">
            <tr>
              <td style="padding:22px 24px;">
                <div style="font-size:18px; line-height:24px; font-weight:700; color:#111827;">Контакт клиента</div>
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:18px; border-collapse:collapse;">
                  ${renderDetailRow("Имя", escapeHtml(payload.name))}
                  ${renderDetailRow("Телефон", escapeHtml(payload.phone))}
                  ${renderDetailRow("Email", emailValue)}
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:0 0 24px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
            ${renderDetailRow("Источник", escapeHtml(sourceLabel))}
            ${renderDetailRow("Страница", pageLabel)}
            ${renderDetailRow("Контекст", contextValue)}
            ${renderDetailRow("Тираж", quantityValue)}
            ${renderDetailRow("Получено", escapeHtml(formatDateTime(createdAt)))}
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:0 0 24px;">
          <div style="font-size:16px; line-height:22px; font-weight:700; color:#111827;">Комментарий клиента</div>
          <div style="margin-top:12px; border-radius:18px; background:#f8fafc; border:1px solid #e5e7eb; padding:18px 20px; font-size:14px; line-height:22px; color:#1f2937;">
            ${messageValue}
          </div>
        </td>
      </tr>
      <tr>
        <td>
          <div style="border-radius:20px; background:#0f172a; padding:20px 24px; color:#ffffff;">
            <div style="font-size:12px; line-height:18px; letter-spacing:0.12em; text-transform:uppercase; opacity:0.7;">Следующий шаг</div>
            <div style="margin-top:10px; font-size:18px; line-height:24px; font-weight:700;">Свяжитесь с клиентом и уточните задачу, сроки и тираж.</div>
          </div>
        </td>
      </tr>
    </table>
  `;
}

function renderWishlistTable(items: WishlistRequestItem[]) {
  const rows = items
    .map((item) => {
      const lineTotal = item.quantity * item.unitPriceRub;

      return `
        <tr>
          <td style="padding:14px 12px; border-bottom:1px solid #e5e7eb; font-size:14px; line-height:20px; color:#111827; font-weight:600;">${escapeHtml(
            item.title,
          )}</td>
          <td style="padding:14px 12px; border-bottom:1px solid #e5e7eb; font-size:13px; line-height:20px; color:#4b5563;">${escapeHtml(
            item.articleNumber,
          )}</td>
          <td style="padding:14px 12px; border-bottom:1px solid #e5e7eb; font-size:13px; line-height:20px; color:#111827; text-align:center;">${escapeHtml(
            String(item.quantity),
          )}</td>
          <td style="padding:14px 12px; border-bottom:1px solid #e5e7eb; font-size:13px; line-height:20px; color:#111827; text-align:right;">${escapeHtml(
            formatRub(item.unitPriceRub),
          )}</td>
          <td style="padding:14px 12px; border-bottom:1px solid #e5e7eb; font-size:13px; line-height:20px; color:#111827; text-align:right; font-weight:700;">${escapeHtml(
            formatRub(lineTotal),
          )}</td>
        </tr>
      `;
    })
    .join("");

  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse; border:1px solid #e5e7eb; border-radius:18px; overflow:hidden;">
      <thead>
        <tr style="background:#eff6ff;">
          <th style="padding:14px 12px; text-align:left; font-size:12px; line-height:18px; letter-spacing:0.08em; text-transform:uppercase; color:#1d4ed8;">Товар</th>
          <th style="padding:14px 12px; text-align:left; font-size:12px; line-height:18px; letter-spacing:0.08em; text-transform:uppercase; color:#1d4ed8;">Артикул</th>
          <th style="padding:14px 12px; text-align:center; font-size:12px; line-height:18px; letter-spacing:0.08em; text-transform:uppercase; color:#1d4ed8;">Кол-во</th>
          <th style="padding:14px 12px; text-align:right; font-size:12px; line-height:18px; letter-spacing:0.08em; text-transform:uppercase; color:#1d4ed8;">Цена</th>
          <th style="padding:14px 12px; text-align:right; font-size:12px; line-height:18px; letter-spacing:0.08em; text-transform:uppercase; color:#1d4ed8;">Сумма</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function buildWishlistContent(payload: Extract<RequestPayload, { type: "wishlist" }>, createdAt: Date) {
  const emailValue = payload.email ? escapeHtml(payload.email) : '<span style="color:#9ca3af; font-weight:500;">Не указан</span>';
  const messageValue = payload.message ? nl2br(payload.message) : '<span style="color:#9ca3af; font-weight:500;">Без комментария</span>';
  const pageLabel = payload.pageTitle ? `${escapeHtml(payload.pageTitle)} (${escapeHtml(payload.pagePath)})` : escapeHtml(payload.pagePath);

  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
      <tr>
        <td style="padding:0 0 24px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
            ${renderDetailRow("Имя", escapeHtml(payload.name))}
            ${renderDetailRow("Телефон", escapeHtml(payload.phone))}
            ${renderDetailRow("Email", emailValue)}
            ${renderDetailRow("Источник", escapeHtml(sourceLabels[payload.source]))}
            ${renderDetailRow("Страница", pageLabel)}
            ${renderDetailRow("Получено", escapeHtml(formatDateTime(createdAt)))}
          </table>
        </td>
      </tr>
      <tr>
        <td style="padding:0 0 18px;">
          <div style="display:inline-block; border-radius:999px; background:#dbeafe; color:#1d4ed8; padding:10px 16px; font-size:13px; line-height:18px; font-weight:700;">
            Позиций: ${escapeHtml(String(payload.wishlistItems.length))} · Итого: ${escapeHtml(formatRub(payload.totalRub))}
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:0 0 24px;">
          ${renderWishlistTable(payload.wishlistItems)}
        </td>
      </tr>
      <tr>
        <td>
          <div style="font-size:16px; line-height:22px; font-weight:700; color:#111827;">Комментарий клиента</div>
          <div style="margin-top:12px; border-radius:18px; background:#f8fafc; border:1px solid #e5e7eb; padding:18px 20px; font-size:14px; line-height:22px; color:#1f2937;">
            ${messageValue}
          </div>
        </td>
      </tr>
    </table>
  `;
}

export function buildRequestEmail(payload: RequestPayload) {
  const createdAt = new Date();

  if (payload.type === "wishlist") {
    return {
      subject: `Новая заявка • Wishlist${payload.pageTitle ? ` • ${payload.pageTitle}` : ""}`,
      html: renderLayout("Заявка из вишлиста", "DM Merch", buildWishlistContent(payload, createdAt)),
    };
  }

  const sourceLabel = sourceLabels[payload.source];

  return {
    subject: `Новая заявка • ${sourceLabel}${payload.context ? ` • ${payload.context}` : ""}`,
    html: renderLayout("Новая заявка с сайта", "DM Merch", buildGeneralContent(payload, createdAt)),
  };
}
