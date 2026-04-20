"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { persistBannerImage } from "@/features/admin-banner/storage";
import {
  createActionError,
  createActionSuccess,
  type ActionResult,
} from "@/lib/action-result";

function isSchemaError(message: string) {
  const normalized = message.toLowerCase();

  return (
    normalized.includes("schema cache") ||
    normalized.includes("column") ||
    normalized.includes("banner_1_url") ||
    normalized.includes("banner_2_url") ||
    normalized.includes("banner_3_url")
  );
}

export async function saveBannerSettingsAction(
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: existingSettings, error: loadError } = await supabase
    .from("store_settings")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (loadError) {
    return createActionError(`Gagal memuat store settings: ${loadError.message}`);
  }

  const existingSettingsRecord = (existingSettings ?? null) as Record<string, unknown> | null;

  let bannerPayload;

  try {
    bannerPayload = {
      banner_1_url: await persistBannerImage({
        supabase,
        slot: 1,
        previousImagePath:
          typeof existingSettingsRecord?.banner_1_url === "string"
            ? existingSettingsRecord.banner_1_url
            : null,
        nextImageEntry: formData.get("banner1File"),
        shouldRemove: formData.get("removeBanner1") === "true",
      }),
      banner_2_url: await persistBannerImage({
        supabase,
        slot: 2,
        previousImagePath:
          typeof existingSettingsRecord?.banner_2_url === "string"
            ? existingSettingsRecord.banner_2_url
            : null,
        nextImageEntry: formData.get("banner2File"),
        shouldRemove: formData.get("removeBanner2") === "true",
      }),
      banner_3_url: await persistBannerImage({
        supabase,
        slot: 3,
        previousImagePath:
          typeof existingSettingsRecord?.banner_3_url === "string"
            ? existingSettingsRecord.banner_3_url
            : null,
        nextImageEntry: formData.get("banner3File"),
        shouldRemove: formData.get("removeBanner3") === "true",
      }),
    };
  } catch (error) {
    return createActionError(
      error instanceof Error ? error.message : "Gagal memproses upload banner.",
    );
  }

  const query = existingSettings
    ? supabase
        .from("store_settings")
        .update(bannerPayload)
        .eq("id", Number(existingSettingsRecord?.id))
    : supabase.from("store_settings").insert({
        whatsapp_number: "",
        ...bannerPayload,
      });

  const { error } = await query;

  if (error) {
    if (isSchemaError(error.message)) {
      return createActionError(
        "Kolom banner di table store_settings belum ada. Jalankan migration supabase/migrations/20260420_add_store_settings_banner_columns.sql dulu.",
      );
    }

    return createActionError(`Gagal menyimpan banner storefront: ${error.message}`);
  }

  revalidatePath("/");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/banner");

  return createActionSuccess("Banner storefront berhasil diperbarui.");
}
