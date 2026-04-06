import type { BlogPost, BlogPostDto } from "./types";

export function mapBlogPostFromDto(dto: BlogPostDto): BlogPost {
  return {
    ...dto,
    href: `/blog/${dto.slug}`,
  };
}
