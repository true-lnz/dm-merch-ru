import type { RequestAttribution } from "./types";

export const REQUEST_ATTRIBUTION_STORAGE_KEY = "dm-merch:request-attribution";

const UTM_FIELDS = [
  ["utm_source", "utmSource"],
  ["utm_medium", "utmMedium"],
  ["utm_campaign", "utmCampaign"],
  ["utm_content", "utmContent"],
  ["utm_term", "utmTerm"],
] as const;

function clean(value: string | null | undefined) {
  const normalized = value?.trim();
  return normalized ? normalized.slice(0, 500) : undefined;
}

export function getRequestAttribution(): RequestAttribution | undefined {
  if (typeof window === "undefined") return undefined;

  const currentUrl = new URL(window.location.href);
  const stored = window.sessionStorage.getItem(REQUEST_ATTRIBUTION_STORAGE_KEY);
  let attribution: RequestAttribution = {};
  try {
    attribution = stored ? JSON.parse(stored) : {};
  } catch {
    window.sessionStorage.removeItem(REQUEST_ATTRIBUTION_STORAGE_KEY);
  }

  for (const [queryKey, field] of UTM_FIELDS) {
    const value = clean(currentUrl.searchParams.get(queryKey));
    if (value) attribution[field] = value;
  }

  if (!attribution.landingPage && (Object.keys(attribution).length > 0 || currentUrl.search)) {
    attribution.landingPage = currentUrl.href.slice(0, 2000);
  }
  if (!attribution.referrer) attribution.referrer = clean(document.referrer)?.slice(0, 2000);

  if (Object.keys(attribution).length > 0) {
    window.sessionStorage.setItem(REQUEST_ATTRIBUTION_STORAGE_KEY, JSON.stringify(attribution));
    return attribution;
  }

  return undefined;
}
