import { NextResponse, type NextRequest } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import { getJakartaDateKey } from "@/features/analytics/time";
import {
  ADMIN_DEVICE_COOKIE,
  VISITOR_COOKIE,
  shouldCountVisit,
} from "@/features/analytics/track-visit";

// Lives under /api/public so middleware skips it: fvz_sid must come from the
// browser, never be minted for this request.
export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const signal = {
    visitorId: request.cookies.get(VISITOR_COOKIE)?.value,
    isAdminDevice: request.cookies.has(ADMIN_DEVICE_COOKIE),
    fetchSite: request.headers.get("sec-fetch-site"),
    userAgent: request.headers.get("user-agent") ?? "",
    path: body?.path,
  };

  if (!shouldCountVisit(signal)) return new NextResponse(null, { status: 204 });

  const now = new Date();
  const { error } = await createServiceRoleClient().from("storefront_views").insert({
    path: signal.path,
    session_id: signal.visitorId,
    user_agent: signal.userAgent.slice(0, 512),
    viewed_at: now.toISOString(),
    visited_date: getJakartaDateKey(now),
  });

  // 23505: visitor already counted today (unique session_id + visited_date).
  if (error && error.code !== "23505") {
    console.error("[storefront-analytics] Failed to persist visit:", error);
  }

  return new NextResponse(null, { status: 204 });
}
