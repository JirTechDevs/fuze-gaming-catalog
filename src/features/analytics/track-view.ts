import { after } from "next/server";
import { headers, cookies } from "next/headers";
import { createServiceRoleClient } from "@/lib/supabase/admin";

const BOT_UA = /bot|crawler|spider|crawling|slurp|mediapartners|facebookexternalhit|ia_archiver|wget|curl|python|go-http|axios|libwww|scrapy|semrush|ahrefs|mj12bot|dotbot/i;

export async function trackStorefrontView(path: string) {
  try {
    const ua = (await headers()).get("user-agent") ?? "";
    if (BOT_UA.test(ua)) return;
  } catch {
    return; // build time — no request context
  }

  const sessionId = (await cookies()).get("fvz_sid")?.value ?? null;

  after(async () => {
    try {
      const supabase = createServiceRoleClient();
      await supabase.from("storefront_views").insert({ path, session_id: sessionId });
      // ponytail: unique index on (session_id, viewed_at::date) silently drops duplicate
      // sessions within the same day — 23505 unique_violation is expected, ignored by catch
    } catch {
      // silently skip — build time or duplicate session hit
    }
  });
}
