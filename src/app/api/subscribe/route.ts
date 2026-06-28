import { NextRequest } from "next/server";
import fs from "fs/promises";
import path from "path";

const dataFile = path.join(process.cwd(), "data", "subscribers.json");

async function readSubscribers(): Promise<{ email: string; subscribedAt: string }[]> {
  try {
    const raw = await fs.readFile(dataFile, "utf-8");
    return JSON.parse(raw);
  } catch {
    // 文件不存在时返回空数组
    return [];
  }
}

async function writeSubscribers(
  subscribers: { email: string; subscribedAt: string }[]
): Promise<void> {
  await fs.writeFile(dataFile, JSON.stringify(subscribers, null, 2), "utf-8");
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // 校验：必须是非空字符串
    if (!email || typeof email !== "string") {
      return Response.json({ error: "请输入有效的邮箱地址" }, { status: 400 });
    }

    // 简单的邮箱格式校验
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return Response.json({ error: "邮箱格式不正确" }, { status: 400 });
    }

    const normalized = email.trim().toLowerCase();
    const subscribers = await readSubscribers();

    // 检查是否已订阅
    if (subscribers.find((s) => s.email === normalized)) {
      return Response.json({ message: "你已经订阅过了！" });
    }

    // 写入新订阅者
    subscribers.push({
      email: normalized,
      subscribedAt: new Date().toISOString(),
    });
    await writeSubscribers(subscribers);

    return Response.json({ message: "订阅成功！感谢你的关注。" });
  } catch {
    return Response.json({ error: "服务器内部错误，请稍后再试" }, { status: 500 });
  }
}
