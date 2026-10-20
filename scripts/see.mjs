#!/usr/bin/env node
/**
 * 视觉辅助脚本：通过本地代理 wb-proxy (127.0.0.1:8788) 调用 glm-5v-turbo
 * 视觉模型描述一张图片。当前会话主模型不支持图像输入时用它当"眼睛"。
 *
 * 用法: node scripts/see.mjs <图片路径> [提示词]
 */
import fs from "node:fs";
import path from "node:path";

const [img, promptArg] = process.argv.slice(2);
if (!img) {
  console.error("用法: node scripts/see.mjs <图片路径> [提示词]");
  process.exit(1);
}

const abs = path.resolve(img);
if (!fs.existsSync(abs)) {
  console.error(`错误: 找不到图片 ${abs}`);
  process.exit(1);
}

const prompt =
  promptArg ??
  "请用中文详细描述这张网页截图：整体布局、背景色、卡片结构、导航栏、侧栏、文字颜色、圆角、间距、按钮样式。尽量具体。";

const b64 = fs.readFileSync(abs).toString("base64");
const payload = {
  model: "glm-5v-turbo",
  messages: [
    {
      role: "user",
      content: [
        { type: "text", text: prompt },
        { type: "image_url", image_url: { url: `data:image/png;base64,${b64}` } },
      ],
    },
  ],
  max_tokens: 4096,
};

const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), 180000);

try {
  const res = await fetch("http://127.0.0.1:8788/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: "Bearer wb-local",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    signal: controller.signal,
  });
  const json = await res.json();
  const content = json?.choices?.[0]?.message?.content;
  if (content === undefined) {
    console.error("API 返回异常: " + JSON.stringify(json).slice(0, 500));
    process.exit(1);
  }
  process.stdout.write(content);
} catch (err) {
  console.error(`请求失败: ${err.message}`);
  process.exit(1);
} finally {
  clearTimeout(timer);
}
