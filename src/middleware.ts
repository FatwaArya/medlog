import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/auth/sign-in",
    "/auth/sign-up",
    "/api/new-user",
    "/api/recurring",
  ],
  afterAuth(auth, req) {
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }
    console.log(auth.sessionClaims);
    if (
      auth.sessionClaims?.isSubscribed === false &&
      auth.sessionClaims?.plan === "noSubscription" &&
      req.nextUrl.pathname !== "/subscription"
    ) {
      const subscribtionUrl = new URL("/subscription", req.url);
      console.log("hit");
      return NextResponse.redirect(subscribtionUrl);
    }

    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/(api|trpc)(.*)"],
};
