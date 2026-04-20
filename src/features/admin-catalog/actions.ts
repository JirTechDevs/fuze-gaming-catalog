"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { CatalogFormState, CatalogStatus } from "@/features/admin-catalog/types";

function toText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function toList(raw: string) {
  return raw
    .split("\n")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function revalidateCatalogAdminPaths() {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/catalog");
}

export async function saveCatalogAction(
  id: string | null,
  _previousState: CatalogFormState,
  formData: FormData,
): Promise<CatalogFormState> {
  const payload = {
    code: toText(formData, "code"),
    main_image_path: toText(formData, "mainImagePath"),
    gallery_image_paths: toList(toText(formData, "galleryImagePaths")),
    rank: toText(formData, "rank"),
    price: Number(formData.get("price") ?? 0),
    skins: toList(toText(formData, "skins")),
    region: toText(formData, "region"),
    change_nick_status: toText(formData, "changeNickStatus"),
    agent_unlock: toText(formData, "agentUnlock"),
    sisa_vp: toText(formData, "sisaVp") || "-",
    premier: toText(formData, "premier") || "-",
    status: toText(formData, "status") as CatalogStatus,
  };

  if (!payload.code || !payload.main_image_path || !payload.rank) {
    return {
      error: "Kode akun, foto utama, dan rank wajib diisi.",
    };
  }

  if (!Number.isFinite(payload.price) || payload.price < 0) {
    return {
      error: "Harga harus berupa angka yang valid.",
    };
  }

  if (!payload.skins.length) {
    return {
      error: "Daftar skin minimal harus berisi satu item.",
    };
  }

  if (payload.status !== "available" && payload.status !== "sold") {
    return {
      error: "Status jual tidak valid.",
    };
  }

  if (
    payload.change_nick_status !== "Ready" &&
    payload.change_nick_status !== "Not Ready"
  ) {
    return {
      error: "Status change nick tidak valid.",
    };
  }

  const supabase = await createClient();
  const query = id
    ? supabase.from("catalog_items").update(payload).eq("id", id)
    : supabase.from("catalog_items").insert(payload);

  const { error } = await query;

  if (error) {
    return {
      error: `Gagal menyimpan catalog: ${error.message}`,
    };
  }

  revalidateCatalogAdminPaths();
  redirect("/dashboard/catalog");
}

export async function toggleCatalogStatusAction(id: string, currentStatus: CatalogStatus) {
  const supabase = await createClient();
  const nextStatus: CatalogStatus = currentStatus === "available" ? "sold" : "available";

  const { error } = await supabase
    .from("catalog_items")
    .update({ status: nextStatus })
    .eq("id", id);

  if (error) {
    throw new Error(`Failed to toggle catalog status: ${error.message}`);
  }

  revalidateCatalogAdminPaths();
}

export async function deleteCatalogAction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("catalog_items").delete().eq("id", id);

  if (error) {
    throw new Error(`Failed to delete catalog item: ${error.message}`);
  }

  revalidateCatalogAdminPaths();
}
