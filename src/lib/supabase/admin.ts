import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getSupabaseServiceRoleKey, getSupabaseUrl } from "@/lib/supabase/env";

/**
 * Service-role Supabase client that bypasses RLS.
 *
 * DO NOT expose this client to the browser or import it from client
 * components. Use only in server routes / server actions that have
 * already authenticated the caller (e.g. via a shared secret, admin
 * session, or webhook signature).
 */
export function createServiceRoleClient() {
  return createSupabaseClient(getSupabaseUrl(), getSupabaseServiceRoleKey(), {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
