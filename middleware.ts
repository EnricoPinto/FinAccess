import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/auth",
    },
  }
);

// Protect all app pages except landing, auth, and public API routes
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/tracker/:path*",
    "/goals/:path*",
    "/loans/:path*",
    "/literacy/:path*",
    "/api/transactions/:path*",
    "/api/goals/:path*",
    "/api/emis/:path*",
    "/api/user/:path*",
  ],
};
