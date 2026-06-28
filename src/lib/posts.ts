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
}

export interface Post extends PostMeta {
  contentHtml: string;
  headings: TocHeading[];
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
      const { data } = matter(fileContent);

      return {
        slug,
        title: data.title as string,
        date: data.date as string,
        summary: data.summary as string,
        tags: data.tags as string[] | undefined,
      };
    });

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
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
    contentHtml,
    headings,
  };
}
