/**
 * 侧栏数据（标签 + 热门文章）
 *
 * 只在服务端组件里调用，避免每个页面重复拼装。
 */
import { getAllTags, getPopularPosts } from "@/lib/content/posts";

export function getSidebarData(limit = 5) {
  return {
    tags: getAllTags(),
    popularPosts: getPopularPosts(limit),
  };
}
