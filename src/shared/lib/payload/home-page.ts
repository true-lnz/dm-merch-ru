import type { Metadata } from "next";
import { cache } from "react";

import type { HomeDigestCard, HomeDigestCardId } from "../../../widgets/home-digest/home-digest.data.ts";
import type { PartnerProductItem } from "../../../widgets/home-partner-products/types.ts";

import { DIGEST_CARDS } from "../../../widgets/home-digest/home-digest.data.ts";
import { mapCmsImage, type MappedCmsImage } from "./media.ts";
import { buildSEOMetadata } from "./seo-metadata.ts";

export type HomePageBlockType =
  | "hero"
  | "digest"
  | "results"
  | "services"
  | "marquiz"
  | "benefits"
  | "leadCta"
  | "partnerProducts"
  | "urgentOrder"
  | "reviews"
  | "workStages"
  | "features"
  | "faq"
  | "requestCta";

export type HomePageLayoutBlock = {
  blockType: HomePageBlockType;
  enabled: boolean;
};

export type HomeHeroFeature = {
  text: string;
};

export type HomeHeroData = {
  title: string;
  description: string;
  image: MappedCmsImage;
  features: HomeHeroFeature[];
  showCasesButton: boolean;
};

export type HomeResultSlide = {
  before: string;
  after: string;
  result: string;
  image: MappedCmsImage;
};

export type HomeResultsData = {
  title: string;
  description: string;
  slides: HomeResultSlide[];
  ctaLabel: string;
};

export type HomeServiceItem = {
  title: string;
  description: string;
  ctaLabel: string;
};

export type HomeServicesData = {
  title: string;
  items: HomeServiceItem[];
  image: MappedCmsImage;
};

export type HomeFeatureCardItem = {
  title: string;
  description: string;
  backgroundImageUrl: string;
};

export type HomeFeatureCardsSectionData = {
  title: string;
  description?: string;
  items: HomeFeatureCardItem[];
};

export type HomeLeadCtaData = {
  title: string;
  description: string;
  image: MappedCmsImage;
  submitLabel: string;
};

export type HomeUrgentOrderData = {
  title: string;
  paragraphs: string[];
  image: MappedCmsImage;
  ctaLabel: string;
};

export type HomeReviewItem = {
  company: string;
  name: string;
  role: string;
  quote: string[];
  image: MappedCmsImage;
  avatar: MappedCmsImage;
};

export type HomeReviewsData = {
  title: string;
  items: HomeReviewItem[];
};

export type HomeWorkStageItem = {
  number: string;
  title: string;
  description: string;
};

export type HomeWorkStagesData = {
  title: string;
  description: string;
  items: HomeWorkStageItem[];
};

export type HomeDigestData = {
  title: string;
  description: string;
  cards: HomeDigestCard[];
};

export type HomePartnerProductsData = {
  title: string;
  description: string;
  items: PartnerProductItem[];
};

export type HomePageData = {
  hero: HomeHeroData;
  digest: HomeDigestData;
  results: HomeResultsData;
  services: HomeServicesData;
  benefits: HomeFeatureCardsSectionData;
  leadCta: HomeLeadCtaData;
  partnerProducts: HomePartnerProductsData;
  urgentOrder: HomeUrgentOrderData;
  reviews: HomeReviewsData;
  workStages: HomeWorkStagesData;
  features: HomeFeatureCardsSectionData;
  layoutBlocks: HomePageLayoutBlock[];
};

const DEFAULT_HERO_IMAGE: MappedCmsImage = {
  url: "/home/img_home_hero_cover.webp",
  alt: "Команда в фирменном мерче",
  width: 1200,
  height: 900,
};

const DEFAULT_SERVICES_IMAGE: MappedCmsImage = {
  url: "/home/img_home_services_cover.webp",
  alt: "Синий термос с брендированием Академии успеха",
  width: 1200,
  height: 1200,
};

const DEFAULT_LEAD_CTA_IMAGE: MappedCmsImage = {
  url: "/home/img_lead_cta_cover2.webp",
  alt: "Примеры корпоративного мерча",
  width: 1200,
  height: 1200,
};

const DEFAULT_URGENT_ORDER_IMAGE: MappedCmsImage = {
  url: "/home/img_home_urgent_order_cover.webp",
  alt: "Срочный запуск мерча",
  width: 1200,
  height: 1200,
};

export const DEFAULT_HOME_LAYOUT_BLOCKS: HomePageLayoutBlock[] = [
  { blockType: "hero", enabled: true },
  { blockType: "digest", enabled: true },
  { blockType: "results", enabled: true },
  { blockType: "services", enabled: true },
  { blockType: "marquiz", enabled: true },
  { blockType: "benefits", enabled: true },
  { blockType: "leadCta", enabled: true },
  { blockType: "partnerProducts", enabled: true },
  { blockType: "urgentOrder", enabled: true },
  { blockType: "reviews", enabled: true },
  { blockType: "workStages", enabled: true },
  { blockType: "features", enabled: true },
  { blockType: "faq", enabled: true },
  { blockType: "requestCta", enabled: true },
];

