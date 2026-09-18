import NextAuth from "next-auth";
import type { Provider } from "next-auth/providers";
import Google from "next-auth/providers/google";
import Facebook from "next-auth/providers/facebook";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import {
  createUser,
  findAccount,
  findUserByEmail,
  findUserByEmailOrName,
  linkAccount,
} from "./lib/mongodb";

const providers: Provider[] = [
  Credentials({
    name: "Email or Username",
    credentials: {
      email: { label: "Email or Username", type: "text" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const identifier = String(credentials?.email || "").trim();
      const password = String(credentials?.password || "");
      if (!identifier || !password) return null;

      const user = await findUserByEmailOrName(identifier);
      if (!user?.passwordHash) return null;
      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) return null;

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
      };
    },
  }),
];

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  );
}

if (process.env.AUTH_FACEBOOK_ID && process.env.AUTH_FACEBOOK_SECRET) {
  providers.push(
    Facebook({
      clientId: process.env.AUTH_FACEBOOK_ID,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET,
    }),
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/study",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!account || account.provider === "credentials") return true;
      if (!user.email) return false;

      const existingAccount = await findAccount(
        account.provider,
        account.providerAccountId,
      );
      if (existingAccount) {
        user.id = existingAccount.userId;
        return true;
      }

      let dbUser = await findUserByEmail(user.email);
      if (!dbUser) {
        await createUser({
          id: randomUUID(),
          email: user.email,
          name: user.name,
          image: user.image,
          provider: account.provider,
        });
        dbUser = await findUserByEmail(user.email);
      }

      if (!dbUser) return false;

      await linkAccount({
        id: randomUUID(),
        userId: dbUser.id,
        provider: account.provider,
        providerAccountId: account.providerAccountId,
      });
      user.id = dbUser.id;
      return true;
    },
    async jwt({ token, user }) {
      if (user?.id) token.sub = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) session.user.id = token.sub;
      return session;
    },
  },
  trustHost: true,
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
});
