import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content", "posts");

/** 将 markdown 正文转为纯文本，截取前 maxLen 个字符 */
function markdownToPlainText(md: string, maxLen = 500): string {
  const text = md
    // 移除代码块
    .replace(/```[\s\S]*?```/g, "")
    // 移除行内代码
    .replace(/`[^`]*`/g, "")
    // 移除链接，保留文字
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    // 移除图片
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    // 移除标题标记
    .replace(/^#{1,6}\s+/gm, "")
    // 移除加粗/斜体标记
    .replace(/(\*{1,3}|_{1,3})(.*?)\1/g, "$2")
    // 移除删除线
    .replace(/~~(.*?)~~/g, "$1")
    // 移除引用标记
    .replace(/^>\s*/gm, "")
    // 移除列表标记
    .replace(/^[\s]*[-*+]\s+/gm, "")
    .replace(/^[\s]*\d+\.\s+/gm, "")
    // 移除水平线
    .replace(/^[-*_]{3,}\s*$/gm, "")
    // 移除 HTML 标签
    .replace(/<[^>]*>/g, "")
    // 合并多余空白
    .replace(/\n{2,}/g, "\n")
    .trim();

  return text.length > maxLen ? text.slice(0, maxLen) : text;
}

export interface SearchIndexItem {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  content: string;
}

export async function GET() {
  const filenames = fs.readdirSync(postsDirectory).filter((f) => f.endsWith(".md"));

  const items: SearchIndexItem[] = filenames.map((filename) => {
    const slug = filename.replace(/\.md$/, "");
    const fullPath = path.join(postsDirectory, filename);
    const fileContent = fs.readFileSync(fullPath, "utf-8");
    const { data, content } = matter(fileContent);

    return {
      slug,
      title: data.title as string,
      summary: data.summary as string,
      tags: (data.tags as string[]) ?? [],
      content: markdownToPlainText(content),
    };
  });

  return Response.json(items);
}
