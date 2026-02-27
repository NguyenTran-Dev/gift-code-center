import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production",
);

export async function middleware(request: NextRequest) {
  // Cho phép truy cập /admin (login page) mà không cần token
  // Chỉ protect các sub-routes như /admin/games, /admin/blog, etc.
  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    request.nextUrl.pathname !== "/admin"
  ) {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      // Chuyển về trang login nếu không có token
      const loginUrl = new URL("/admin", request.url);
      return NextResponse.redirect(loginUrl);
    }

    try {
      // Verify JWT token
      await jwtVerify(token, JWT_SECRET);
      return NextResponse.next();
    } catch {
      // Token không hợp lệ, clear cookie và chuyển về login
      const response = NextResponse.redirect(new URL("/admin", request.url));
      response.cookies.delete("auth_token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
