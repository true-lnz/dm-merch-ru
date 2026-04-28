"use client";

import { YANDEX_METRIKA_ENABLED } from "./constants";
import type { YandexMetrikaGoalParams, YandexMetrikaHitOptions } from "./types";

export function useYandexMetrika(id: number) {
  function hit(url?: string, options?: YandexMetrikaHitOptions) {
    if (!YANDEX_METRIKA_ENABLED) {
      return;
    }

    window.ym?.(id, "hit", url, options);
  }

  function reachGoal(target: string, params?: YandexMetrikaGoalParams, callback?: () => void, ctx?: unknown) {
    if (!YANDEX_METRIKA_ENABLED) {
      return;
    }

    window.ym?.(id, "reachGoal", target, params, callback, ctx);
  }

  return { hit, reachGoal };
}
