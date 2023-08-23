import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { getAuth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/nextjs/middleware for more information about configuring your middleware
export default authMiddleware({
  publicRoutes: ["/", "/auth/sign-in", "/auth/sign-up", "/api/new-user"],
  afterAuth(auth, req) {
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }
    console.log("1");
    console.log(auth.user?.id);
    console.log("2");

    if (
      auth.user?.publicMetadata.isSubscribed === false &&
      auth.user?.publicMetadata.plan === "noSubscription"
    ) {
      const subscribtionUrl = new URL("/subscription", req.url);
      return NextResponse.redirect(subscribtionUrl);
    }
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/(api|trpc)(.*)"],
};
