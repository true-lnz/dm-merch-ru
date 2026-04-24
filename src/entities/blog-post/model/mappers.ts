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
    pageTitle: dto.pageTitle ?? dto.cardTitle,
    seoTitle: dto.seoTitle ?? dto.pageTitle ?? dto.cardTitle,
    breadcrumbCurrentLabel: dto.breadcrumbCurrentLabel ?? "Статьи",
    sections: dto.sections ?? [],
  };
}
