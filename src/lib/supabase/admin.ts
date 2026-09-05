import "server-only";

import { createClient } from "@supabase/supabase-js";

import { publicEnv, serverEnv } from "@/lib/env";

/**
 * Privileged Supabase client.
 *
 * WARNING: the secret key BYPASSES Row Level Security entirely — exactly as the
 * legacy service_role key did. Every query made through this client sees every
 * row in the database.
 *
 * Use it only where a request genuinely has to act outside a user's own data
 * (admin panel reads, background jobs, anonymous form intake). Anything acting
 * on behalf of a signed-in user belongs in `createSupabaseServerClient`.
 *
 * `import "server-only"` above makes importing this from client code a build
 * error rather than a runtime leak.
 */
export function createSupabaseAdminClient() {
  return createClient(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    serverEnv.SUPABASE_SECRET_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
