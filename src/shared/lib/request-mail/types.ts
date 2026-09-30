export type RequestSource =
  | "request-cta"
  | "home-lead-cta"
  | "request-dialog"
  | "catalog-work-stages"
  | "catalog-product-card"
  | "home-digest-card"
  | "home-hero"
  | "catalog-hero"
  | "catalog-products-hero"
  | "tilda-lead"
  | "home-results"
  | "home-services"
  | "home-urgent-order"
  | "contacts-page"
  | "wishlist-dialog";

export type WishlistRequestItem = {
  id: string;
  title: string;
  articleNumber: string;
  productUrl?: string;
  quantity: number;
  unitPriceRub: number;
};

export type RequestAttribution = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  landingPage?: string;
  referrer?: string;
};

export type GeneralRequestPayload = {
  type: "general";
  source: RequestSource;
  pagePath: string;
  pageTitle?: string;
  name: string;
  company?: string;
  phone: string;
  email?: string;
  message?: string;
  quantity?: number;
  context?: string;
  attribution?: RequestAttribution;
};

export type WishlistRequestPayload = {
  type: "wishlist";
  source: "wishlist-dialog";
  pagePath: string;
  pageTitle?: string;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  wishlistItems: WishlistRequestItem[];
  totalRub: number;
  attribution?: RequestAttribution;
};

export type RequestPayload = GeneralRequestPayload | WishlistRequestPayload;

export type RequestSuccessResponse = {
  ok: true;
  redirectTo: string;
};

export type RequestErrorResponse = {
  ok: false;
  error: string;
};
