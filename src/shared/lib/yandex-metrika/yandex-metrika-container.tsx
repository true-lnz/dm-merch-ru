"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useEffectEvent, useRef } from "react";
import {
  YANDEX_METRIKA_ENABLED,
  YANDEX_METRIKA_ID,
  YANDEX_METRIKA_INIT_SCRIPT,
} from "./constants";
import { useYandexMetrika } from "./use-yandex-metrika";
import { YandexMetrikaInitializer } from "./yandex-metrika-initializer";

function buildRoute(pathname: string, searchParams: URLSearchParams) {
  const query = searchParams.toString();

  return `${pathname}${query ? `?${query}` : ""}`;
}

export function YandexMetrikaContainer() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { hit } = useYandexMetrika(YANDEX_METRIKA_ID);
  const hasTrackedInitialRoute = useRef(false);
  const previousUrlRef = useRef<string | null>(null);

  const trackPageView = useEffectEvent((nextUrl: string) => {
    hit(nextUrl, {
      referer: previousUrlRef.current ?? document.referrer,
      title: document.title,
    });

    previousUrlRef.current = nextUrl;
  });

  useEffect(() => {
    if (!YANDEX_METRIKA_ENABLED) {
      return;
    }

    const nextUrl = buildRoute(pathname, searchParams);

    if (!hasTrackedInitialRoute.current) {
      hasTrackedInitialRoute.current = true;
      previousUrlRef.current = nextUrl;
      return;
    }

    trackPageView(nextUrl);
  }, [pathname, searchParams]);

  if (!YANDEX_METRIKA_ENABLED) {
    return null;
  }

  return <YandexMetrikaInitializer id={YANDEX_METRIKA_ID} initScript={YANDEX_METRIKA_INIT_SCRIPT} />;
}
