import { mapBlogArticleFromDto, mapBlogPostFromDto } from "./mappers";
import type { BlogArticle, BlogArticleDto, BlogPost } from "./types";

const BLOG_ARTICLE_DTO_MOCK: BlogArticleDto[] = [
  {
    id: "1",
    slug: "kak-merch-vliyaet-na-imidzh-i-uznavaemost-brenda",
    title: "Как мерч влияет на имидж и узнаваемость бренда",
    excerpt: "",
    image: {
      url: "/blog/blog-brand-image.webp",
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
    image: {
      url: "/blog/blog-express-merch.webp",
      alt: "Быстрое производство брендированной продукции",
      width: 553,
      height: 250,
    },
  },
  {
    id: "3",
    slug: "skolko-stoit-merch",
    title: "Сколько стоит мерч",
    excerpt: "Факторы цены и реальный расчет для бизнеса.",
    image: {
      url: "/blog/blog-cost.webp",
      alt: "Футболки и брендированные товары",
      width: 553,
      height: 250,
    },
  },
  {
    id: "4",
    slug: "kak-vybrat-merch-pod-zadachu",
    title: "Как выбрать мерч под задачу",
    excerpt: "Практическое руководство для бизнеса и event-команд.",
    image: {
      url: "/blog/blog-merch-guide.webp",
      alt: "Корпоративные наборы и аксессуары",
      width: 553,
      height: 250,
    },
  },
  {
    id: "5",
    slug: "korporativnyy-merch",
    title: "Корпоративный мерч",
    pageTitle: "Корпоративный мерч: что это и зачем он бизнесу",
    excerpt: "Что это и зачем он нужен бизнесу, HR-команде и внутренним коммуникациям.",
    image: {
      url: "/blog/blog-corporate-merch.webp",
      alt: "Команда в корпоративной одежде",
      width: 553,
      height: 250,
    },
    heroImage: {
      url: "/blog/article-corporate-merch-hero.webp",
      alt: "Корпоративный мерч с брендированными футболками",
      width: 1740,
      height: 400,
    },
    sections: [
      {
        type: "summary",
        title: "ИТОГ",
        paragraphs: [
          "Корпоративный мерч сегодня это не просто сувенирная продукция с логотипом. Это инструмент, который одновременно работает на маркетинг, HR-бренд и лояльность клиентов.",
          "Когда брендированный мерч продуман и качественно реализован, он превращается из разового подарка в постоянный носитель бренда. Именно поэтому всё больше компаний рассматривают мерч для компании как стратегическую часть коммуникации с сотрудниками, клиентами и партнёрами.",
        ],
        image: {
          url: "/blog/article-corporate-merch-summary.webp",
          alt: "Команда в черном корпоративном мерче",
          width: 2560,
          height: 1707,
        },
      },
    ],
  },
];

export const blogArticlesMock: BlogArticle[] = BLOG_ARTICLE_DTO_MOCK.map(mapBlogArticleFromDto);

export const blogPostsMock: BlogPost[] = BLOG_ARTICLE_DTO_MOCK.map(mapBlogPostFromDto);

export function getBlogPosts(): BlogPost[] {
  return blogPostsMock;
}

export function getBlogPostBySlug(slug: string): BlogArticle | undefined {
  return blogArticlesMock.find((article) => article.slug === slug);
}

export function getBlogPostSlugs(): string[] {
  return blogArticlesMock.map((article) => article.slug);
}
