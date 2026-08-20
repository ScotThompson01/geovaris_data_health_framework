import NextAuth from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";

import { authConfig } from "./auth.config";

function getAuthorizedEmails() {
  return (
    process.env.GDHF_AUTHORIZED_EMAILS ??
    ""
  )
    .split(",")
    .map(
      (email) =>
        email.trim().toLowerCase(),
    )
    .filter(Boolean);
}

export const {
  auth,
  handlers,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,

  providers: [
    MicrosoftEntraID({
      clientId:
        process.env.AUTH_MICROSOFT_ENTRA_ID_ID,

      clientSecret:
        process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,

      issuer:
        process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER,
    }),
  ],

  callbacks: {
    ...authConfig.callbacks,

    async signIn({
      user,
    }) {
      const email =
        user.email
          ?.trim()
          .toLowerCase();

      if (!email) {
        return false;
      }

      const authorizedEmails =
        getAuthorizedEmails();

      return authorizedEmails.includes(
        email,
      );
    },
  },
});