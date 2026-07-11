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

export function proxy(request: NextRequest) {
  const expectedUsername = process.env.ADMIN_USERNAME?.trim();
  const expectedPassword = process.env.ADMIN_PASSWORD?.trim();

  if (!expectedUsername || !expectedPassword) {
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
