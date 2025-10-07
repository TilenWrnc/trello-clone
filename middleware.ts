import { NextRequest, NextResponse } from "next/server";
import { auth } from "./utils/auth";

export const runtime = "nodejs";

const protectedRoutes = [
  "/dashboard",        
  "/dashboard/:path*", 
];

export async function middleware(req: NextRequest) {
    const { nextUrl } = req;

    const session = await auth.api.getSession({ headers: req.headers });
    const isLoggedIn = !!session;

    const isOnProtectedRoute = protectedRoutes.some(route =>
      nextUrl.pathname.startsWith(route.replace(":path*", ""))
    );

    const isOnAuthRoute = nextUrl.pathname.startsWith("/sign-in") || nextUrl.pathname.startsWith("/sign-up") || nextUrl.pathname === "/";

    if (isOnProtectedRoute && !isLoggedIn) {
        return NextResponse.redirect(new URL("/sign/in", req.url));
    };

    if (isOnAuthRoute && isLoggedIn) {
        return NextResponse.redirect(new URL("/dashboard", req.url))
    };

    return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard", 
    "/dashboard/:path*", 
    "/sign-in", 
    "/sign-up"
  ],
};