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
    console.log(auth);
    if (!auth.userId && !auth.isPublicRoute) {
      return redirectToSignIn({ returnBackUrl: req.url });
    }

    if (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      !auth.sessionClaims?.publicMetadata.isSubscribed &&
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      auth.sessionClaims?.publicMetadata.plan === "noSubscription" &&
      req.nextUrl.pathname !== "/subscription"
    ) {
      const subscribtionUrl = new URL("/subscription", req.url);
      console.log(subscribtionUrl);
      return NextResponse.redirect(subscribtionUrl);
    }

    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/(api|trpc)(.*)"],
};
