export type YandexMetrikaMethod = "init" | "hit" | "reachGoal";

export type YandexMetrikaHitParams = {
  order_price?: number;
  currency?: string;
  [key: string]: string | number | boolean | null | undefined;
};

export type YandexMetrikaHitOptions = {
  callback?: () => void;
  ctx?: unknown;
  params?: YandexMetrikaHitParams;
  referer?: string;
  title?: string;
};

export type YandexMetrikaGoalParams = Record<string, unknown>;

declare global {
  interface Window {
    ym?: (id: number, method: YandexMetrikaMethod, ...params: unknown[]) => void;
  }
}

export {};
