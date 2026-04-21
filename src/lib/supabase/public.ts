import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getSupabasePublishableKey, getSupabaseUrl } from "@/lib/supabase/env";

/**
 * A lightweight Supabase client that does NOT depend on cookies.
 * Use this for public data fetches that should be cached with unstable_cache.
 * Do NOT use this for auth-related operations.
 */
export function createPublicClient() {
  return createSupabaseClient(getSupabaseUrl(), getSupabasePublishableKey());
}