const DEFAULT_HOME_DIGEST_CARDS_BY_ID = DIGEST_CARDS.reduce<Record<HomeDigestCardId, HomeDigestCard>>((acc, card) => {
  acc[card.id] = card;
  return acc;
}, {} as Record<HomeDigestCardId, HomeDigestCard>);

const HOME_DIGEST_CARD_FIELD_MAP = {
  partners: "partnersCard",
  events: "eventsCard",
  team: "teamCard",
  souvenirs: "souvenirsCard",
  uniform: "uniformCard",
  workwear: "workwearCard",
} as const satisfies Record<HomeDigestCardId, string>;

export const defaultHomePageData: HomePageData = {
  hero: {
    title: "Мерч, который\nработает на бизнес",
    description: "Создаём корпоративный мерч и подарки, которые носят, помнят и связывают с брендом.",
    image: DEFAULT_HERO_IMAGE,
    features: [
      { text: "Цена ниже рынка на ~ 25% за счет собственного производства и прямой логистики с Турции" },
      { text: "Мерч у вас за 14 рабочих дней от идеи и дизайна до готовых вещей у вас в офисе" },
      { text: "Отправляем образцы по всей России: покажем материалы, посадку и качество до запуска основного тиража" },
    ],
    showCasesButton: true,
  },
  digest: {
    title: "1571+ проект\nпод задачи бизнеса",
    description: "Создаем мерч для любых бизнес-задач: от униформы и welcome-паков до подарков партнерам",
    cards: DIGEST_CARDS,
  },
  results: {
    title: "Кейсы с результатом",
    description: "Как мерч решает задачи бизнеса — на реальных проектах",
    ctaLabel: "Оставить заявку",
    slides: [
      {
        before:
          "Для ресторана «Магадан» нужно было полностью экипировать команду для уличного фестиваля. Важно было учесть разные погодные условия, чтобы сотрудники выглядели единообразно и чувствовали себя комфортно в жару, ветер и дождь.",
        after:
          "Подобрали и произвели комплект мерча под разные сценарии погоды: кепки и футболки — для жары, худи и дождевики — для прохладной и дождливой погоды. В итоге команда была полностью обеспечена одеждой под любые условия фестиваля.",
        result:
          "Команда «Магадана» выглядела собранно и узнаваемо на протяжении всего мероприятия, независимо от погоды. Мерч помог сохранить комфорт сотрудников, поддержать единый образ бренда и спокойно отработать фестиваль в любых условиях.",
        image: {
          url: "/home/results_1.webp",
          alt: "Команда ресторана в фирменном мерче",
          width: 1200,
          height: 1200,
        },
      },
      {
        before:
          "Для компании Уфаойл нужно было подготовить 250 премиальных пледов для VIP-клиентов и партнёров. Важно было сделать авторский корпоративный подарок, который подчеркивает статус отношений и внимание к получателю.",
        after:
          "Разработали авторскую сувенирную продукцию: премиальные брендированные пледы в подарочной упаковке. Подобрали материалы, продумали дизайн и создали решение, которое выглядит как полноценный представительский подарок.",
        result:
          "250 пледов для Уфаойл стали частью имиджевой коммуникации с партнёрами. Подарок подчеркнул уровень компании, показал уважение к получателю и усилил ценность деловых отношений.",
        image: {
          url: "/home/results5.webp",
          alt: "Подарочный набор с пледом",
          width: 1200,
          height: 1200,
        },
      },
    ],
  },
  services: {
    title: "Услуги, которые закрывают ваши задачи",
    image: DEFAULT_SERVICES_IMAGE,
    items: [
      {
        title: "Разработка дизайна",
        description:
          "Продумываем концепцию под задачу бизнеса: не только красиво, а креативно, уместно, стильно и понятно для аудитории.",
        ctaLabel: "Обсудить задачу",
      },
      {
        title: "Экспресс-мерч",
        description:
          "Когда сроки жёсткие, а результат всё равно должен быть достойным. Берём на себя дизайн, подбор изделий и производство — без потери внешнего вида. Срок: до 5 рабочих дней.",
        ctaLabel: "Обсудить задачу",
      },
      {
        title: "Разработка и пошив изделий под бренд",
        description:
          "Создаём изделия с нуля — под вашу задачу, формат и бюджет. Думаем не только о дизайне, но и о посадке, ткани и реальном использовании. Индивидуальный подбор лекал и материалов.",
        ctaLabel: "Обсудить задачу",
      },
      {
        title: "Сувенирная продукция",
        description:
          "Корпоративные подарки, которые поддерживают образ бренда и остаются в использовании. Подбор предметов, материалов и нанесения под ваши задачи.",
        ctaLabel: "Обсудить задачу",
      },
    ],
  },
  benefits: {
    title: "Собственный дизайн-отдел",
    items: [
      {
        title: "3 концепции \n– в течение 5 рабочих дней",
        backgroundImageUrl: "/home/img_card_cover_home_benefits_v1.svg",
        description:
          "Предлагаем несколько визуальных направлений, чтобы вы могли выбрать лучшее решение под задачи бренда, формат продукции и стиль компании.",
      },
      {
        title: "Дизайн\nпод производство",
        backgroundImageUrl: "/home/img_card_cover_home_benefits_v2.svg",
        description: "Дизайн, который работает на изделии, а не только в макете. Наши дизайнеры работают с одеждой, а не с абстрактной графикой.",
      },
      {
        title: "Сроки фиксируем\nв договоре",
        backgroundImageUrl: "/home/img_card_cover_home_benefits_v3.svg",
        description: "Не «стараемся успеть», а берём ответственность за результат.",
      },
    ],
  },
  leadCta: {
    title: "Отправим примеры мерча",
    description: "На основе наших работ для 500+ компаний в 2025 году",
    image: DEFAULT_LEAD_CTA_IMAGE,
    submitLabel: "Получить примеры мерча",
  },
  partnerProducts: {
    title: "Более 50 000 товаров\nдля брендирования",
    description: "Комбинируем модели, ткани, фасоны и виды брендирования под конкретные задачи бизнеса",
    items: [
      {
        title: "Футболки и поло",
        description: "Для команды, мероприятий и повседневного использования",
        imageUrl: "/home/partner-products/01-futbolki-i-polo.webp",
        href: "/catalog/futbolki",
      },
      {
        title: "ТОЛСТОВКИ",
        description: "Базовый элемент корпоративного мерча. Актуально вне сезона",
        imageUrl: "/home/partner-products/02-tolstovki.webp",
        href: "/catalog/tolstovki",
      },
      {
        title: "РУБАШКИ",
        description: "Фирменный стиль для деловых задач. Ваш профессиональный имидж",
        imageUrl: "/home/partner-products/03-rubashki.webp",
        href: "/partner-catalog",
      },
      {
        title: "безрукавки",
        description: "Когда важно, чтобы бренд сопровождал команду не только в офисе",
        imageUrl: "/home/partner-products/04-bezrukavki.webp",
        href: "/catalog/verhnyaya-odezhda",
      },
      {
        title: "дождевики",
        description: "Для команды, мероприятий и повседневного использования",
        imageUrl: "/home/partner-products/05-dozhdeviki.webp",
        href: "/catalog/verhnyaya-odezhda",
      },
      {
        title: "бомберы",
        description: "Базовый элемент корпоративного мерча. Актуально вне сезона",
        imageUrl: "/home/partner-products/06-bombery.webp",
        href: "/catalog/verhnyaya-odezhda",
      },
      {
        title: "ГОЛОВНЫЕ УБОРЫ",
        description: "Легко носить. Легко масштабировать. Легко узнать бренд",
        imageUrl: "/home/partner-products/07-golovnye-ubory.webp",
        href: "/catalog/headwear",
      },
      {
        title: "СУМКИ И РЮКЗАКИ",
        description: "Чем чаще используют — тем сильнее работает бренд",
        imageUrl: "/home/partner-products/08-sumki-i-ryukzaki.webp",
        href: "/catalog/bags",
      },
      {
        title: "ЭЛЕКТРОНИКА",
        description: "Работает на узнаваемость за счёт постоянного использования",
        imageUrl: "/home/partner-products/09-elektronika.webp",
        href: "/partner-catalog",
      },
      {
        title: "Деловые аксессуары",
        description: "Детали, которые формируют образ компании",
        imageUrl: "/home/partner-products/10-delovye-aksessuary.webp",
        href: "/catalog/business-accessories",
      },
      {
        title: "СУВЕНИРНАЯ ПРОДУКЦИЯ",
        description: "Подарок с идеей, который делает отношения теплее",
        imageUrl: "/home/partner-products/11-suvenirnaya-produkciya.webp",
        href: "/catalog/souvenirs",
      },
      {
        title: "Пакеты",
        description: "Когда важно вовлечение и чувство принадлежности",
        imageUrl: "/home/partner-products/12-pakety.webp",
        href: "/partner-catalog",
      },
    ],
  },
  urgentOrder: {
    title: "Экспресс-мерч\n– когда нужно вчера",
    paragraphs: [
      "3 склада, собственные мощности и опыт срочных проектов. Однажды сделали 50 футболок за 3 часа до начала событий и даже успели их забрендировать!",
      "Экспресс-мерч за 5 рабочих дней — для нас стандарт, а не обещание.",
    ],
    image: DEFAULT_URGENT_ORDER_IMAGE,
    ctaLabel: "Рассчитать срочный заказ",
  },
  reviews: {
    title: "Отзывы наших клиентов",
    items: [
      {
        company: "Ресторан «Магадан»",
        name: "Эльнора",
        role: "Управляющий ресторана",
        quote: [
          "Искали подрядчика для формы на фестиваль: важно было, чтобы команда выглядела стильно и премиально, а сотрудникам было удобно работать.",
          "В итоге получили форму, которая поддержала наш имидж и выглядела уместно на мероприятии, без ощущения промо-одежды.",
          "Гости фестиваля отдельно спрашивали, можно ли купить дождевики, и это был лучший индикатор, что мерч действительно получился сильным.",
        ],
        image: {
          url: "/home/reviews/img_home_reviews_1.webp",
          alt: "Команда ресторана в мерче",
          width: 1200,
          height: 1200,
        },
        avatar: {
          url: "/home/reviews/img_reviews_avatar_1.webp",
          alt: "Портрет Эльноры",
          width: 300,
          height: 300,
        },
      },
      {
        company: "Городское пространство «Арт‑квадрат»",
        name: "Айна Федорова",
        role: "Арт-директор",
        quote: [
          'С компанией "Держи Марку!" Арт-КВАДРАТ сотрудничает уже 3 года.',
          "Все наши сложные и креативные запросы решаются оперативно, партнёры всегда готовы предоставить интересные решения, отражающие специфику нашего бренда. И что немаловажно, всегда можно договориться по экономической стороне вопроса.",
          "А когда соответствует качество и цена - что может быть лучше?)",
        ],
        image: {
          url: "/home/reviews/img_home_reviews_5.webp",
          alt: "Отзыв клиента Арт-квадрат",
          width: 1200,
          height: 1200,
        },
        avatar: {
          url: "/home/reviews/img_reviews_avatar_2.webp",
          alt: "Портрет Айны Федоровой",
          width: 300,
          height: 300,
        },
      },
      {
        company: "Уфанет",
        name: "Лилия",
        role: "Отдел рекламы",
        quote: [
          "Работаем с командой около полугода. За это время совместно реализовали несколько проектов: худи, футболки, бутылки и новогодние подарки.",
          "Ценим, что ребята берут на себя весь процесс целиком — от идеи и проработки деталей до готового результата. В ходе работы всегда присутствует чёткая коммуникация, внимание к деталям и готовность оперативно включаться в задачу, если сроки ограничены.",
          "Несмотря на то, что сотрудничаем мы недолго, за этот период команда уже показала себя как надежный подрядчик, с которым приятно работать и к которому хочется обращаться снова с новыми проектами.",
        ],
        image: {
          url: "/home/reviews/img_home_reviews_ufanet.webp",
          alt: "Отзыв клиента Уфанет",
          width: 1200,
          height: 1200,
        },
        avatar: {
          url: "/home/reviews/img_reviews_avatar_3.webp",
          alt: "Портрет Лилии",
          width: 300,
          height: 300,
        },
      },
      {
        company: "Уфаойл",
        name: "Анна",
        role: "Отдел маркетинга",
        quote: [
          "Работаем с компанией не первый проект - делали и юбилейные худи, и подарки для сотрудников, и продукцию для партнеров. Для нас было важно, чтобы мерч не выглядел шаблонно, а действительно отражал нашу компанию и ее историю.",
          "Понравилось, что команда вникает в задачи, предлагает решения, а не просто принимает ТЗ. В итоге получили продукцию, которой реально пользуются, а не кладут на полку. Мерч стал частью корпоративной культуры, а не разовой акцией.",
        ],
        image: {
          url: "/home/reviews/img_home_reviews_3_2.webp",
          alt: "Отзыв клиента Уфаойл",
          width: 1200,
          height: 1200,
        },
        avatar: {
          url: "/home/reviews/img_reviews_avatar_4.webp",
          alt: "Портрет Анны",
          width: 300,
          height: 300,
        },
      },
      {
        company: "Тихий дом",
        name: "Дмитрий",
        role: "Бренд-менеджер",
        quote: [
          "Заказывали фирменный набор для наших клиентов и партнёров. Нам хотелось сделать не просто сувенир, а действительно приятный и аккуратный подарок, который будет хорошо выглядеть, вызывать правильное впечатление и которым захочется пользоваться.",
          "С командой было легко и спокойно работать: помогли с выбором, подсказали по материалам и нанесению, внимательно отнеслись к деталям и всё сделали в срок. В итоге получился именно такой набор, как мы и хотели, — качественный, цельный и достойный. Такие вещи приятно дарить от имени компании, потому что они действительно отражают отношение к людям и к своему бренду.",
        ],
        image: {
          url: "/home/reviews/img_home_reviews_2.webp",
          alt: "Отзыв клиента Тихий дом",
          width: 1200,
          height: 1200,
        },
        avatar: {
          url: "/home/reviews/img_reviews_avatar_5.webp",
          alt: "Портрет Дмитрия",
          width: 300,
          height: 300,
        },
      },
    ],
  },
  workStages: {
    title: "Этапы работ",
    description: "Прозрачный процесс - от идеи до готового мерча.",
    items: [
      {
        number: "01",
        title: "Заявка и бриф\n1 день",
        description:
          "Перед запуском тиража вы видите и трогаете реальный продукт: ткань, посадку, нанесение, детали. Отправляем образцы в любой город РФ, чтобы решение было осознанным, а не «по картинке».",
      },
      {
        number: "02",
        title: "Дизайн-макет и согласование 3‑5 дней",
        description:
          "Разрабатываем 3 дизайн-концепций под ваш запрос. Подбираем ткани, фасоны и способы нанесения. Вносим все правки бесплатно и при необходимости отправляем образцы.",
      },
      {
        number: "03",
        title: "Производство\n10-14 дней",
        description:
          "После согласования концепций и утверждения позиций производство изделий мы запускаем заказ в работу. Контролируем каждый этап: раскрой, пошив, нанесение, финальную сборку.",
      },
      {
        number: "04",
        title: "доставка\n2-4 дня",
        description:
          "Перед отправкой проводим финальную проверку качества и упаковку. Доставляем мерч в согласованные сроки в любой город России. При необходимости организуем частный трансфер для срочных проектов.",
      },
    ],
  },
  features: {
    title: "Наши преимущества перед конкурентами",
    description: "Цена ниже рынка на ~25%  за счет собственного производства",
    items: [
      {
        title: "Готовый мерч в среднем за 14 рабочих дней",
        backgroundImageUrl: "/home/img_card_cover_home_features_v1.svg",
        description: "Делаем быстрее рынка без потери качества. Сроки фиксируем и держим их по договору.",
      },
      {
        title: "Образцы отправляем по всей России",
        backgroundImageUrl: "/home/img_card_cover_home_features_v2.svg",
        description:
          "Перед запуском тиража вы видите и трогаете реальный продукт: ткань, посадку, нанесение, детали. Отправляем образцы в любой город РФ, чтобы решение было осознанным, а не «по картинке».",
      },
      {
        title: "Работаем со всеми уровнями тканей и 10 видами нанесений",
        backgroundImageUrl: "/home/img_card_cover_home_features_v3.svg",
        description:
          "Работаем с тканями, которые выглядят достойно и носятся долго. Подбираем оптимальный способ брендирования под задачу: вышивка, шелкография, термопечать, тиснение, DTF и другие.",
      },
    ],
  },
  layoutBlocks: DEFAULT_HOME_LAYOUT_BLOCKS,
};

