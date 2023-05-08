import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      if (req.nextUrl.pathname.includes("/dashboard/admin")) {
        return token?.role === "admin";
      }
      return !!token;
    },
  },
});

export const config = {
  matcher: [
    "/dashboard/admin/:path*",
    "/dashboard/home/:path*",
    "/dashboard/patients/:path*",
    "/dashboard/report/:path*",
  ],
};
