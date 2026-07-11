/**
 * 订阅 API（POST /api/subscribe）
 *
 * 处理流程：校验请求来源 → 校验邮箱格式 → 调用 Resend 添加到 audience。
 * 返回结构化错误码供客户端显示对应的 i18n 提示。
 */
import { addSubscriber } from "@/lib/forms/resend";
import {
  validateRequestOrigin,
  validateSubscribePayload,
} from "@/lib/forms/validation";

async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const origin = validateRequestOrigin(request);
  if (!origin.ok) {
    return Response.json(
      { ok: false, error: origin.error },
      { status: origin.status }
    );
  }

  const payload = await readJson(request);
  const validation = validateSubscribePayload(payload);

  if (!validation.ok) {
    return Response.json(
      { ok: false, error: validation.error },
      { status: validation.status }
    );
  }

  const result = await addSubscriber(validation.data.email);

  if (!result.ok) {
    return Response.json(
      { ok: false, error: result.error },
      { status: result.status }
    );
  }

  return Response.json({ ok: true, code: result.code });
}
