export type HomeDigestCardId =
  | "partners"
  | "events"
  | "team"
  | "souvenirs"
  | "uniform"
  | "workwear";

export type HomeDigestDefaultCard = {
  id: HomeDigestCardId;
  variant: "default";
  title: string;
  description: string;
  image: {
    src: string;
    alt: string;
    sizes: string;
    imageClassName?: string;
  };
};

export type HomeDigestWildCard = {
  id: HomeDigestCardId;
  variant: "wild";
  title: string;
  description: string;
  mobileDescription: string;
  details: string;
  backgroundImageSrc: string;
  image: {
    src: string;
    alt: string;
    sizes: string;
    imageClassName?: string;
  };
};

export type HomeDigestCard = HomeDigestDefaultCard | HomeDigestWildCard;

export const DIGEST_TITLE = "1571+ проект\nпод задачи бизнеса";

export const DIGEST_DESCRIPTION =
  "Создаем мерч для любых бизнес-задач: от униформы и welcome-паков до подарков партнерам";

export const DIGEST_CTA_LABEL = "Отправить заявку";

export const DIGEST_CARDS: HomeDigestCard[] = [
  {
    id: "partners",
    variant: "default",
    title: "Подарки\nдля партнеров",
    description: "Подарок — продолжение деловых отношений",
    image: {
      src: "/home/digest-partners.png",
      alt: "Подарок для партнеров",
      sizes: "(max-width: 767px) calc(100vw - 60px), (max-width: 1279px) 360px, 412px",
      imageClassName: "object-cover object-center",
    },
  },
  {
    id: "events",
    variant: "default",
    title: "Мерч\nдля мероприятий",
    description: "Когда бренд должен запомниться, а не потеряться",
    image: {
      src: "/home/digest-events.png",
      alt: "Мерч для мероприятий",
      sizes: "(max-width: 767px) calc(100vw - 60px), (max-width: 1279px) 360px, 413px",
      imageClassName: "object-cover object-center",
    },
  },
  {
    id: "team",
    variant: "wild",
    title: "Мерч\nдля команды",
    description:
      "Мерч для сотрудников, который помогает формировать чувство принадлежности, поддерживать корпоративную культуру и делать бренд частью повседневной среды.",
    mobileDescription:
      "Подходит для внутренних мероприятий, подарочных наборов и командных событий",
    details: "Подходит для адаптации, внутренних мероприятий, подарочных наборов и командных событий.",
    backgroundImageSrc: "/home/img_card_cover_home_digest_v1.svg",
    image: {
      src: "/home/digest-team.png",
      alt: "Мерч\nдля команды",
      sizes: "(max-width: 767px) calc(100vw - 60px), (max-width: 1279px) 480px, 413px",
      imageClassName: "object-cover object-top",
    },
  },
  {
    id: "souvenirs",
    variant: "wild",
    title: "Сувенирная\nпродукция",
    description:
      "Сувенирная продукция для клиентов, партнеров и сотрудников: для мероприятий, деловых подарков, выставок, корпоративных активностей и welcome-наборов.",
    mobileDescription:
      "Практичные и брендированные решения, которые усиливают узнаваемость компании",
    details:
      "Практичные и брендированные решения, которые усиливают узнаваемость компании и поддерживают имидж бренда.",
    backgroundImageSrc: "/home/img_card_cover_home_digest_v2.svg",
    image: {
      src: "/home/digest-souvenirs.png",
      alt: "Сувенирная продукция",
      sizes: "(max-width: 767px) calc(100vw - 60px), (max-width: 1279px) 480px, 413px",
      imageClassName: "object-cover object-center",
    },
  },
  {
    id: "uniform",
    variant: "default",
    title: "Корпоративная\nуниформа",
    description: "Когда команда должна выглядеть собранно, а бренд - узнаваемо",
    image: {
      src: "/home/digest-uniform.png",
      alt: "Корпоративная униформа",
      sizes: "(max-width: 767px) calc(100vw - 60px), (max-width: 1279px) 360px, 413px",
      imageClassName: "object-cover object-top",
    },
  },
  {
    id: "workwear",
    variant: "default",
    title: "Корпоративная\nспецодежда",
    description: "Внешний вид — продолжение стандарта компании",
    image: {
      src: "/home/digest-workwear.png",
      alt: "Корпоративная спецодежда",
      sizes: "(max-width: 767px) calc(100vw - 60px), (max-width: 1279px) 360px, 412px",
      imageClassName: "object-cover object-top",
    },
  },
];
