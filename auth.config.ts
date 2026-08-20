import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
    error: "/access-denied",
  },

  callbacks: {
    authorized({
      auth,
      request: { nextUrl },
    }) {
      const isLoggedIn =
        Boolean(auth?.user);

      const isLoginPage =
        nextUrl.pathname === "/login";

      const isAccessDeniedPage =
        nextUrl.pathname ===
        "/access-denied";

      const isAuthRoute =
        nextUrl.pathname.startsWith(
          "/api/auth",
        );

      if (isAuthRoute) {
        return true;
      }

      if (isAccessDeniedPage) {
        return true;
      }

      if (isLoginPage) {
        if (isLoggedIn) {
          return Response.redirect(
            new URL("/", nextUrl),
          );
        }

        return true;
      }

      return isLoggedIn;
    },
  },

  providers: [],
} satisfies NextAuthConfig;