import type { BlogArticle, BlogArticleDto, BlogPost, BlogPostDto } from "./types";

export function mapBlogPostFromDto(dto: BlogPostDto): BlogPost {
  return {
    ...dto,
    href: `/blog/${dto.slug}`,
  };
}

export function mapBlogArticleFromDto(dto: BlogArticleDto): BlogArticle {
  const post = mapBlogPostFromDto(dto);

  return {
    ...post,
    pageTitle: dto.pageTitle ?? dto.title,
    seoTitle: dto.seoTitle ?? dto.pageTitle ?? dto.title,
    breadcrumbCurrentLabel: dto.breadcrumbCurrentLabel ?? "Статьи",
    heroImage: dto.heroImage ?? dto.image,
  };
}
