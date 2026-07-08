import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/login", "/register"];

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (publicRoutes.includes(pathname) && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!publicRoutes.includes(pathname) && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
