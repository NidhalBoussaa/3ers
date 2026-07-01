# Auth Strategy

---

## Two user types

| Type | App | Method | Role in DB |
|---|---|---|---|
| Admin | `apps/admin` | Email + password | `admin` |
| Client (couple) | `apps/portal` | Magic link (email) | `client` |

Both stored in the same `users` table. Role field enforces access.

---

## Library

**NextAuth.js v5** (Auth.js) — configured per-app since admin and portal have different providers and session requirements.

Each app has its own `auth.ts` config.

---

## Admin auth (`apps/admin`)

Provider: `Credentials`

```ts
// apps/admin/src/auth.ts
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { db } from '@3ers/db'
import { users } from '@3ers/db/schema'
import { eq } from 'drizzle-orm'
import bcrypt from 'bcryptjs'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
      async authorize({ email, password }) {
        const user = await db.select().from(users)
          .where(eq(users.email, email as string)).then(r => r[0])
        if (!user || user.role !== 'admin') return null
        const ok = await bcrypt.compare(password as string, user.password!)
        return ok ? user : null
      }
    })
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = (user as any).role
      return token
    },
    session({ session, token }) {
      session.user.role = token.role as string
      return session
    }
  },
  pages: { signIn: '/admin/login' }
})
```

Middleware in `apps/admin/src/middleware.ts` protects all `/admin/**` routes.

---

## Client auth (`apps/portal`)

Provider: `Resend` (magic link via email)

```ts
// apps/portal/src/auth.ts
import NextAuth from 'next-auth'
import Resend from 'next-auth/providers/resend'
import { db } from '@3ers/db'
import { users } from '@3ers/db/schema'
import { eq } from 'drizzle-orm'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.RESEND_FROM,
    })
  ],
  callbacks: {
    async signIn({ user }) {
      // Only allow users that already exist in DB with role 'client'
      const existing = await db.select().from(users)
        .where(eq(users.email, user.email!)).then(r => r[0])
      return !!existing && existing.role === 'client'
    },
    session({ session, token }) {
      session.user.role = 'client'
      return session
    }
  },
  pages: {
    signIn: '/portal/login',
    verifyRequest: '/portal/login/verify',
    error: '/portal/login',
  }
})
```

Admin creates the client account in the `users` table when an order is confirmed — then the couple can log in via magic link.

Middleware in `apps/portal/src/middleware.ts` protects all `/portal/**` except `/portal/login` and `/portal/login/verify`.

---

## Session data

Both apps extend the NextAuth session type:

```ts
// packages/config/src/next-auth.d.ts
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      role: 'admin' | 'client'
    }
  }
}
```

---

## Security notes

- Admin password hashed with bcrypt (12 rounds), never stored plain
- Magic link tokens are single-use, 10-minute expiry (NextAuth default)
- All API routes check session role before returning data
- Client API routes additionally check that the requested `orderId` belongs to the authenticated client — no cross-order access
- NEXTAUTH_SECRET must be a strong random value (32+ chars), different per environment
