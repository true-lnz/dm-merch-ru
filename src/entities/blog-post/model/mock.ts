import { mapBlogPostFromDto } from "./mappers";
import type { BlogPost, BlogPostDto } from "./types";

const BLOG_POST_DTO_MOCK: BlogPostDto[] = [
  {
    id: "1",
    slug: "kak-merch-vliyaet-na-imidzh-i-uznavaemost-brenda",
    title: "Как мерч влияет на имидж и узнаваемость бренда",
    excerpt: "",
    image: {
      url: "/blog/blog-brand-image.jpg",
      alt: "Модели в брендированной одежде",
      width: 553,
      height: 250,
    },
  },
  {
    id: "2",
    slug: "ekspress-merch",
    title: "Экспресс-мерч",
    excerpt: "Сроки, этапы и форматы быстрого запуска",
    image: {
      url: "/blog/blog-express-merch.jpg",
      alt: "Быстрое производство брендированной продукции",
      width: 553,
      height: 250,
    },
  },
  {
    id: "3",
    slug: "skolko-stoit-merch",
    title: "Сколько стоит мерч",
    excerpt: "Факторы цены и реальный расчет",
    image: {
      url: "/blog/blog-cost.jpg",
      alt: "Футболки и брендированные товары",
      width: 553,
      height: 250,
    },
  },
  {
    id: "4",
    slug: "kak-vybrat-merch-pod-zadachu",
    title: "Как выбрать мерч под задачу",
    excerpt: "Руководство для бизнеса",
    image: {
      url: "/blog/blog-merch-guide.jpg",
      alt: "Корпоративные наборы и аксессуары",
      width: 553,
      height: 250,
    },
  },
  {
    id: "5",
    slug: "korporativnyy-merch",
    title: "Корпоративный мерч",
    excerpt: "Что это и зачем он бизнесу",
    image: {
      url: "/blog/blog-corporate-merch.jpg",
      alt: "Команда в корпоративной одежде",
      width: 553,
      height: 250,
    },
  },
];

export const blogPostsMock: BlogPost[] = BLOG_POST_DTO_MOCK.map(mapBlogPostFromDto);
