export type FormErrorCode =
  | "invalid_payload"
  | "missing_fields"
  | "invalid_email"
  | "name_too_long"
  | "email_too_long"
  | "message_too_long"
  | "invalid_origin"
  | "service_unavailable"
  | "provider_error";

export type SubscribeSuccessCode = "subscribed" | "already_subscribed";
export type ContactSuccessCode = "sent";

export type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: FormErrorCode; status: number };

export interface SubscribeInput {
  email: string;
}

export interface ContactInput {
  name: string;
  email: string;
  message: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 254;
const MAX_NAME_LENGTH = 80;
const MAX_MESSAGE_LENGTH = 4000;

function getStringField(payload: unknown, key: string): string | null {
  if (!payload || typeof payload !== "object") return null;
  const value = (payload as Record<string, unknown>)[key];
  return typeof value === "string" ? value.trim() : null;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function validateSubscribePayload(
  payload: unknown
): ValidationResult<SubscribeInput> {
  const email = getStringField(payload, "email");

  if (!email) {
    return { ok: false, error: "missing_fields", status: 400 };
  }

  if (email.length > MAX_EMAIL_LENGTH) {
    return { ok: false, error: "email_too_long", status: 400 };
  }

  const normalized = normalizeEmail(email);
  if (!EMAIL_REGEX.test(normalized)) {
    return { ok: false, error: "invalid_email", status: 400 };
  }

  return { ok: true, data: { email: normalized } };
}

export function validateContactPayload(
  payload: unknown
): ValidationResult<ContactInput> {
  const name = getStringField(payload, "name");
  const email = getStringField(payload, "email");
  const message = getStringField(payload, "message");

  if (!name || !email || !message) {
    return { ok: false, error: "missing_fields", status: 400 };
  }

  if (name.length > MAX_NAME_LENGTH) {
    return { ok: false, error: "name_too_long", status: 400 };
  }

  if (email.length > MAX_EMAIL_LENGTH) {
    return { ok: false, error: "email_too_long", status: 400 };
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return { ok: false, error: "message_too_long", status: 400 };
  }

  const normalizedEmail = normalizeEmail(email);
  if (!EMAIL_REGEX.test(normalizedEmail)) {
    return { ok: false, error: "invalid_email", status: 400 };
  }

  return {
    ok: true,
    data: {
      name,
      email: normalizedEmail,
      message,
    },
  };
}

export function validateRequestOrigin(request: Request): ValidationResult<null> {
  const configured = process.env.FORM_ALLOWED_ORIGINS;
  if (!configured?.trim()) {
    return { ok: true, data: null };
  }

  const origin = request.headers.get("origin");
  if (!origin) {
    return { ok: true, data: null };
  }

  const allowedOrigins = configured
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  if (allowedOrigins.includes(origin)) {
    return { ok: true, data: null };
  }

  return { ok: false, error: "invalid_origin", status: 403 };
}
