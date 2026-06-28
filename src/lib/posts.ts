import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkRehype from "remark-rehype";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import { rehypeTocPlugin, type TocHeading } from "./rehype-toc";

const postsDirectory = path.join(process.cwd(), "content", "posts");

export { type TocHeading } from "./rehype-toc";

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags?: string[];
  cover?: string; // 封面图路径
  readingTime: number; // 分钟
  wordCount: number; // 总字数（中文字符 + 英文单词）
  pinned?: boolean; // 是否置顶
  draft?: boolean; // 是否草稿
  publishAt?: string; // 定时发布时间（ISO 日期）
  series?: string; // 系列/专栏名称
}

export interface Post extends PostMeta {
  contentHtml: string;
  headings: TocHeading[];
}

/**
 * 计算阅读时间（分钟）和总字数
 * 中文按每分钟 300 字，英文按每分钟 200 词
 */
function calcReadingStats(text: string): { readingTime: number; wordCount: number } {
  // 移除 markdown 语法
  const plain = text
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/[#*_~>\[\]()!|-]/g, "")
    .trim();

  // 统计中文字符数
  const cjk = plain.match(/[一-鿿㐀-䶿]/g)?.length ?? 0;
  // 统计英文单词数
  const words = plain
    .replace(/[一-鿿㐀-䶿]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 0).length;

  const wordCount = cjk + words;
  const minutes = cjk / 300 + words / 200;
  return {
    readingTime: Math.max(1, Math.round(minutes)),
    wordCount,
  };
}

/**
 * 读取所有文章的元数据（按日期倒序，置顶优先）
 * - draft: true 的文章不会显示
 * - publishAt: 未来日期的文章不会显示（定时发布）
 * - pinned: true 的文章置顶显示
 */
export function getAllPosts(): PostMeta[] {
  const filenames = fs.readdirSync(postsDirectory);
  const now = new Date();

  const posts = filenames
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const fullPath = path.join(postsDirectory, filename);
      const fileContent = fs.readFileSync(fullPath, "utf-8");
      const { data, content } = matter(fileContent);

      const { readingTime, wordCount } = calcReadingStats(content);

      return {
        slug,
        title: data.title as string,
        date: data.date as string,
        summary: data.summary as string,
        tags: data.tags as string[] | undefined,
        cover: data.cover as string | undefined,
        readingTime,
        wordCount,
        pinned: data.pinned as boolean | undefined,
        draft: data.draft as boolean | undefined,
        publishAt: data.publishAt as string | undefined,
        series: data.series as string | undefined,
      };
    })
    // 过滤：排除草稿和未到发布时间的文章
    .filter((post) => {
      if (post.draft) return false;
      if (post.publishAt && new Date(post.publishAt) > now) return false;
      return true;
    });

  // 排序：置顶优先，然后按日期倒序
  return posts.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

/**
 * 获取所有标签及其文章数量
 */
export function getAllTags(): { tag: string; count: number }[] {
  const posts = getAllPosts();
  const tagMap = new Map<string, number>();

  for (const post of posts) {
    if (post.tags) {
      for (const tag of post.tags) {
        tagMap.set(tag, (tagMap.get(tag) ?? 0) + 1);
      }
    }
  }

  return Array.from(tagMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * 根据标签获取文章列表
 */
export function getPostsByTag(tag: string): PostMeta[] {
  const posts = getAllPosts();
  return posts.filter((post) => post.tags?.includes(tag));
}

/**
 * 获取同系列的文章列表
 */
export function getPostsBySeries(series: string): PostMeta[] {
  const posts = getAllPosts();
  return posts.filter((post) => post.series === series);
}

/**
 * 获取当前文章的上一篇和下一篇（按日期排序）
 */
export function getAdjacentPosts(slug: string): { prev: PostMeta | null; next: PostMeta | null } {
  const posts = getAllPosts();
  const index = posts.findIndex((p) => p.slug === slug);
  if (index === -1) return { prev: null, next: null };

  // posts 按日期倒序，所以 index-1 是更新的文章（下一篇），index+1 是更早的文章（上一篇）
  return {
    prev: index < posts.length - 1 ? posts[index + 1] : null,
    next: index > 0 ? posts[index - 1] : null,
  };
}

/**
 * 根据 slug 读取完整文章（含 HTML 内容）
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const fullPath = path.join(postsDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContent = fs.readFileSync(fullPath, "utf-8");
  const { data, content } = matter(fileContent);

  const headings: TocHeading[] = [];

  const processed = await remark()
    .use(remarkRehype)
    .use(rehypePrettyCode, {
      theme: "one-dark-pro",
      keepBackground: true,
    })
    .use(rehypeTocPlugin, { headings })
    .use(rehypeStringify)
    .process(content);
  const contentHtml = processed.toString();

  const { readingTime, wordCount } = calcReadingStats(content);

  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    summary: data.summary as string,
    tags: data.tags as string[] | undefined,
    cover: data.cover as string | undefined,
    readingTime,
    wordCount,
    pinned: data.pinned as boolean | undefined,
    draft: data.draft as boolean | undefined,
    publishAt: data.publishAt as string | undefined,
    series: data.series as string | undefined,
    contentHtml,
    headings,
  };
}
