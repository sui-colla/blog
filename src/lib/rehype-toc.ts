/**
 * rehype-toc 插件
 *
 * 遍历 HAST 树中的 h2/h3/h4 标题元素：
 * 1. 为每个标题生成 URL 友好的锚点 id（支持中文，自动去重）
 * 2. 在标题末尾追加 <a href="#id"> 锚点链接（.heading-anchor）
 * 3. 将标题信息收集到 options.headings 数组，供 TableOfContents 组件使用
 *
 * 必须在 rehype-pretty-code 之后运行，否则代码块内的 # 会被误识别为标题。
 */
import type { Element, Root, Text } from "hast";

export interface TocHeading {
  id: string;
  text: string;
  level: 2 | 3 | 4;
}

interface RehypeTocOptions {
  headings: TocHeading[];
}

/** 递归提取 HAST 节点的纯文本内容 */
function extractText(node: Element | Text | Root): string {
  if (node.type === "text") {
    return (node as Text).value;
  }
  if ("children" in node) {
    return node.children.map((c) => extractText(c as Element | Text | Root)).join("");
  }
  return "";
}

/** 生成 URL 友好的锚点 ID，处理中文和重名去重 */
function makeSlug(text: string, counts: Map<string, number>): string {
  const base = text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w一-鿿㐀-䶿-]/g, "")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");

  const seen = counts.get(base) ?? 0;
  counts.set(base, seen + 1);
  return seen === 0 ? base : `${base}-${seen + 1}`;
}

/** 遍历 HAST 树，为 h2/h3/h4 添加 id 属性并收集标题数据 */
function walk(
  node: Element | Root,
  headings: TocHeading[],
  counts: Map<string, number>,
) {
  if (node.type !== "element" && node.type !== "root") return;

  for (const child of node.children) {
    if (child.type !== "element") continue;

    const el = child as Element;
    const tag = el.tagName;

    if (tag === "h2" || tag === "h3" || tag === "h4") {
      const text = extractText(el).trim();
      if (text) {
        const id = makeSlug(text, counts);
        el.properties = el.properties ?? {};
        el.properties.id = id;
        el.properties.className = [
          ...(Array.isArray(el.properties.className) ? el.properties.className : []),
          "heading-with-anchor",
        ];
        // 添加锚点链接
        el.children.push({
          type: "element",
          tagName: "a",
          properties: {
            href: `#${id}`,
            className: ["heading-anchor"],
            ariaLabel: "Link to this section",
          },
          children: [{ type: "text", value: "#" }],
        } as Element);
        headings.push({
          id,
          text,
          level: Number(tag[1]) as TocHeading["level"],
        });
      }
    }

    // 递归遍历子节点（跳过 h2/h3/h4 内部，避免嵌套标题）
    if (tag !== "h2" && tag !== "h3" && tag !== "h4") {
      walk(el, headings, counts);
    }
  }
}

/**
 * rehype 插件：为文章标题生成 id 并提取目录结构
 *
 * 在 rehypePrettyCode 之后、rehypeStringify 之前使用，
 * 确保代码块内的 # 不会被误识别为标题。
 */
export function rehypeTocPlugin(options: RehypeTocOptions) {
  return (tree: Root) => {
    walk(tree, options.headings, new Map());
  };
}
