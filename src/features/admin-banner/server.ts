import { unstable_noStore as noStore } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface BannerSettingsRecord {
  id: number | null;
  banner1Url: string;
  banner2Url: string;
  banner3Url: string;
  schemaReady: boolean;
}

function readTextField(settings: Record<string, unknown>, key: string) {
  const value = settings[key];

  return typeof value === "string" ? value : "";
}

export async function getBannerSettings(): Promise<BannerSettingsRecord> {
  noStore();

  const supabase = await createClient();
  const { data } = await supabase
    .from("store_settings")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) {
    return {
      id: null,
      banner1Url: "",
      banner2Url: "",
      banner3Url: "",
      schemaReady: true,
    };
  }

  const settings = data as Record<string, unknown>;
  const schemaReady =
    "banner_1_url" in settings &&
    "banner_2_url" in settings &&
    "banner_3_url" in settings;

  return {
    id: typeof settings.id === "number" ? settings.id : null,
    banner1Url: readTextField(settings, "banner_1_url"),
    banner2Url: readTextField(settings, "banner_2_url"),
    banner3Url: readTextField(settings, "banner_3_url"),
    schemaReady,
  };
}
