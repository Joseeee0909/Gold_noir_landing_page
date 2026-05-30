import { NextResponse } from "next/server";

export const runtime = "nodejs";

const HOP_BY_HOP_HEADERS = new Set(["connection", "content-length", "keep-alive", "transfer-encoding", "upgrade"]);

async function proxy(request, paramsPromise) {
  const backendUrl = process.env.BACKEND_URL || "http://localhost:4000";
  const params = await paramsPromise;
  const path = Array.isArray(params?.path) ? params.path.join("/") : "";
  const targetUrl = `${backendUrl}/${path}${request.nextUrl.search}`;
  const method = request.method.toUpperCase();
  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("content-length");

  const body = method === "GET" || method === "HEAD" ? undefined : await request.arrayBuffer();
  const backendResponse = await fetch(targetUrl, {
    method,
    headers,
    body,
    redirect: "manual",
  });

  const response = new NextResponse(backendResponse.body, { status: backendResponse.status });
  backendResponse.headers.forEach((value, key) => {
    if (HOP_BY_HOP_HEADERS.has(key.toLowerCase()) || key.toLowerCase() === "set-cookie") return;
    response.headers.set(key, value);
  });

  const setCookieHeaders = typeof backendResponse.headers.getSetCookie === "function"
    ? backendResponse.headers.getSetCookie()
    : backendResponse.headers.get("set-cookie")
      ? [backendResponse.headers.get("set-cookie")]
      : [];

  for (const cookieHeader of setCookieHeaders) {
    response.headers.append("set-cookie", cookieHeader);
  }

  return response;
}

export async function GET(request, context) {
  return proxy(request, context.params);
}

export async function POST(request, context) {
  return proxy(request, context.params);
}

export async function PUT(request, context) {
  return proxy(request, context.params);
}

export async function PATCH(request, context) {
  return proxy(request, context.params);
}

export async function DELETE(request, context) {
  return proxy(request, context.params);
}
