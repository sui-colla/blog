/**
 * Resend 邮件服务集成
 *
 * - addSubscriber: 将邮箱添加到 Resend Audience（自动识别重复订阅 409）
 * - sendContactMessage: 通过 Resend Email API 发送联系表单邮件
 * - 8 秒超时保护，避免 Resend 响应慢时阻塞请求
 * - 环境变量缺失时返回 503，不抛出异常
 */
import type {
  ContactInput,
  ContactSuccessCode,
  FormErrorCode,
  SubscribeSuccessCode,
} from "./validation";

type ProviderResult<TCode extends string> =
  | { ok: true; code: TCode }
  | { ok: false; error: FormErrorCode; status: number };

const RESEND_API_BASE = "https://api.resend.com";
const RESEND_TIMEOUT_MS = 8000;

function getRequiredEnv(name: string): string | null {
  const value = process.env[name];
  return value?.trim() ? value.trim() : null;
}

async function fetchResend(pathname: string, init: RequestInit): Promise<Response> {
  const apiKey = getRequiredEnv("RESEND_API_KEY");
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), RESEND_TIMEOUT_MS);

  try {
    return await fetch(`${RESEND_API_BASE}${pathname}`, {
      ...init,
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        ...init.headers,
      },
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function safeJson(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function isDuplicateContact(response: Response, body: unknown): boolean {
  if (response.status === 409) return true;

  if (!body || typeof body !== "object") return false;
  const text = JSON.stringify(body).toLowerCase();
  return text.includes("already") || text.includes("exists") || text.includes("duplicate");
}

export async function addSubscriber(
  email: string
): Promise<ProviderResult<SubscribeSuccessCode>> {
  const audienceId = getRequiredEnv("RESEND_AUDIENCE_ID");
  if (!getRequiredEnv("RESEND_API_KEY") || !audienceId) {
    return { ok: false, error: "service_unavailable", status: 503 };
  }

  try {
    const response = await fetchResend(
      `/audiences/${encodeURIComponent(audienceId)}/contacts`,
      {
        method: "POST",
        body: JSON.stringify({ email, unsubscribed: false }),
      }
    );

    if (response.ok) {
      return { ok: true, code: "subscribed" };
    }

    const body = await safeJson(response);
    if (isDuplicateContact(response, body)) {
      return { ok: true, code: "already_subscribed" };
    }

    return { ok: false, error: "provider_error", status: 502 };
  } catch {
    return { ok: false, error: "provider_error", status: 502 };
  }
}

export async function sendSubscriptionConfirmation(email: string): Promise<void> {
  const from = getRequiredEnv("FORMS_FROM_EMAIL");
  if (!from || !getRequiredEnv("RESEND_API_KEY")) {
    console.error("Subscription confirmation email is not configured");
    return;
  }

  try {
    const response = await fetchResend("/emails", {
      method: "POST",
      body: JSON.stringify({
        from,
        to: [email],
        subject: "订阅成功 - LunaPath Blog",
        text: [
          "感谢订阅 LunaPath Blog。",
          "",
          "有新文章发布时，我们会通过此邮箱通知你。",
          "",
          "https://xiaojiccc.xyz",
        ].join("\n"),
      }),
    });

    if (!response.ok) {
      console.error("Failed to send subscription confirmation", {
        status: response.status,
      });
    }
  } catch {
    console.error("Failed to send subscription confirmation");
  }
}

function buildContactText({ name, email, message }: ContactInput): string {
  return [
    "New message from LunaPath Blog contact form.",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    "",
    "Message:",
    message,
  ].join("\n");
}

function buildSubject(name: string): string {
  const safeName = name.replace(/[\r\n]+/g, " ").trim();
  return `New blog message from ${safeName}`;
}

export async function sendContactMessage(
  input: ContactInput
): Promise<ProviderResult<ContactSuccessCode>> {
  const from = getRequiredEnv("FORMS_FROM_EMAIL");
  const to = getRequiredEnv("CONTACT_TO_EMAIL");

  if (!getRequiredEnv("RESEND_API_KEY") || !from || !to) {
    return { ok: false, error: "service_unavailable", status: 503 };
  }

  try {
    const response = await fetchResend("/emails", {
      method: "POST",
      body: JSON.stringify({
        from,
        to: [to],
        subject: buildSubject(input.name),
        text: buildContactText(input),
        reply_to: input.email,
      }),
    });

    if (response.ok) {
      return { ok: true, code: "sent" };
    }

    return { ok: false, error: "provider_error", status: 502 };
  } catch {
    return { ok: false, error: "provider_error", status: 502 };
  }
}
