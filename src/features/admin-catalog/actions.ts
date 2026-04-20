"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { CatalogFormState, CatalogStatus } from "@/features/admin-catalog/types";
import {
  deleteCatalogImages,
  getMaxGalleryImages,
  isFileProvided,
  persistCatalogImages,
} from "@/features/admin-catalog/storage";

function toText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function toRepeatedText(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .map((value) => String(value).trim())
    .filter(Boolean);
}

function toLineList(raw: string) {
  return raw
    .split("\n")
    .map((value) => value.trim())
    .filter(Boolean);
}

function revalidateCatalogAdminPaths() {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/catalog");
}

async function findCatalogByCode(code: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("catalog_items")
    .select("id")
    .eq("code", code)
    .maybeSingle();

  if (error) {
    throw new Error(`Gagal mengecek kode catalog: ${error.message}`);
  }

  return data;
}

export async function saveCatalogAction(
  id: string | null,
  _previousState: CatalogFormState,
  formData: FormData,
): Promise<CatalogFormState> {
  const mainImageEntry = formData.get("mainImageFile");
  const mainImageFile = isFileProvided(mainImageEntry) ? mainImageEntry : null;
  const galleryImageFiles = formData
    .getAll("galleryImageFiles")
    .filter(isFileProvided);

  const payload = {
    code: toText(formData, "code"),
    rank: toText(formData, "rank"),
    price: Number(formData.get("price") ?? 0),
    skins: toLineList(toText(formData, "skins")),
    region: toText(formData, "region"),
    change_nick_status: toText(formData, "changeNickStatus"),
    agent_unlock: toText(formData, "agentUnlock"),
    sisa_vp: toText(formData, "sisaVp") || "-",
    status: toText(formData, "status") as CatalogStatus,
  };
  const mainImageExistingPath = toText(formData, "mainImageExistingPath") || null;
  const existingGalleryImagePaths = toRepeatedText(formData, "existingGalleryImagePaths");

  if (!payload.code || !payload.rank) {
    return {
      error: "Kode akun dan rank wajib diisi.",
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

  if (!mainImageFile && !mainImageExistingPath) {
    return {
      error: "Foto Utama (Thumbnail) wajib diisi.",
    };
  }

  if (existingGalleryImagePaths.length + galleryImageFiles.length > getMaxGalleryImages()) {
    return {
      error: "Foto tambahan maksimal hanya 5 gambar per catalog.",
    };
  }

  const supabase = await createClient();
  const existingRecord = id
    ? await supabase
        .from("catalog_items")
        .select("id, code, main_image_path, gallery_image_paths, premier")
        .eq("id", id)
        .maybeSingle()
    : null;

  if (existingRecord?.error) {
    return {
      error: `Gagal memuat catalog lama: ${existingRecord.error.message}`,
    };
  }

  const duplicateCodeRecord = await findCatalogByCode(payload.code);

  if (duplicateCodeRecord && duplicateCodeRecord.id !== id) {
    return {
      error: "Kode akun sudah dipakai catalog lain. Gunakan kode yang berbeda.",
    };
  }

  let persistedImages;

  try {
    persistedImages = await persistCatalogImages({
      supabase,
      code: payload.code,
      previousMainImagePath: existingRecord?.data?.main_image_path ?? null,
      previousGalleryImagePaths: existingRecord?.data?.gallery_image_paths ?? [],
      mainImageExistingPath,
      mainImageFile,
      existingGalleryImagePaths,
      galleryImageFiles,
    });
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Gagal memproses gambar catalog.",
    };
  }

  const query = id
    ? supabase
        .from("catalog_items")
        .update({
          ...payload,
          premier: existingRecord?.data?.premier ?? "-",
          main_image_path: persistedImages.mainImagePath,
          gallery_image_paths: persistedImages.galleryImagePaths,
        })
        .eq("id", id)
    : supabase.from("catalog_items").insert({
        ...payload,
        premier: "-",
        main_image_path: persistedImages.mainImagePath,
        gallery_image_paths: persistedImages.galleryImagePaths,
      });

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
  const { data: record, error: loadError } = await supabase
    .from("catalog_items")
    .select("main_image_path, gallery_image_paths")
    .eq("id", id)
    .maybeSingle();

  if (loadError) {
    throw new Error(`Failed to load catalog item before delete: ${loadError.message}`);
  }

  const { error } = await supabase.from("catalog_items").delete().eq("id", id);

  if (error) {
    throw new Error(`Failed to delete catalog item: ${error.message}`);
  }

  if (record) {
    await deleteCatalogImages(supabase, [
      record.main_image_path,
      ...(record.gallery_image_paths ?? []),
    ]);
  }

  revalidateCatalogAdminPaths();
}
