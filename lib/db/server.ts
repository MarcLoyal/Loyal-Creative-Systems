import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { env, serverEnv } from "@/lib/env";

/**
 * Supabase client acting as the signed-in user (portal, admin). Row-level security applies.
 * Use in Server Components, Server Functions and Route Handlers.
 */
export async function createUserClient() {
  const cookieStore = await cookies();
  const { url, anonKey } = env.supabase();
  return createServerClient(url, anonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        try {
          for (const { name, value, options } of toSet) cookieStore.set(name, value, options);
        } catch {
          // Called from a Server Component, where cookies are read-only. Session refresh
          // happens in Route Handlers and Server Functions instead.
        }
      },
    },
  });
}

/**
 * Service-role client: bypasses row-level security. Server code and background jobs only
 * (SPEC 23.1). Never import this from a Client Component; `server-only` enforces that.
 */
export function createServiceClient() {
  const { url } = env.supabase();
  return createClient(url, serverEnv.supabaseServiceRoleKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
