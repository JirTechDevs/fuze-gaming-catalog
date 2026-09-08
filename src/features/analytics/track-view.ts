import { after } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/admin";

export function trackStorefrontView(path: string) {
  after(async () => {
    try {
      const supabase = createServiceRoleClient();
      await supabase.from("storefront_views").insert({ path });
    } catch {
      // ponytail: silently skip — service role key not available at build/test time
    }
  });
}