type HomePageDocument = {
  id: number | string;
  hero?: {
    title?: unknown;
    description?: unknown;
    image?: unknown;
    features?: unknown;
    showCasesButton?: unknown;
  } | null;
  meta?: {
    canonicalUrl?: null | string;
    description?: null | string;
    image?: unknown;
    keywords?: null | string;
    openGraph?: {
      description?: null | string;
      imageAlt?: null | string;
      title?: null | string;
      type?: null | "article" | "website";
    } | null;
    robots?: {
      noFollow?: boolean | null;
      noIndex?: boolean | null;
    } | null;
    title?: null | string;
    twitter?: {
      card?: null | "summary" | "summary_large_image";
      description?: null | string;
      imageAlt?: null | string;
      title?: null | string;
    } | null;
  } | null;
  digest?: {
    title?: unknown;
    description?: unknown;
    cards?: unknown;
    partnersCard?: unknown;
    eventsCard?: unknown;
    teamCard?: unknown;
    souvenirsCard?: unknown;
    uniformCard?: unknown;
    workwearCard?: unknown;
  } | null;
  results?: {
    title?: unknown;
    description?: unknown;
    ctaLabel?: unknown;
    slides?: unknown;
  } | null;
  services?: {
    title?: unknown;
    image?: unknown;
    items?: unknown;
  } | null;
  benefits?: {
    title?: unknown;
    description?: unknown;
    items?: unknown;
  } | null;
  leadCta?: {
    title?: unknown;
    description?: unknown;
    image?: unknown;
    submitLabel?: unknown;
  } | null;
  partnerProducts?: {
    title?: unknown;
    description?: unknown;
    items?: unknown;
  } | null;
  urgentOrder?: {
    title?: unknown;
    paragraphs?: unknown;
    image?: unknown;
    ctaLabel?: unknown;
  } | null;
  reviews?: {
    title?: unknown;
    items?: unknown;
  } | null;
  workStages?: {
    title?: unknown;
    description?: unknown;
    items?: unknown;
  } | null;
  features?: {
    title?: unknown;
    description?: unknown;
    items?: unknown;
  } | null;
  layoutBlocks?: unknown;
} | null;

