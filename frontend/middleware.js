import { NextResponse } from "next/server";
import { getAdminCookieName, verifyAdminSessionToken } from "./lib/admin-session";

export async function middleware(request) {
  const { pathname, search } = request.nextUrl;
  if (pathname.startsWith("/admin/login")) return NextResponse.next();

  const token = request.cookies.get(getAdminCookieName())?.value;
  const authed = await verifyAdminSessionToken(token);
  if (authed) return NextResponse.next();

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.search = search ? `?next=${encodeURIComponent(pathname + search)}` : `?next=${encodeURIComponent(pathname)}`;
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};