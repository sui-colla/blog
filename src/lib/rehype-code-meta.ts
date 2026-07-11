/**
 * rehype-code-meta 插件
 *
 * 对 rehype-pretty-code 的输出做二次加工：
 * - 为每个代码块的 <figure> 注入统一的 header 结构（标题 + 语言标签 + 操作区）
 * - 操作区（.code-block-actions）供 ArticleContent 在客户端注入「复制」按钮
 * - 如果 rehype-pretty-code 已生成 title 节点，则替换为自定义 header；
 *   否则在 <pre> 前插入
 *
 * 为什么要拆分？让样式/结构（rehype）和交互逻辑（客户端）解耦。
 */
import type { Element, ElementContent, Root, Text } from "hast";

function isElement(node: unknown): node is Element {
  return typeof node === "object" && node !== null && "type" in node && (node as { type?: unknown }).type === "element";
}

function hasProperty(element: Element, key: string): boolean {
  return Boolean(element.properties && key in element.properties);
}

function getStringProperty(element: Element | undefined, key: string): string {
  if (!element?.properties) return "";
  const value = element.properties[key];
  return typeof value === "string" ? value.trim() : "";
}

function appendClass(element: Element, className: string) {
  element.properties = element.properties ?? {};
  const current = element.properties.className;
  const classes = Array.isArray(current) ? current.map(String) : typeof current === "string" ? current.split(/\s+/) : [];
  if (!classes.includes(className)) classes.push(className);
  element.properties.className = classes;
}

function extractText(node: Element | Text): string {
  if (node.type === "text") return node.value;
  return node.children.map((child) => (isElement(child) || child.type === "text" ? extractText(child) : "")).join("");
}

function createSpan(className: string, text: string): Element {
  return {
    type: "element",
    tagName: "span",
    properties: { className: [className] },
    children: [{ type: "text", value: text } as Text],
  };
}

function createActions(): Element {
  return {
    type: "element",
    tagName: "div",
    properties: { className: ["code-block-actions"] },
    children: [],
  };
}

function findFirst(element: Element, predicate: (child: Element) => boolean): Element | undefined {
  for (const child of element.children) {
    if (!isElement(child)) continue;
    if (predicate(child)) return child;
    const nested = findFirst(child, predicate);
    if (nested) return nested;
  }
  return undefined;
}

function enhanceCodeFigure(figure: Element) {
  appendClass(figure, "code-block");

  const pre = findFirst(figure, (child) => child.tagName === "pre");
  const titleNodeIndex = figure.children.findIndex((child) => isElement(child) && hasProperty(child, "data-rehype-pretty-code-title"));
  const titleNode = isElement(figure.children[titleNodeIndex]) ? figure.children[titleNodeIndex] : undefined;
  const title = titleNode ? extractText(titleNode).trim() : "";
  const language = getStringProperty(pre, "data-language") || getStringProperty(titleNode, "data-language");

  const headerChildren: ElementContent[] = [];
  headerChildren.push(createSpan("code-block-title", title || language || "code"));
  headerChildren.push({
    type: "element",
    tagName: "div",
    properties: { className: ["code-block-meta"] },
    children: [
      ...(language ? [createSpan("code-block-language", language)] : []),
      createActions(),
    ],
  } as Element);

  const header: Element = {
    type: "element",
    tagName: "div",
    properties: { className: ["code-block-header"] },
    children: headerChildren,
  };

  if (titleNodeIndex >= 0) {
    figure.children[titleNodeIndex] = header;
  } else {
    const preIndex = figure.children.findIndex((child) => child === pre);
    figure.children.splice(preIndex >= 0 ? preIndex : 0, 0, header);
  }
}

function walk(node: Element | Root) {
  if (node.type !== "element" && node.type !== "root") return;

  for (const child of node.children) {
    if (!isElement(child)) continue;
    if (child.tagName === "figure" && hasProperty(child, "data-rehype-pretty-code-figure")) {
      enhanceCodeFigure(child);
      continue;
    }
    walk(child);
  }
}

/**
 * Normalize rehype-pretty-code output so code blocks have a stable header/action area.
 */
export function rehypeCodeMetaPlugin() {
  return (tree: Root) => {
    walk(tree);
  };
}
