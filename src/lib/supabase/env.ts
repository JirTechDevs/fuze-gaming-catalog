// Direct static references so Next.js can inline NEXT_PUBLIC_* values
// into the client bundle at build time. Do NOT switch these back to a
// dynamic `process.env[name]` lookup — the browser bundle silently
// drops the value and the app crashes on first load.

export function getSupabaseUrl() {
  const value = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!value) {
    throw new Error("Missing environment variable: NEXT_PUBLIC_SUPABASE_URL");
  }
  return value;
}

export function getSupabasePublishableKey() {
  const value = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!value) {
    throw new Error(
      "Missing environment variable: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    );
  }
  return value;
}

export function getSupabaseServiceRoleKey() {
  const value = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!value) {
    throw new Error(
      "Missing environment variable: SUPABASE_SERVICE_ROLE_KEY",
    );
  }
  return value;
}

export function getSheetSyncSecret() {
  const value = process.env.SHEET_SYNC_SECRET;
  if (!value) {
    throw new Error("Missing environment variable: SHEET_SYNC_SECRET");
  }
  return value;
}
