import { after } from "next/server";
import { headers, cookies } from "next/headers";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import { isBotUserAgent } from "@/features/analytics/bot";

const VISITOR_COOKIE = "fvz_sid";
const TRACK_HEADER = "x-fvz-track";
const PATH_HEADER = "x-fvz-path";

export async function trackStorefrontView() {
  let path: string;
  let visitorId: string;

  try {
    const requestHeaders = await headers();
    if (requestHeaders.get(TRACK_HEADER) !== "1") return;

    const userAgent = requestHeaders.get("user-agent") ?? "";
    if (isBotUserAgent(userAgent)) return;

    path = requestHeaders.get(PATH_HEADER) ?? "/";
    visitorId = (await cookies()).get(VISITOR_COOKIE)?.value ?? "";
  } catch {
    return; // build time — no request context
  }

  if (!visitorId) {
    // Middleware stamps the visitor cookie on anonymous storefront requests, so
    // this should not happen for legitimate visitors. Fail safe instead of
    // fabricating an identity from IP/fingerprint.
    console.warn("[storefront-analytics] Missing visitor cookie; skipping tracking.");
    return;
  }

  after(async () => {
    try {
      const supabase = createServiceRoleClient();
      const now = new Date();
      await supabase.from("storefront_views").insert({
        path,
        session_id: visitorId,
        viewed_at: now.toISOString(),
        visited_date: now.toISOString().slice(0, 10),
      });
    } catch (error) {
      // Same visitor on the same UTC day hits the partial unique index; ignore.
      if (isUniqueViolation(error)) return;
      console.error("[storefront-analytics] Failed to persist view:", error);
    }
  });
}

function isUniqueViolation(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    (error as { code?: string }).code === "23505"
  );
}
