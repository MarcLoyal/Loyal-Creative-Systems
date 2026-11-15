/**
 * Typed access to environment variables. Each getter throws a clear error naming the
 * missing variable, at the moment a feature needs it, so pages that don't use a service
 * still build and run without its keys. See .env.example for the full list.
 */
function required(name: string, value: string | undefined): string {
  if (!value) throw new Error(`Missing environment variable ${name}. See .env.example.`);
  return value;
}

/** Safe for the browser (NEXT_PUBLIC_*). */
export const env = {
  supabase: () => ({
    url: required("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL),
    anonKey: required("NEXT_PUBLIC_SUPABASE_ANON_KEY", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  }),
};

/** Server only. Never reference these from client components. */
export const serverEnv = {
  supabaseServiceRoleKey: () => required("SUPABASE_SERVICE_ROLE_KEY", process.env.SUPABASE_SERVICE_ROLE_KEY),
};
