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
