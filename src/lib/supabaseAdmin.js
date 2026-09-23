import { createClient } from '@supabase/supabase-js';

let client;

/**
 * Privileged Supabase client using the service_role key. Bypasses Row Level
 * Security, so it must only be used in server-side code that has already
 * verified the caller via isAdminAuthenticated().
 *
 * Built lazily so importing this module (e.g. during Next.js build-time
 * route analysis) doesn't require SUPABASE_SERVICE_ROLE_KEY to be present.
 */
function getSupabaseAdmin() {
  if (!client) {
    client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
  }
  return client;
}

export const supabaseAdmin = new Proxy(
  {},
  {
    get(_target, prop) {
      return getSupabaseAdmin()[prop];
    }
  }
);
