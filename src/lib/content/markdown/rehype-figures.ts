/**
 * rehype-figures 插件
 *
 * 将 Markdown 中独立的图片（<p><img></p>）转换为语义化的 <figure> 结构：
 * - 图片的 title 属性或 alt 文本作为 <figcaption> 显示
 * - 自动添加 loading="lazy" 和 decoding="async" 优化加载性能
 * - 区分有/无标题的样式变体（article-figure--captioned / --plain）
 */
import type { Element, Root, Text } from "hast";

type HastChild = Root["children"][number];

function isElement(node: HastChild): node is Element {
  return node.type === "element";
}

function getStringProperty(element: Element, key: string): string {
  const value = element.properties?.[key];
  return typeof value === "string" ? value.trim() : "";
}

function appendClass(element: Element, className: string) {
  element.properties = element.properties ?? {};
  const current = element.properties.className;
  const classes = Array.isArray(current) ? current.map(String) : typeof current === "string" ? current.split(/\s+/) : [];
  if (!classes.includes(className)) classes.push(className);
  element.properties.className = classes;
}

function createTextElement(tagName: string, className: string, text: string): Element {
  return {
    type: "element",
    tagName,
    properties: { className: [className] },
    children: [{ type: "text", value: text } as Text],
  };
}

function transformChildren(children: HastChild[]) {
  for (let index = 0; index < children.length; index += 1) {
    const child = children[index];
    if (!isElement(child)) continue;

    if (child.tagName === "p" && child.children.length === 1 && isElement(child.children[0]) && child.children[0].tagName === "img") {
      const img = child.children[0];
      img.properties = img.properties ?? {};
      appendClass(img, "article-image");
      img.properties.loading = img.properties.loading ?? "lazy";
      img.properties.decoding = img.properties.decoding ?? "async";

      const title = getStringProperty(img, "title");
      const alt = getStringProperty(img, "alt");
      const caption = title || alt;
      delete img.properties.title;

      children[index] = {
        type: "element",
        tagName: "figure",
        properties: {
          className: ["article-figure", caption ? "article-figure--captioned" : "article-figure--plain"],
        },
        children: caption ? [img, createTextElement("figcaption", "article-figcaption", caption)] : [img],
      } as Element;
      continue;
    }

    transformChildren(child.children);
  }
}

/**
 * Convert standalone Markdown images into semantic figures with optional captions.
 */
export function rehypeFiguresPlugin() {
  return (tree: Root) => {
    transformChildren(tree.children);
  };
}
