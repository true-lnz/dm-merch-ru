export const YANDEX_METRIKA_ID = 108741987;

export const YANDEX_METRIKA_ENABLED = process.env.NODE_ENV === "production";

export const YANDEX_METRIKA_INIT_SCRIPT = `{
  ssr:true,
  webvisor:true,
  clickmap:true,
  ecommerce:"dataLayer",
  referrer: document.referrer,
  url: location.href,
  accurateTrackBounce:true,
  trackLinks:true
}`;
