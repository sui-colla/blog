/**
 * 热门文章 slug 列表（手动维护）
 *
 * 顺序即为显示顺序。后续可改为从 Umami 统计后台动态获取。
 * 如果 slug 对应的文章不存在或未发布，会被自动过滤掉。
 */
export const popularPostSlugs = [
  "nextjs-guide",
  "plc-learning-roadmap",
  "sekiro-guide",
  "cs2-guide",
  "gta5-guide",
] as const;
