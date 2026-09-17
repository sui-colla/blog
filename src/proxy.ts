/**
 * Admin 访问代理（Next.js Middleware）
 *
 * 拦截所有 /admin/* 请求，要求 HTTP Basic Auth 认证：
 * - 凭据通过 ADMIN_USERNAME / ADMIN_PASSWORD 环境变量配置
 * - 未配置凭据时返回 404（隐藏后台存在的事实）
 * - 认证失败返回 401 + WWW-Authenticate 头触发浏览器登录弹窗
 *
 * matcher 配置见底部 config，仅匹配 /admin/:path*。
 */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="LunaPath Admin", charset="UTF-8"',
      "Cache-Control": "no-store",
    },
  });
}

function unavailable() {
  return new NextResponse("Not Found", {
    status: 404,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

function parseBasicAuth(header: string | null): { username: string; password: string } | null {
  if (!header?.startsWith("Basic ")) return null;

  try {
    const decoded = atob(header.slice("Basic ".length));
    const separatorIndex = decoded.indexOf(":");
    if (separatorIndex === -1) return null;

    return {
      username: decoded.slice(0, separatorIndex),
      password: decoded.slice(separatorIndex + 1),
    };
  } catch {
    return null;
  }
}

/**
 * .env.example 里的示例密码。
 *
 * 这套后台是用 Basic Auth 保护的，如果线上照抄了示例值，等于用一份公开在
 * 仓库里的密码守着后台 —— 比不配还危险（不配至少会 404 隐藏掉）。
 * 所以把这些值一并当作「未配置」，走 unavailable() 失败关闭。
 */
const PLACEHOLDER_PASSWORDS = new Set(["change-this-password", "password", "admin"]);

function isConfigured(username: string | undefined, password: string | undefined): boolean {
  if (!username || !password) return false;
  return !PLACEHOLDER_PASSWORDS.has(password.trim().toLowerCase());
}

export function proxy(request: NextRequest) {
  const expectedUsername = process.env.ADMIN_USERNAME?.trim();
  const expectedPassword = process.env.ADMIN_PASSWORD?.trim();

  if (!isConfigured(expectedUsername, expectedPassword)) {
    return unavailable();
  }

  const credentials = parseBasicAuth(request.headers.get("authorization"));
  if (!credentials) {
    return unauthorized();
  }

  if (credentials.username !== expectedUsername || credentials.password !== expectedPassword) {
    return unauthorized();
  }

  return NextResponse.next({
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

export const config = {
  matcher: "/admin/:path*",
};
