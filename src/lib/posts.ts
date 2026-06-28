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
  readingTime: number; // 分钟
}

export interface Post extends PostMeta {
  contentHtml: string;
  headings: TocHeading[];
}

/**
 * 计算阅读时间（分钟）
 * 中文按每分钟 300 字，英文按每分钟 200 词
 */
function calcReadingTime(text: string): number {
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

  const minutes = cjk / 300 + words / 200;
  return Math.max(1, Math.round(minutes));
}

/**
 * 读取所有文章的元数据（按日期倒序）
 */
export function getAllPosts(): PostMeta[] {
  const filenames = fs.readdirSync(postsDirectory);

  const posts = filenames
    .filter((f) => f.endsWith(".md"))
    .map((filename) => {
      const slug = filename.replace(/\.md$/, "");
      const fullPath = path.join(postsDirectory, filename);
      const fileContent = fs.readFileSync(fullPath, "utf-8");
      const { data, content } = matter(fileContent);

      return {
        slug,
        title: data.title as string,
        date: data.date as string,
        summary: data.summary as string,
        tags: data.tags as string[] | undefined,
        readingTime: calcReadingTime(content),
      };
    });

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
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

  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    summary: data.summary as string,
    tags: data.tags as string[] | undefined,
    readingTime: calcReadingTime(content),
    contentHtml,
    headings,
  };
}
