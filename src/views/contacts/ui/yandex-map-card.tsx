"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import type { ContactsMapSettings } from "@/shared/lib/payload/contacts-page";

declare global {
  interface Window {
    ymaps?: YandexMapsApi;
  }
}

type YandexMapsApi = {
  ready: (callback: () => void) => void;
  Map: new (
    element: HTMLElement,
    state: { center: [number, number]; zoom: number },
    options?: Record<string, unknown>,
  ) => YandexMapInstance;
  Placemark: new (
    geometry: [number, number],
    properties?: Record<string, unknown>,
    options?: Record<string, unknown>,
  ) => YandexGeoObject;
};

type YandexMapInstance = {
  container: {
    getElement: () => HTMLElement | null;
  };
  controls: { remove: (name: string) => void };
  behaviors: { disable: (name: string | string[]) => void };
  geoObjects: { add: (object: YandexGeoObject) => void };
  destroy: () => void;
};

type YandexGeoObject = Record<string, unknown>;

const MARKER_COLOR = "#0252c5";
const REMOVED_CONTROLS = [
  "searchControl",
  "trafficControl",
  "typeSelector",
  "rulerControl",
] as const;

type YandexMapCardProps = ContactsMapSettings & {
  address: string;
  brandName: string;
};

export function YandexMapCard({ address, brandName, defaultZoom, officeCoordinates, yandexMapsApiKey }: YandexMapCardProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<YandexMapInstance | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (!scriptLoaded || !mapRef.current || instanceRef.current || !window.ymaps) {
      return;
    }

    let cancelled = false;

    window.ymaps.ready(() => {
      if (cancelled || !mapRef.current || !window.ymaps) {
        return;
      }

      const ymaps = window.ymaps;
      const map = new ymaps.Map(
        mapRef.current,
        {
          center: officeCoordinates,
          zoom: defaultZoom,
        },
        {
          suppressMapOpenBlock: true,
        },
      );

      REMOVED_CONTROLS.forEach((control) => map.controls.remove(control));
      map.geoObjects.add(
        new ymaps.Placemark(
          officeCoordinates,
          {
            hintContent: brandName,
            balloonContent: address,
          },
          {
            preset: "islands#dotIcon",
            iconColor: MARKER_COLOR,
          },
        ),
      );

      const mapElement = map.container.getElement();
      if (mapElement) {
        mapElement.dataset.mapGrayscale = "true";
      }

      instanceRef.current = map;
    });

    return () => {
      cancelled = true;

      const mapElement = instanceRef.current?.container.getElement();
      if (mapElement) {
        delete mapElement.dataset.mapGrayscale;
      }

      instanceRef.current?.destroy();
      instanceRef.current = null;
    };
  }, [address, brandName, defaultZoom, officeCoordinates, scriptLoaded]);

  if (!yandexMapsApiKey) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-[#f6f6f6] px-4 text-center text-sm text-[#666]">
        Не задан ключ Яндекс Карт в настройках страницы контактов.
      </div>
    );
  }

  return (
    <>
      <Script
        src={`https://api-maps.yandex.ru/2.1/?apikey=${encodeURIComponent(yandexMapsApiKey)}&lang=ru_RU`}
        strategy="lazyOnload"
        onLoad={() => setScriptLoaded(true)}
      />
      <div
        ref={mapRef}
        aria-label="Карта офиса Держи Марку"
        className="absolute inset-0 h-full w-full"
      />
      <style jsx global>{`
        [class*="copyrights-pane"] {
          display: none !important;
        }

        [data-map-grayscale="true"] [class*="ground-pane"] {
          filter: grayscale(1);
        }
      `}</style>
    </>
  );
}
