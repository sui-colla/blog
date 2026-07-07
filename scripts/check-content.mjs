#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const projectRoot = process.cwd();
const postsDirectory = path.join(projectRoot, "content", "posts");
const publicDirectory = path.join(projectRoot, "public");
const checkExternal = process.argv.includes("--external");
const imageSizeWarningBytes = 500 * 1024;
const externalTimeoutMs = 5000;

const externalProtocols = new Set(["http:", "https:"]);
const ignoredProtocols = new Set(["mailto:", "tel:", "sms:", "javascript:"]);

const postFiles = fs.existsSync(postsDirectory)
  ? fs.readdirSync(postsDirectory).filter((filename) => filename.endsWith(".md")).sort()
  : [];
const postSlugs = new Set(postFiles.map((filename) => filename.replace(/\.md$/, "")));

const reports = [];

function normalizePathForOutput(filePath) {
  return path.relative(projectRoot, filePath).split(path.sep).join("/");
}

function createReport(filePath) {
  return {
    file: normalizePathForOutput(filePath),
    errors: [],
    warnings: [],
  };
}

function addError(report, message) {
  report.errors.push(message);
}

function addWarning(report, message) {
  report.warnings.push(message);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isValidDate(value) {
  return !Number.isNaN(new Date(value).getTime());
}

function normalizeName(value) {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase("zh-CN");
}

function checkStringField(report, data, field, { required = false } = {}) {
  const value = data[field];
  if (value === undefined) {
    if (required) addError(report, `frontmatter.${field} 是必填字段`);
    return undefined;
  }

  if (!isNonEmptyString(value)) {
    addError(report, `frontmatter.${field} 必须是非空字符串`);
    return undefined;
  }

  if (value !== value.trim()) {
    addWarning(report, `frontmatter.${field} 包含首尾空格，建议去除`);
  }

  return value;
}

function checkBooleanField(report, data, field) {
  const value = data[field];
  if (value !== undefined && typeof value !== "boolean") {
    addError(report, `frontmatter.${field} 必须是布尔值 true/false`);
  }
}

function checkDateField(report, data, field, { required = false } = {}) {
  const value = checkStringField(report, data, field, { required });
  if (value && !isValidDate(value)) {
    addError(report, `frontmatter.${field} 不是有效日期: ${value}`);
  }
}

function checkTags(report, data) {
  const tags = data.tags;
  if (tags === undefined) return;

  if (!Array.isArray(tags) || !tags.every((tag) => typeof tag === "string")) {
    addError(report, "frontmatter.tags 必须是字符串数组");
    return;
  }

  const seen = new Map();
  for (const tag of tags) {
    if (!isNonEmptyString(tag)) {
      addError(report, "frontmatter.tags 不能包含空标签");
      continue;
    }

    if (tag !== tag.trim()) {
      addWarning(report, `标签 "${tag}" 包含首尾空格，建议写为 "${tag.trim()}"`);
    }

    const normalized = normalizeName(tag);
    const existing = seen.get(normalized);
    if (existing) {
      const level = existing === tag ? "重复" : "归一后冲突";
      addError(report, `标签 "${tag}" 与 "${existing}" ${level}`);
    } else {
      seen.set(normalized, tag);
    }
  }
}

function stripCode(content) {
  return content.replace(/```[\s\S]*?```/g, "").replace(/`[^`]*`/g, "");
}

function extractMarkdownImages(content) {
  const images = [];
  const regex = /!\[([^\]]*)\]\(([^)\n]+)\)/g;
  let match;
  while ((match = regex.exec(content))) {
    images.push({ alt: match[1], rawTarget: match[2].trim() });
  }
  return images;
}

function extractMarkdownLinks(content) {
  const links = [];
  const regex = /(?<!!)#?\[([^\]]+)\]\(([^)\n]+)\)/g;
  let match;
  while ((match = regex.exec(content))) {
    links.push({ text: match[1], rawTarget: match[2].trim() });
  }
  return links;
}

function parseMarkdownTargetDetails(rawTarget) {
  let target = rawTarget.trim();
  if (target.startsWith("<") && target.includes(">")) {
    const closingIndex = target.indexOf(">");
    const url = target.slice(1, closingIndex);
    const rest = target.slice(closingIndex + 1).trim();
    const titleMatch = rest.match(/^["'](.*)["']$/);
    return { target: url, title: titleMatch?.[1]?.trim() ?? "" };
  }

  const titleMatch = target.match(/^([^\s]+)\s+["'](.*)["']$/);
  if (titleMatch) return { target: titleMatch[1], title: titleMatch[2].trim() };

  return { target, title: "" };
}

function parseMarkdownTarget(rawTarget) {
  return parseMarkdownTargetDetails(rawTarget).target;
}

function withoutHashAndQuery(target) {
  return target.split("#")[0].split("?")[0];
}

function classifyTarget(target) {
  if (!target || target.startsWith("#")) return "ignored";

  try {
    const url = new URL(target);
    if (externalProtocols.has(url.protocol)) return "external";
    if (ignoredProtocols.has(url.protocol)) return "ignored";
  } catch {
    // Relative URL or site-root path.
  }

  return "local";
}

function resolvePublicPath(sitePath) {
  const cleanPath = decodeURIComponent(withoutHashAndQuery(sitePath)).replace(/^\/+/, "");
  return path.join(publicDirectory, cleanPath);
}

function resolveRelativePath(currentFilePath, target) {
  const cleanTarget = decodeURIComponent(withoutHashAndQuery(target));
  return path.resolve(path.dirname(currentFilePath), cleanTarget);
}

function checkSiteRoute(report, target, label) {
  const cleanTarget = decodeURIComponent(withoutHashAndQuery(target));
  if (cleanTarget === "") return;

  if (cleanTarget.startsWith("/posts/")) {
    const slug = cleanTarget.replace(/^\/posts\//, "").replace(/\/$/, "");
    if (!slug || slug.includes("/")) {
      addWarning(report, `${label} "${target}" 不是可静态校验的文章链接`);
      return;
    }
    if (!postSlugs.has(slug)) {
      addError(report, `${label} 指向不存在的文章: ${target}`);
    }
    return;
  }

  const publicPath = resolvePublicPath(cleanTarget);
  if (fs.existsSync(publicPath)) return;

  if (cleanTarget.startsWith("/images/") || path.extname(cleanTarget)) {
    addError(report, `${label} 指向不存在的 public 资源: ${target}`);
    return;
  }

  addWarning(report, `${label} "${target}" 是站内路由，当前内容检查无法静态确认`);
}

function checkLocalFile(report, currentFilePath, target, label) {
  const cleanTarget = withoutHashAndQuery(target);
  if (!cleanTarget) return;

  if (cleanTarget.startsWith("/")) {
    checkSiteRoute(report, cleanTarget, label);
    return;
  }

  const resolved = resolveRelativePath(currentFilePath, cleanTarget);
  if (!fs.existsSync(resolved)) {
    addError(report, `${label} 指向不存在的相对路径: ${target}`);
  }
}

function checkImageSize(report, imagePath, target) {
  if (!fs.existsSync(imagePath) || !fs.statSync(imagePath).isFile()) return;
  const size = fs.statSync(imagePath).size;
  if (size > imageSizeWarningBytes) {
    addWarning(report, `图片 "${target}" 体积 ${(size / 1024).toFixed(0)}KB，建议压缩到 500KB 以下`);
  }
}

function resolveLocalImagePath(currentFilePath, target) {
  const cleanTarget = withoutHashAndQuery(target);
  if (!cleanTarget || cleanTarget.startsWith("#")) return null;
  if (cleanTarget.startsWith("/")) return resolvePublicPath(cleanTarget);
  return resolveRelativePath(currentFilePath, cleanTarget);
}

async function checkExternalUrl(report, target, label) {
  if (!checkExternal) return;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), externalTimeoutMs);
  try {
    let response = await fetch(target, { method: "HEAD", signal: controller.signal, redirect: "follow" });
    if (response.status === 405 || response.status === 403) {
      response = await fetch(target, { method: "GET", signal: controller.signal, redirect: "follow" });
    }

    if (!response.ok) {
      addWarning(report, `${label} 外链返回 HTTP ${response.status}: ${target}`);
    }
  } catch (error) {
    addWarning(report, `${label} 外链检查失败: ${target} (${error.name === "AbortError" ? "timeout" : error.message})`);
  } finally {
    clearTimeout(timeout);
  }
}

async function checkPostFile(filename) {
  const filePath = path.join(postsDirectory, filename);
  const slug = filename.replace(/\.md$/, "");
  const report = createReport(filePath);
  reports.push(report);

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  checkDateField(report, data, "date", { required: true });
  checkDateField(report, data, "publishAt");
  checkStringField(report, data, "title", { required: true });
  checkStringField(report, data, "summary", { required: true });
  checkStringField(report, data, "cover");
  checkStringField(report, data, "series");
  checkBooleanField(report, data, "pinned");
  checkBooleanField(report, data, "draft");
  checkTags(report, data);

  if (data.series !== undefined && typeof data.series === "string" && normalizeName(data.series).length === 0) {
    addError(report, "frontmatter.series 不能是空字符串");
  }

  if (typeof data.cover === "string" && data.cover.trim()) {
    const coverTarget = data.cover.trim();
    if (classifyTarget(coverTarget) === "local") {
      checkLocalFile(report, filePath, coverTarget, "frontmatter.cover");
      const coverPath = resolveLocalImagePath(filePath, coverTarget);
      if (coverPath) checkImageSize(report, coverPath, coverTarget);
    } else if (classifyTarget(coverTarget) === "external") {
      await checkExternalUrl(report, coverTarget, "frontmatter.cover");
    }
  }

  const searchableContent = stripCode(content);

  for (const image of extractMarkdownImages(searchableContent)) {
    const { target, title } = parseMarkdownTargetDetails(image.rawTarget);
    if (!image.alt.trim()) {
      addError(report, `图片 "${target}" 缺少 alt 文本`);
    } else if (image.alt.trim().length < 4) {
      addWarning(report, `图片 "${target}" 的 alt 文本过短，建议写得更具体`);
    }
    if (title && title.length < 4) {
      addWarning(report, `图片 "${target}" 的 caption 过短，建议写得更具体`);
    }

    const targetType = classifyTarget(target);
    if (targetType === "local") {
      checkLocalFile(report, filePath, target, "图片");
      const imagePath = resolveLocalImagePath(filePath, target);
      if (imagePath) checkImageSize(report, imagePath, target);
    } else if (targetType === "external") {
      await checkExternalUrl(report, target, "图片");
    }
  }

  for (const link of extractMarkdownLinks(searchableContent)) {
    const target = parseMarkdownTarget(link.rawTarget);
    const targetType = classifyTarget(target);
    if (targetType === "local") {
      checkLocalFile(report, filePath, target, "链接");
    } else if (targetType === "external") {
      await checkExternalUrl(report, target, "链接");
    }
  }

  if (!content.trim()) {
    addWarning(report, `文章 ${slug} 没有正文内容`);
  }
}

function printReport() {
  const reportsWithMessages = reports.filter((report) => report.errors.length > 0 || report.warnings.length > 0);
  const errorCount = reports.reduce((count, report) => count + report.errors.length, 0);
  const warningCount = reports.reduce((count, report) => count + report.warnings.length, 0);

  if (reportsWithMessages.length === 0) {
    console.log(`✅ 内容检查通过：${postFiles.length} 篇文章，0 个错误，0 个警告`);
    return;
  }

  for (const report of reportsWithMessages) {
    console.log(`\n${report.file}`);
    for (const error of report.errors) {
      console.log(`  ✖ ${error}`);
    }
    for (const warning of report.warnings) {
      console.log(`  ⚠ ${warning}`);
    }
  }

  console.log(`\n内容检查完成：${postFiles.length} 篇文章，${errorCount} 个错误，${warningCount} 个警告`);

  if (errorCount > 0) {
    process.exitCode = 1;
  }
}

async function main() {
  if (!fs.existsSync(postsDirectory)) {
    console.error(`找不到文章目录: ${normalizePathForOutput(postsDirectory)}`);
    process.exitCode = 1;
    return;
  }

  if (postFiles.length === 0) {
    console.log("⚠ 没有找到 content/posts/*.md 文章文件");
    return;
  }

  for (const filename of postFiles) {
    await checkPostFile(filename);
  }

  printReport();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