type HomeDigestDocument = NonNullable<HomePageDocument>["digest"];

function pickString(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function mapCmsImageWithFallback(value: unknown, fallback: MappedCmsImage) {
  return mapCmsImage(value, fallback.alt) ?? fallback;
}

function pickBoolean(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function mapTextArray(value: unknown, fallback: string[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const items = value
    .map((item) => {
      if (typeof item === "string" && item.trim()) {
        return item.trim();
      }

      if (isRecord(item) && typeof item.text === "string" && item.text.trim()) {
        return item.text.trim();
      }

      return null;
    })
    .filter((item): item is string => item !== null);
  return items.length > 0 ? items : fallback;
}

function mapHeroFeatures(value: unknown, fallback: HomeHeroFeature[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const items = value
    .map((item) => {
      if (!isRecord(item)) {
        return null;
      }

      const text = typeof item.text === "string" ? item.text.trim() : "";
      return text ? { text } : null;
    })
    .filter((item): item is HomeHeroFeature => item !== null);

  return items.length > 0 ? items : fallback;
}

function mapDigestCardImage(value: unknown, fallback: HomeDigestCard) {
  const imageDoc = mapCmsImage(value, fallback.image.alt);

  return imageDoc
    ? {
        src: imageDoc.url,
        alt: imageDoc.alt,
        sizes: fallback.image.sizes,
        imageClassName: fallback.image.imageClassName,
      }
    : fallback.image;
}

function mapLegacyDigestCards(value: unknown, fallback: HomeDigestCard[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const items = value
    .map((item) => {
      if (!isRecord(item)) {
        return null;
      }

      const id = typeof item.cardKey === "string" ? (item.cardKey as HomeDigestCardId) : null;
      if (!id || !(id in DEFAULT_HOME_DIGEST_CARDS_BY_ID)) {
        return null;
      }

      const variant = item.variant === "wild" ? "wild" : item.variant === "default" ? "default" : null;
      const title = typeof item.title === "string" ? item.title.trim() : "";
      const description = typeof item.description === "string" ? item.description.trim() : "";
      const image = mapDigestCardImage(item.image, DEFAULT_HOME_DIGEST_CARDS_BY_ID[id]);

      if (!variant || !title || !description) {
        return null;
      }

      if (variant === "wild") {
        const mobileDescription = typeof item.mobileDescription === "string" ? item.mobileDescription.trim() : "";
        const details = typeof item.details === "string" ? item.details.trim() : "";
        const backgroundImageSrc = typeof item.backgroundImageSrc === "string" ? item.backgroundImageSrc.trim() : "";

        if (!mobileDescription || !details || !backgroundImageSrc) {
          return null;
        }

        return {
          id,
          variant,
          title,
          description,
          mobileDescription,
          details,
          backgroundImageSrc,
          image,
        } satisfies HomeDigestCard;
      }

      return {
        id,
        variant,
        title,
        description,
        image,
      } satisfies HomeDigestCard;
    })
    .filter((item): item is HomeDigestCard => item !== null);

  return items.length > 0 ? items : fallback;
}

function mapFixedDigestCards(value: HomeDigestDocument, fallback: HomeDigestCard[]) {
  if (!isRecord(value)) {
    return fallback;
  }

  const hasAnyFixedCard = Object.values(HOME_DIGEST_CARD_FIELD_MAP).some((fieldName) => fieldName in value);
  if (!hasAnyFixedCard) {
    return fallback;
  }

  return (Object.entries(HOME_DIGEST_CARD_FIELD_MAP) as [HomeDigestCardId, (typeof HOME_DIGEST_CARD_FIELD_MAP)[HomeDigestCardId]][])
    .map(([id, fieldName]) => {
      const fallbackCard = DEFAULT_HOME_DIGEST_CARDS_BY_ID[id];
      const source = value[fieldName];

      if (!isRecord(source)) {
        return fallbackCard;
      }

      const title = pickString(source.title, fallbackCard.title);
      const description = pickString(source.description, fallbackCard.description);
      const image = mapDigestCardImage(source.image, fallbackCard);

      if (fallbackCard.variant === "wild") {
        return {
          id,
          variant: "wild",
          title,
          description,
          mobileDescription: pickString(source.mobileDescription, fallbackCard.mobileDescription),
          details: pickString(source.details, fallbackCard.details),
          backgroundImageSrc: pickString(source.backgroundImageSrc, fallbackCard.backgroundImageSrc),
          image,
        } satisfies HomeDigestCard;
      }

      return {
        id,
        variant: "default",
        title,
        description,
        image,
      } satisfies HomeDigestCard;
    })
    .filter((item): item is HomeDigestCard => item !== null);
}

function mapResultsSlides(value: unknown, fallback: HomeResultSlide[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const items = value
    .map((item, index) => {
      if (!isRecord(item)) {
        return null;
      }

      const before = typeof item.before === "string" ? item.before.trim() : "";
      const after = typeof item.after === "string" ? item.after.trim() : "";
      const result = typeof item.result === "string" ? item.result.trim() : "";
      const image = mapCmsImage(item.image, fallback[index]?.image.alt ?? fallback[0]?.image.alt ?? "Слайд результата");

      if (!before || !after || !result || !image) {
        return null;
      }

      return { before, after, result, image };
    })
    .filter((item): item is HomeResultSlide => item !== null);

  return items.length > 0 ? items : fallback;
}

function mapServices(value: unknown, fallback: HomeServiceItem[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const items = value
    .map((item, index) => {
      if (!isRecord(item)) {
        return null;
      }

      const title = typeof item.title === "string" ? item.title.trim() : "";
      const description = typeof item.description === "string" ? item.description.trim() : "";
      const ctaLabel = pickString(item.ctaLabel, fallback[index]?.ctaLabel ?? "Обсудить задачу");

      if (!title || !description) {
        return null;
      }

      return { title, description, ctaLabel };
    })
    .filter((item): item is HomeServiceItem => item !== null);

  return items.length > 0 ? items : fallback;
}

function mapFeatureCards(value: unknown, fallback: HomeFeatureCardItem[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const items = value
    .map((item) => {
      if (!isRecord(item)) {
        return null;
      }

      const title = typeof item.title === "string" ? item.title.trim() : "";
      const description = typeof item.description === "string" ? item.description.trim() : "";
      const backgroundImageUrl = typeof item.backgroundImageUrl === "string" ? item.backgroundImageUrl.trim() : "";

      if (!title || !description || !backgroundImageUrl) {
        return null;
      }

      return { title, description, backgroundImageUrl };
    })
    .filter((item): item is HomeFeatureCardItem => item !== null);

  return items.length > 0 ? items : fallback;
}

function mapPartnerProducts(value: unknown, fallback: PartnerProductItem[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const items = value
    .map((item) => {
      if (!isRecord(item)) {
        return null;
      }

      const title = typeof item.title === "string" ? item.title.trim() : "";
      const description = typeof item.description === "string" ? item.description.trim() : "";
      const image = mapCmsImage(item.image, title || "Изображение товара");
      const href = typeof item.href === "string" ? item.href.trim() : "";

      if (!title || !description || !image || !href) {
        return null;
      }

      return { title, description, imageUrl: image.url, href };
    })
    .filter((item): item is PartnerProductItem => item !== null);

  return items.length > 0 ? items : fallback;
}

function mapReviews(value: unknown, fallback: HomeReviewItem[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const items = value
    .map((item, index) => {
      if (!isRecord(item)) {
        return null;
      }

      const company = typeof item.company === "string" ? item.company.trim() : "";
      const name = typeof item.name === "string" ? item.name.trim() : "";
      const role = typeof item.role === "string" ? item.role.trim() : "";
      const quote = mapTextArray(item.quote, fallback[index]?.quote ?? []);
      const image = mapCmsImage(item.image, fallback[index]?.image.alt ?? "Отзыв клиента");
      const avatar = mapCmsImage(item.avatar, fallback[index]?.avatar.alt ?? "Портрет клиента");

      if (!company || !name || !role || quote.length === 0 || !image || !avatar) {
        return null;
      }

      return { company, name, role, quote, image, avatar };
    })
    .filter((item): item is HomeReviewItem => item !== null);

  return items.length > 0 ? items : fallback;
}

function mapWorkStages(value: unknown, fallback: HomeWorkStageItem[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const items = value
    .map((item) => {
      if (!isRecord(item)) {
        return null;
      }

      const number = typeof item.number === "string" ? item.number.trim() : "";
      const title = typeof item.title === "string" ? item.title.trim() : "";
      const description = typeof item.description === "string" ? item.description.trim() : "";

      if (!number || !title || !description) {
        return null;
      }

      return { number, title, description };
    })
    .filter((item): item is HomeWorkStageItem => item !== null);

  return items.length > 0 ? items : fallback;
}

function mapLayoutBlocks(value: unknown, fallback: HomePageLayoutBlock[]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const seen = new Set<HomePageBlockType>();
  const validTypes = new Set<HomePageBlockType>(DEFAULT_HOME_LAYOUT_BLOCKS.map((item) => item.blockType));
  const items = value
    .map((item) => {
      if (!isRecord(item)) {
        return null;
      }

      const blockType = typeof item.blockType === "string" ? (item.blockType as HomePageBlockType) : null;
      if (!blockType || !validTypes.has(blockType) || seen.has(blockType)) {
        return null;
      }

      seen.add(blockType);
      return {
        blockType,
        enabled: typeof item.enabled === "boolean" ? item.enabled : true,
      };
    })
    .filter((item): item is HomePageLayoutBlock => item !== null);

  if (items.length === 0) {
    return fallback;
  }

  for (const fallbackItem of fallback) {
    if (!seen.has(fallbackItem.blockType)) {
      items.push(fallbackItem);
    }
  }

  return items;
}

export const getHomePageData = cache(async (): Promise<HomePageData> => {
  try {
    const { getPayloadClient } = await import("./get-payload-client.ts");
    const payload = (await getPayloadClient()) as any;
    const result = await payload.find({
      collection: "home-page",
      depth: 2,
      limit: 1,
      pagination: false,
    });
    const doc = (Array.isArray(result?.docs) ? result.docs[0] : null) as HomePageDocument;

    if (!doc) {
      return defaultHomePageData;
    }

    return {
      hero: {
        title: pickString(doc.hero?.title, defaultHomePageData.hero.title),
        description: pickString(doc.hero?.description, defaultHomePageData.hero.description),
        image: mapCmsImageWithFallback(doc.hero?.image, defaultHomePageData.hero.image),
        features: mapHeroFeatures(doc.hero?.features, defaultHomePageData.hero.features),
        showCasesButton: pickBoolean(doc.hero?.showCasesButton, defaultHomePageData.hero.showCasesButton),
      },
      digest: {
        title: pickString(doc.digest?.title, defaultHomePageData.digest.title),
        description: pickString(doc.digest?.description, defaultHomePageData.digest.description),
        cards: mapFixedDigestCards(doc.digest, mapLegacyDigestCards(doc.digest?.cards, defaultHomePageData.digest.cards)),
      },
      results: {
        title: pickString(doc.results?.title, defaultHomePageData.results.title),
        description: pickString(doc.results?.description, defaultHomePageData.results.description),
        ctaLabel: pickString(doc.results?.ctaLabel, defaultHomePageData.results.ctaLabel),
        slides: mapResultsSlides(doc.results?.slides, defaultHomePageData.results.slides),
      },
      services: {
        title: pickString(doc.services?.title, defaultHomePageData.services.title),
        image: mapCmsImageWithFallback(doc.services?.image, defaultHomePageData.services.image),
        items: mapServices(doc.services?.items, defaultHomePageData.services.items),
      },
      benefits: {
        title: pickString(doc.benefits?.title, defaultHomePageData.benefits.title),
        description: pickString(doc.benefits?.description, defaultHomePageData.benefits.description ?? ""),
        items: mapFeatureCards(doc.benefits?.items, defaultHomePageData.benefits.items),
      },
      leadCta: {
        title: pickString(doc.leadCta?.title, defaultHomePageData.leadCta.title),
        description: pickString(doc.leadCta?.description, defaultHomePageData.leadCta.description),
        image: mapCmsImageWithFallback(doc.leadCta?.image, defaultHomePageData.leadCta.image),
        submitLabel: pickString(doc.leadCta?.submitLabel, defaultHomePageData.leadCta.submitLabel),
      },
      partnerProducts: {
        title: pickString(doc.partnerProducts?.title, defaultHomePageData.partnerProducts.title),
        description: pickString(doc.partnerProducts?.description, defaultHomePageData.partnerProducts.description),
        items: mapPartnerProducts(doc.partnerProducts?.items, defaultHomePageData.partnerProducts.items),
      },
      urgentOrder: {
        title: pickString(doc.urgentOrder?.title, defaultHomePageData.urgentOrder.title),
        paragraphs: mapTextArray(doc.urgentOrder?.paragraphs, defaultHomePageData.urgentOrder.paragraphs),
        image: mapCmsImageWithFallback(doc.urgentOrder?.image, defaultHomePageData.urgentOrder.image),
        ctaLabel: pickString(doc.urgentOrder?.ctaLabel, defaultHomePageData.urgentOrder.ctaLabel),
      },
      reviews: {
        title: pickString(doc.reviews?.title, defaultHomePageData.reviews.title),
        items: mapReviews(doc.reviews?.items, defaultHomePageData.reviews.items),
      },
      workStages: {
        title: pickString(doc.workStages?.title, defaultHomePageData.workStages.title),
        description: pickString(doc.workStages?.description, defaultHomePageData.workStages.description),
        items: mapWorkStages(doc.workStages?.items, defaultHomePageData.workStages.items),
      },
      features: {
        title: pickString(doc.features?.title, defaultHomePageData.features.title),
        description: pickString(doc.features?.description, defaultHomePageData.features.description ?? ""),
        items: mapFeatureCards(doc.features?.items, defaultHomePageData.features.items),
      },
      layoutBlocks: mapLayoutBlocks(doc.layoutBlocks, defaultHomePageData.layoutBlocks),
    };
  } catch {
    return defaultHomePageData;
  }
});

export const getHomePageDocument = cache(async (): Promise<HomePageDocument | null> => {
  try {
    const { getPayloadClient } = await import("./get-payload-client.ts");
    const payload = (await getPayloadClient()) as any;
    const result = await payload.find({
      collection: "home-page",
      depth: 1,
      limit: 1,
      pagination: false,
    });
    const doc = (Array.isArray(result?.docs) ? result.docs[0] : null) as HomePageDocument | null;

    if (!doc || typeof doc.id === "undefined") {
      return null;
    }

    return doc;
  } catch {
    return null;
  }
});

export async function getHomePageMetadata(): Promise<Metadata> {
  const page = await getHomePageDocument();

  return buildSEOMetadata({
    fallbackTitle: pickString(page?.hero?.title, defaultHomePageData.hero.title),
    fallbackDescription: pickString(page?.hero?.description, defaultHomePageData.hero.description),
    fallbackImage: {
      alt: defaultHomePageData.hero.image.alt,
      url: mapCmsImage(page?.hero?.image, defaultHomePageData.hero.image.alt)?.url || defaultHomePageData.hero.image.url,
    },
    meta: page?.meta,
    pathname: "/",
    socialType: "website",
  });
}
