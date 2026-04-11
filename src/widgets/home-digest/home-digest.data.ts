export type HomeDigestSmallCard = {
  id: string;
  variant: "small";
  title: string;
  lead: string;
  image: {
    src: string;
    alt: string;
    sizes: string;
    imageClassName?: string;
  };
};

export type HomeDigestWideCard = {
  id: string;
  variant: "wide";
  title: string;
  lead: string;
  details: string;
  image: {
    src: string;
    alt: string;
    sizes: string;
    imageClassName?: string;
  };
};

export type HomeDigestCard = HomeDigestSmallCard | HomeDigestWideCard;

export const DIGEST_TITLE = "1571+ проект\nпод задачи бизнеса";

export const DIGEST_DESCRIPTION =
  "Создаем мерч для любых бизнес-задач: от униформы и welcome-паков до подарков партнерам";

export const DIGEST_CTA_LABEL = "Отправить заявку";

export const DIGEST_CARDS: HomeDigestCard[] = [
  {
    id: "partners",
    variant: "small",
    title: "Подарки\nдля партнеров",
    lead: "Подарок — продолжение деловых отношений",
    image: {
      src: "/home/digest-partners.png",
      alt: "Подарок для партнеров",
      sizes: "(max-width: 767px) calc(100vw - 60px), (max-width: 1279px) 360px, 412px",
      imageClassName: "object-contain object-center scale-[1.05]",
    },
  },
  {
    id: "events",
    variant: "small",
    title: "Мерч\nдля мероприятий",
    lead: "Когда бренд должен запомниться, а не потеряться",
    image: {
      src: "/home/digest-events.png",
      alt: "Мерч для мероприятий",
      sizes: "(max-width: 767px) calc(100vw - 60px), (max-width: 1279px) 360px, 413px",
      imageClassName: "object-contain object-center scale-[1.05]",
    },
  },
  {
    id: "team",
    variant: "wide",
    title: "Мерч\nдля команды",
    lead:
      "Мерч для сотрудников, который помогает формировать чувство принадлежности, поддерживать корпоративную культуру и делать бренд частью повседневной среды.",
    details: "Подходит для адаптации, внутренних мероприятий, подарочных наборов и командных событий.",
    image: {
      src: "/home/digest-team.png",
      alt: "Мерч для команды",
      sizes: "(max-width: 767px) calc(100vw - 60px), (max-width: 1279px) 480px, 413px",
      imageClassName: "object-contain object-center scale-[1.08]",
    },
  },
  {
    id: "souvenirs",
    variant: "wide",
    title: "Сувенирная\nпродукция",
    lead:
      "Сувенирная продукция для клиентов, партнеров и сотрудников: для мероприятий, деловых подарков, выставок, корпоративных активностей и welcome-наборов.",
    details:
      "Практичные и брендированные решения, которые усиливают узнаваемость компании и поддерживают имидж бренда.",
    image: {
      src: "/home/digest-souvenirs.png",
      alt: "Сувенирная продукция",
      sizes: "(max-width: 767px) calc(100vw - 60px), (max-width: 1279px) 480px, 413px",
      imageClassName: "object-contain object-center scale-[1.07]",
    },
  },
  {
    id: "uniform",
    variant: "small",
    title: "Корпоративная\nуниформа",
    lead: "Когда команда должна выглядеть собранно, а бренд - узнаваемо",
    image: {
      src: "/home/digest-uniform.png",
      alt: "Корпоративная униформа",
      sizes: "(max-width: 767px) calc(100vw - 60px), (max-width: 1279px) 360px, 413px",
      imageClassName: "object-contain object-center scale-[1.05]",
    },
  },
  {
    id: "workwear",
    variant: "small",
    title: "Корпоративная\nспецодежда",
    lead: "Внешний вид — продолжение стандарта компании",
    image: {
      src: "/home/digest-workwear.png",
      alt: "Корпоративная спецодежда",
      sizes: "(max-width: 767px) calc(100vw - 60px), (max-width: 1279px) 360px, 412px",
      imageClassName: "object-contain object-center scale-[1.05]",
    },
  },
];
