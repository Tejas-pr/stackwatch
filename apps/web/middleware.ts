import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const betterAuthCookie = request.cookies.get("better-auth.session_token");

    // If user is logged in and tries to access auth pages
    if (betterAuthCookie && request.nextUrl.pathname === "/") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // If NOT logged in and tries to access dashboard
    if (!betterAuthCookie && request.nextUrl.pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/dashboard/:path*"],
};
