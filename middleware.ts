import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isDashboard = pathname.startsWith("/dashboard");

  if (!session && isDashboard) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (session && isAuthRoute) {
    const role = session.user.role;
    const dashboardMap: Record<string, string> = {
      VENDEDOR: "/dashboard/vendedor",
      FORNECEDOR: "/dashboard/fornecedor",
      ADMIN: "/dashboard/admin",
    };
    return NextResponse.redirect(new URL(dashboardMap[role] || "/dashboard/vendedor", request.url));
  }

  if (session && isDashboard) {
    const role = session.user.role;

    if (pathname.startsWith("/dashboard/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard/vendedor", request.url));
    }

    if (pathname.startsWith("/dashboard/fornecedor") && role === "VENDEDOR") {
      return NextResponse.redirect(new URL("/dashboard/vendedor", request.url));
    }

    if (pathname.startsWith("/dashboard/vendedor") && role === "FORNECEDOR") {
      return NextResponse.redirect(new URL("/dashboard/fornecedor", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
