import { mapBlogPostFromDto } from "./mappers";
import type { BlogPost, BlogPostDto } from "./types";

const BLOG_POST_DTO_MOCK: BlogPostDto[] = [
  {
    id: "1",
    slug: "kak-merch-vliyaet-na-imidzh-i-uznavaemost-brenda",
    title: "Как мерч влияет на имидж и узнаваемость бренда",
    excerpt: "Когда важно вовлечение и чувство принадлежности.",
    category: "Бренд-стратегия",
    image: {
      url: "https://www.figma.com/api/mcp/asset/b254c5d1-9e60-44da-b311-16449dad8b06",
      alt: "Модели в брендированной одежде",
      width: 553,
      height: 250,
    },
  },
  {
    id: "2",
    slug: "ekspress-merch",
    title: "Экспресс-мерч",
    excerpt: "Сроки, этапы и форматы быстрого запуска.",
    category: "Производство",
    image: {
      url: "https://www.figma.com/api/mcp/asset/462d5770-48c9-43c1-aebd-d2a83e96f49c",
      alt: "Быстрое производство брендированной продукции",
      width: 553,
      height: 250,
    },
  },
  {
    id: "3",
    slug: "skolko-stoit-merch",
    title: "Сколько стоит мерч",
    excerpt: "Факторы цены и реальный расчет.",
    category: "Бюджет",
    image: {
      url: "https://www.figma.com/api/mcp/asset/882a6a19-da70-41be-9d87-e765c79e908a",
      alt: "Футболки и брендированные товары",
      width: 553,
      height: 250,
    },
  },
  {
    id: "4",
    slug: "kak-vybrat-merch-pod-zadachu",
    title: "Как выбрать мерч под задачу",
    excerpt: "Руководство для бизнеса.",
    category: "Гайд",
    image: {
      url: "https://www.figma.com/api/mcp/asset/a3f88da2-3c64-4d99-820a-0c7d7768d10c",
      alt: "Корпоративные наборы и аксессуары",
      width: 553,
      height: 250,
    },
  },
  {
    id: "5",
    slug: "korporativnyy-merch",
    title: "Корпоративный мерч",
    excerpt: "Что это и зачем он бизнесу.",
    category: "Корпоративная культура",
    image: {
      url: "https://www.figma.com/api/mcp/asset/692938e7-a01f-482e-8820-4d9b9d2e4988",
      alt: "Команда в корпоративной одежде",
      width: 553,
      height: 250,
    },
  },
];

export const blogPostsMock: BlogPost[] = BLOG_POST_DTO_MOCK.map(mapBlogPostFromDto);
