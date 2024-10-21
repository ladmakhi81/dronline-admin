import { NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN } from "./constant/token.constant";
import { jwtDecode } from "jwt-decode";
import { DASHBOARD_URLS } from "./constant/dashboard-urls.constant";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get(ACCESS_TOKEN)?.value;
  if (accessToken) {
    const decodedToken = jwtDecode(accessToken);
    const hasExpTime = (decodedToken.exp ?? 0) * 1000 - new Date().getTime();
    if (hasExpTime) {
      if (request.nextUrl.pathname === "/") {
        return NextResponse.redirect(
          new URL(DASHBOARD_URLS.dashboard, request.url)
        );
      }
      return;
    }
  }
  return NextResponse.redirect(new URL("/auth/sign-in", request.url));
}

export const config = {
  matcher: ["/dashboard/:path*", "/"],
};
