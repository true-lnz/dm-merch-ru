import type { Metadata } from "next";

import { buildSEOMetadata } from "./seo-metadata";
import type { ManagedPageSlug } from "./page-docs";
import { getManagedPageBySlug, isDraftModeEnabled } from "./page-docs";

type PageMetadataFallback = {
  title: string;
  description?: string;
  canonical?: string;
  openGraph?: Metadata["openGraph"];
  twitter?: Metadata["twitter"];
};

const pageMetadataFallbacks: Record<ManagedPageSlug, PageMetadataFallback> = {
  home: {
    title: "Одежда и сувенирка с логотипом на заказ Держи Марку!",
    description:
      "Производство мерча и сувенирной продукции с логотипом для бизнеса. От 100 000₽, цена 25% от рынка, 1571+ проект. Образцы перед поставкой, договор.",
    canonical: "/",
    openGraph: {
      title: "Мерч и сувенирная продукция от команды с 1571+ проектами",
      description:
        "3 дизайн-концепции и правки макета - бесплатно. Производство корпоративного мерча и сувенирной продукции с логотипом от 100 000₽. Срок 14 дней, образцы, договор.",
      url: "/",
      images: [
        {
          url: "/home/img_lead_cta_cover.webp",
          alt: "Мерч и сувенирная продукция от команды Держи Марку!",
        },
      ],
    },
    twitter: {
      title: "Мерч и сувенирная продукция от команды с 1571+ проектами",
      description:
        "3 дизайн-концепции и правки макета - бесплатно. Производство корпоративного мерча и сувенирной продукции с логотипом от 100 000₽. Срок 14 дней, образцы, договор.",
      images: ["/home/img_lead_cta_cover.webp"],
    },
  },
  catalog: {
    title: "Каталог",
  },
  "catalog-products": {
    title: "Каталог продукции",
    description:
      "Посадочная страница каталога продукции: статьи, категории и подкатегории мерча и корпоративных подарков.",
    canonical: "/catalog-products",
  },
  cases: {
    title: "Кейсы",
  },
  blog: {
    title: "Блог",
  },
};

export async function getManagedPageMetadata(slug: ManagedPageSlug): Promise<Metadata> {
  const fallback = pageMetadataFallbacks[slug];
  const page = await getManagedPageBySlug(slug, {
    draft: await isDraftModeEnabled(),
  });
  const title = page?.title || fallback.title;

  return buildSEOMetadata({
    fallbackDescription: fallback.description,
    fallbackOpenGraph: fallback.openGraph,
    fallbackTitle: title,
    fallbackTwitter: fallback.twitter,
    meta: page?.meta,
    pathname: fallback.canonical,
    socialType: "website",
  });
}
