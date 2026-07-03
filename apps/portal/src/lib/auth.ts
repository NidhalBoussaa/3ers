import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { db } from "@3ers/db/client";
import { users } from "@3ers/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.PORTAL_NEXTAUTH_SECRET,
  // Required behind a reverse proxy (nginx terminates TLS and forwards to
  // this container on a different host/port) — without it Auth.js rejects
  // every request with "UntrustedHost", even from the real public domain.
  // Safe here: nginx is the only public entry point (apps bind to
  // 127.0.0.1 only), so the Host header nginx forwards is always genuine.
  trustHost: true,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      async authorize(raw) {
        const parsed = loginSchema.safeParse(raw);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, email))
          .limit(1);

        if (!user || !user.password || user.role !== "client") return null;

        const valid = await compare(password, user.password);
        if (!valid) return null;

        return { id: user.id, email: user.email, role: user.role as "admin" | "client" };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as "admin" | "client";
      }
      return session;
    },
  },
});
