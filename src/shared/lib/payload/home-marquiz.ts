import "server-only";

import { cache } from "react";

import { getPayloadClient } from "./get-payload-client";
import { mapCmsImage, type MappedCmsImage } from "./media";

export type HomeMarquizInitSettings = {
  autoOpen: boolean;
  autoOpenFreq: string;
  disableOnMobile: boolean;
  host: string;
  id: string;
  openOnExit: boolean;
  region: string;
};

export type HomeMarquizInlineSettings = {
  bgColor: string;
  blicked: boolean;
  buttonOnMobile: boolean;
  buttonText: string;
  disableOnMobile: boolean;
  fixed: boolean;
  fullWidth: boolean;
  rounded: boolean;
  shadow: string;
  textColor: string;
};

export type HomeMarquizData = {
  coverImage: MappedCmsImage;
  marquiz: {
    init: HomeMarquizInitSettings;
    inline: HomeMarquizInlineSettings;
    scriptUrl: string;
  };
  title: string;
};

const defaultHomeMarquizImage: MappedCmsImage = {
  url: "/img_marquiz_card_cover.webp",
  alt: "Коробка с брендированным мерчем",
  width: 1200,
  height: 1200,
};

export const defaultHomeMarquizData: HomeMarquizData = {
  title: "Ответьте на 5 простых вопросов и получите точный расчет стоимости вашего мерча",
  coverImage: defaultHomeMarquizImage,
  marquiz: {
    scriptUrl: "https://script.marquiz.ru/v2.js",
    init: {
      host: "//quiz.marquiz.ru",
      region: "ru",
      id: "69ef0bea8ae1ec001990bdb0",
      autoOpen: false,
      autoOpenFreq: "once",
      openOnExit: false,
      disableOnMobile: false,
    },
    inline: {
      buttonText: "«Старт»",
      bgColor: "#ecebe7",
      textColor: "#0144a3",
      rounded: true,
      shadow: "rgba(236, 235, 231, 0.5)",
      blicked: true,
      fixed: false,
      buttonOnMobile: true,
      disableOnMobile: false,
      fullWidth: true,
    },
  },
};

type HomeMarquizDocument = {
  coverImage?: unknown;
  marquiz?: {
    init?: Partial<Record<keyof HomeMarquizInitSettings, unknown>> | null;
    inline?: Partial<Record<keyof HomeMarquizInlineSettings, unknown>> | null;
    scriptUrl?: unknown;
  } | null;
  title?: unknown;
};

function pickString(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function pickBoolean(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

export const getHomeMarquizData = cache(async (): Promise<HomeMarquizData> => {
  try {
    const payload = (await getPayloadClient()) as any;
    const result = await payload.find({
      collection: "home-marquiz",
      depth: 1,
      limit: 1,
      pagination: false,
    });
    const doc = (Array.isArray(result?.docs) ? result.docs[0] : null) as HomeMarquizDocument | null;

    if (!doc) {
      return defaultHomeMarquizData;
    }

    const init = doc.marquiz?.init ?? {};
    const inline = doc.marquiz?.inline ?? {};
    const coverImage = mapCmsImage(doc.coverImage, defaultHomeMarquizImage.alt);

    return {
      title: pickString(doc.title, defaultHomeMarquizData.title),
      coverImage: coverImage ?? defaultHomeMarquizData.coverImage,
      marquiz: {
        scriptUrl: pickString(doc.marquiz?.scriptUrl, defaultHomeMarquizData.marquiz.scriptUrl),
        init: {
          host: pickString(init.host, defaultHomeMarquizData.marquiz.init.host),
          region: pickString(init.region, defaultHomeMarquizData.marquiz.init.region),
          id: pickString(init.id, defaultHomeMarquizData.marquiz.init.id),
          autoOpen: pickBoolean(init.autoOpen, defaultHomeMarquizData.marquiz.init.autoOpen),
          autoOpenFreq: pickString(init.autoOpenFreq, defaultHomeMarquizData.marquiz.init.autoOpenFreq),
          openOnExit: pickBoolean(init.openOnExit, defaultHomeMarquizData.marquiz.init.openOnExit),
          disableOnMobile: pickBoolean(init.disableOnMobile, defaultHomeMarquizData.marquiz.init.disableOnMobile),
        },
        inline: {
          buttonText: pickString(inline.buttonText, defaultHomeMarquizData.marquiz.inline.buttonText),
          bgColor: pickString(inline.bgColor, defaultHomeMarquizData.marquiz.inline.bgColor),
          textColor: pickString(inline.textColor, defaultHomeMarquizData.marquiz.inline.textColor),
          rounded: pickBoolean(inline.rounded, defaultHomeMarquizData.marquiz.inline.rounded),
          shadow: pickString(inline.shadow, defaultHomeMarquizData.marquiz.inline.shadow),
          blicked: pickBoolean(inline.blicked, defaultHomeMarquizData.marquiz.inline.blicked),
          fixed: pickBoolean(inline.fixed, defaultHomeMarquizData.marquiz.inline.fixed),
          buttonOnMobile: pickBoolean(inline.buttonOnMobile, defaultHomeMarquizData.marquiz.inline.buttonOnMobile),
          disableOnMobile: pickBoolean(inline.disableOnMobile, defaultHomeMarquizData.marquiz.inline.disableOnMobile),
          fullWidth: pickBoolean(inline.fullWidth, defaultHomeMarquizData.marquiz.inline.fullWidth),
        },
      },
    };
  } catch {
    return defaultHomeMarquizData;
  }
});
