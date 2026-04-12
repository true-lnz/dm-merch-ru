export type {
  BlogArticle,
  BlogArticleDto,
  BlogPost,
  BlogPostDto,
  CmsImage,
} from "./model/types";
export { mapBlogArticleFromDto, mapBlogPostFromDto } from "./model/mappers";
export {
  blogArticlesMock,
  blogPostsMock,
  getBlogPostBySlug,
  getBlogPosts,
  getBlogPostSlugs,
} from "./model/mock";
