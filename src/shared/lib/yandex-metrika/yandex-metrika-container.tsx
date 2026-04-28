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

function buildAbsoluteUrl(route: string) {
  return new URL(route, window.location.origin).toString();
}

export function YandexMetrikaContainer() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { hit } = useYandexMetrika(YANDEX_METRIKA_ID);
  const previousUrlRef = useRef<string | null>(null);

  const trackPageView = useEffectEvent((nextUrl: string, referer: string | undefined) => {
    hit(nextUrl, {
      referer,
      title: document.title,
    });

    previousUrlRef.current = nextUrl;
  });

  useEffect(() => {
    if (!YANDEX_METRIKA_ENABLED) {
      return;
    }

    const nextUrl = buildAbsoluteUrl(buildRoute(pathname, searchParams));
    const referer = previousUrlRef.current ?? (document.referrer || undefined);
    trackPageView(nextUrl, referer);
  }, [pathname, searchParams]);

  if (!YANDEX_METRIKA_ENABLED) {
    return null;
  }

  return <YandexMetrikaInitializer id={YANDEX_METRIKA_ID} initScript={YANDEX_METRIKA_INIT_SCRIPT} />;
}
