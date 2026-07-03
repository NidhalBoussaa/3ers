import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// Singleton pool + drizzle instance — prevents connection leaks under HMR.
const globalForDb = globalThis as unknown as {
  _pool?: Pool;
  _db?: ReturnType<typeof drizzle<typeof schema>>;
};

function getDb(): ReturnType<typeof drizzle<typeof schema>> {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  if (!globalForDb._pool) {
    globalForDb._pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      // No search_path override: self-hosted Postgres (infra/postgres/init.sql)
      // creates every table in the default "public" schema, which is already
      // first in Postgres's default search_path. (A "platform" schema
      // override was needed on the old Neon setup; this DB has no such
      // schema, so setting it caused every query to fail with
      // `relation "orders" does not exist`.)
    });
  }
  if (!globalForDb._db) {
    globalForDb._db = drizzle(globalForDb._pool, { schema });
  }
  return globalForDb._db;
}

// Lazy proxy so the module can be imported at build time without DATABASE_URL.
export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_, prop) {
    return getDb()[prop as keyof ReturnType<typeof drizzle<typeof schema>>];
  },
});

export type Db = ReturnType<typeof drizzle<typeof schema>>;
