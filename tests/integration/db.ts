/**
 * Test database helpers. Each test file gets a fresh database with the Supabase shim and
 * every migration applied, then runs queries as anon / authenticated / service_role with
 * the JWT claims Supabase would set.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import pg from "pg";

const ROOT = join(__dirname, "..", "..");

export function adminUrl(): string {
  const url = process.env.TEST_DATABASE_URL;
  if (!url) {
    throw new Error(
      "TEST_DATABASE_URL is not set. Run: export TEST_DATABASE_URL=$(scripts/local-postgres.sh start)",
    );
  }
  return url;
}

export async function createTestDatabase(): Promise<{ pool: pg.Pool; drop: () => Promise<void> }> {
  const admin = new pg.Client({ connectionString: adminUrl() });
  await admin.connect();
  const name = `lcs_test_${randomUUID().replace(/-/g, "").slice(0, 12)}`;
  await admin.query(`create database ${name}`);
  await admin.end();

  const url = new URL(adminUrl());
  url.pathname = `/${name}`;
  const pool = new pg.Pool({ connectionString: url.toString(), max: 4 });

  // Roles are cluster-wide; the shim creates them only if missing.
  await pool.query(readFileSync(join(ROOT, "supabase/tests/supabase-shim.sql"), "utf8"));
  const dir = join(ROOT, "supabase/migrations");
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".sql")).sort()) {
    await pool.query(readFileSync(join(dir, file), "utf8"));
  }

  return {
    pool,
    drop: async () => {
      await pool.end();
      const c = new pg.Client({ connectionString: adminUrl() });
      await c.connect();
      await c.query(`drop database if exists ${name} with (force)`);
      await c.end();
    },
  };
}

export type As =
  | { role: "anon" }
  | { role: "service_role" }
  | { role: "authenticated"; sub: string; aal?: "aal1" | "aal2" };

/**
 * Runs `fn` inside a transaction as the given role, then rolls back, so tests never leak
 * state into each other. Errors from `fn` (e.g. RLS violations) propagate.
 */
export async function asRole<T>(pool: pg.Pool, as: As, fn: (c: pg.PoolClient) => Promise<T>): Promise<T> {
  const c = await pool.connect();
  try {
    await c.query("begin");
    const claims =
      as.role === "authenticated"
        ? { sub: as.sub, role: "authenticated", aal: as.aal ?? "aal1" }
        : { role: as.role };
    await c.query("select set_config('request.jwt.claims', $1, true)", [JSON.stringify(claims)]);
    await c.query(`set local role ${as.role}`);
    return await fn(c);
  } finally {
    await c.query("rollback").catch(() => {});
    c.release();
  }
}

/** Like asRole but commits: used to seed fixtures as the service role. */
export async function seed(pool: pg.Pool, sql: string, params: unknown[] = []) {
  return pool.query(sql, params);
}
