import { NextRequest, NextResponse } from "next/server";
// import { verifyToken } from './libs/server/auth';

const isLoginRoute = (pathname: string) => {
  return (
    pathname.startsWith("/api/login") ||
    pathname.startsWith("/api/trpc/auth.login")
  );
};

const isExcludedRoute = (pathname: string) => {
  // 排除 /api/trpc/* 路徑, trpc 有自己的 middleware
  return pathname.startsWith("/api/trpc/");
};

// This function can be marked `async` if using `await` inside
export async function middleware(req: NextRequest) {
  const res = new NextResponse();
  const { pathname } = req.nextUrl;
  if (isLoginRoute(pathname) || isExcludedRoute(pathname)) {
    return NextResponse.rewrite(req.nextUrl);
  }

  if (!["POST", "PATCH", "DELETE", "OPTIONS"].includes(req.method)) {
    return NextResponse.rewrite(req.nextUrl);
  }
  // login r}outes are public
  // GET method are public, limit are applyed in the each api routes

  const auth_str = req.headers.get("authorization");

  if (auth_str === null) {
    return new NextResponse(
      JSON.stringify({ error: { message: "authentication required" } }),
      { status: 401 }
    );
  }

  const [auth_header, token] = auth_str!.split(" ");
  if (auth_header != "Bearer") {
    return new NextResponse(
      JSON.stringify({ error: { message: "authentication required" } }),
      { status: 401 }
    );
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/api/:path*"],
};
