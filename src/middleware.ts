import { NextRequest, NextResponse } from "next/server";
import { ACCESS_TOKEN } from "./constant/token.constant";
import { jwtDecode } from "jwt-decode";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get(ACCESS_TOKEN)?.value;
  if (accessToken) {
    const decodedToken = jwtDecode(accessToken);
    const hasExpTime = (decodedToken.exp ?? 0) * 1000 - new Date().getTime();
    if (hasExpTime) {
      console.log("user logged in");
      return;
    }
  }
  return NextResponse.redirect(new URL("/auth/sign-in", request.url));
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
