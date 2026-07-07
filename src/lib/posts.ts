import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkRehype from "remark-rehype";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
import { popularPostSlugs } from "@/config/popular-posts";
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

export interface SearchIndexItem {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  content: string;
  series?: string;
}

interface ParsedPostFile {
  meta: PostMeta;
  content: string;
}

let postMetaCache: PostMeta[] | null = null;
const postFileCache = new Map<string, ParsedPostFile>();
const postContentCache = new Map<string, Post>();

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

/** 将 markdown 正文转为纯文本，截取前 maxLen 个字符 */
function markdownToPlainText(md: string, maxLen = 500): string {
  const text = md
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/(\*{1,3}|_{1,3})(.*?)\1/g, "$2")
    .replace(/~~(.*?)~~/g, "$1")
    .replace(/^>\s*/gm, "")
    .replace(/^[\s]*[-*+]\s+/gm, "")
    .replace(/^[\s]*\d+\.\s+/gm, "")
    .replace(/^[-*_]{3,}\s*$/gm, "")
    .replace(/<[^>]*>/g, "")
    .replace(/\n{2,}/g, "\n")
    .trim();

  return text.length > maxLen ? text.slice(0, maxLen) : text;
}

function assertString(value: unknown, field: string, slug: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`文章 ${slug} 缺少必填 frontmatter: ${field}`);
  }
  return value;
}

function assertValidDate(value: string, field: string, slug: string) {
  if (Number.isNaN(new Date(value).getTime())) {
    throw new Error(`文章 ${slug} 的 frontmatter.${field} 不是有效日期: ${value}`);
  }
}

function parseTags(value: unknown, slug: string): string[] | undefined {
  if (value === undefined) return undefined;
  if (!Array.isArray(value) || !value.every((tag) => typeof tag === "string")) {
    throw new Error(`文章 ${slug} 的 frontmatter.tags 必须是字符串数组`);
  }
  return value;
}

function readPostFile(slug: string): ParsedPostFile | null {
  const cached = postFileCache.get(slug);
  if (cached) return cached;

  const fullPath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContent = fs.readFileSync(fullPath, "utf-8");
  const parsed = parsePostFile(slug, fileContent);
  postFileCache.set(slug, parsed);
  return parsed;
}

function parsePostFile(slug: string, fileContent: string): ParsedPostFile {
  const { data, content } = matter(fileContent);
  const title = assertString(data.title, "title", slug);
  const date = assertString(data.date, "date", slug);
  const summary = assertString(data.summary, "summary", slug);
  const publishAt = typeof data.publishAt === "string" ? data.publishAt : undefined;

  assertValidDate(date, "date", slug);
  if (publishAt) assertValidDate(publishAt, "publishAt", slug);

  const { readingTime, wordCount } = calcReadingStats(content);

  return {
    meta: {
      slug,
      title,
      date,
      summary,
      tags: parseTags(data.tags, slug),
      cover: typeof data.cover === "string" ? data.cover : undefined,
      readingTime,
      wordCount,
      pinned: data.pinned === true,
      draft: data.draft === true,
      publishAt,
      series: typeof data.series === "string" ? data.series : undefined,
    },
    content,
  };
}

function getAllPostMetas(): PostMeta[] {
  if (postMetaCache) return postMetaCache;

  const filenames = fs.readdirSync(postsDirectory).filter((f) => f.endsWith(".md"));
  postMetaCache = filenames.map((filename) => {
    const slug = filename.replace(/\.md$/, "");
    const parsed = readPostFile(slug);
    if (!parsed) {
      throw new Error(`无法读取文章: ${filename}`);
    }
    return parsed.meta;
  });

  return postMetaCache;
}

function isPublishedPost(post: Pick<PostMeta, "draft" | "publishAt">, now = new Date()): boolean {
  if (post.draft) return false;
  if (post.publishAt && new Date(post.publishAt) > now) return false;
  return true;
}

function sortPosts(posts: PostMeta[]): PostMeta[] {
  return [...posts].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

/**
 * 读取所有文章的元数据（按日期倒序，置顶优先）
 * - draft: true 的文章不会显示
 * - publishAt: 未来日期的文章不会显示（定时发布）
 * - pinned: true 的文章置顶显示
 */
export function getAllPosts(): PostMeta[] {
  const now = new Date();
  return sortPosts(getAllPostMetas().filter((post) => isPublishedPost(post, now)));
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
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, "zh-CN"));
}

/**
 * 根据标签获取文章列表
 */
export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPosts().filter((post) => post.tags?.includes(tag));
}

/**
 * 获取同系列的文章列表
 */
export function getPostsBySeries(series: string): PostMeta[] {
  return getAllPosts().filter((post) => post.series === series);
}

/**
 * 获取热门文章。第一版使用静态 slug 列表，后续可根据统计后台数据调整顺序。
 */
export function getPopularPosts(limit = 5): PostMeta[] {
  const posts = getAllPosts();
  const postMap = new Map(posts.map((post) => [post.slug, post]));
  const configuredPosts = popularPostSlugs
    .map((slug) => postMap.get(slug))
    .filter((post): post is PostMeta => Boolean(post));

  const source = configuredPosts.length > 0 ? configuredPosts : posts;
  return source.slice(0, limit);
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
 * 获取搜索索引条目。复用发布过滤，避免草稿和未来文章进入搜索。
 */
export function getSearchIndexItems(): SearchIndexItem[] {
  const now = new Date();

  return sortPosts(getAllPostMetas().filter((post) => isPublishedPost(post, now))).map((post) => {
    const parsed = readPostFile(post.slug);
    if (!parsed) {
      throw new Error(`无法读取文章: ${post.slug}`);
    }

    return {
      slug: post.slug,
      title: post.title,
      summary: post.summary,
      tags: post.tags ?? [],
      content: markdownToPlainText(parsed.content),
      series: post.series,
    };
  });
}

/**
 * 根据 slug 读取完整文章（含 HTML 内容）
 */
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const parsed = readPostFile(slug);
  if (!parsed || !isPublishedPost(parsed.meta)) {
    return null;
  }

  const cached = postContentCache.get(slug);
  if (cached) return cached;

  const headings: TocHeading[] = [];

  const processed = await remark()
    .use(remarkRehype)
    .use(rehypePrettyCode, {
      theme: "one-dark-pro",
      keepBackground: true,
    })
    .use(rehypeTocPlugin, { headings })
    .use(rehypeStringify)
    .process(parsed.content);
  const contentHtml = processed.toString();

  const post = {
    ...parsed.meta,
    contentHtml,
    headings,
  };

  postContentCache.set(slug, post);
  return post;
}
