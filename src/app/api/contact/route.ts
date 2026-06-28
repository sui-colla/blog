import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const messagesFile = path.join(dataDir, "messages.json");

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function loadMessages(): Array<{
  name: string;
  email: string;
  message: string;
  date: string;
}> {
  if (!fs.existsSync(messagesFile)) return [];
  try {
    return JSON.parse(fs.readFileSync(messagesFile, "utf-8"));
  } catch {
    return [];
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body as {
      name?: string;
      email?: string;
      message?: string;
    };

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { ok: false, error: "missing_fields" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { ok: false, error: "invalid_email" },
        { status: 400 }
      );
    }

    ensureDataDir();
    const messages = loadMessages();
    messages.push({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      date: new Date().toISOString(),
    });
    fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2), "utf-8");

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "server_error" },
      { status: 500 }
    );
  }
}
