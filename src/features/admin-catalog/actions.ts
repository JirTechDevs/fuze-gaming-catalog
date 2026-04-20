"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { CatalogStatus } from "@/features/admin-catalog/types";
import {
  deleteCatalogImages,
  getMaxGalleryImages,
  isFileProvided,
  persistCatalogImages,
} from "@/features/admin-catalog/storage";
import {
  createActionError,
  createActionSuccess,
  type ActionResult,
} from "@/lib/action-result";

function toText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function toCatalogCode(raw: string) {
  const normalized = raw.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  const withoutPrefix = normalized.replace(/^FZ/, "");

  return withoutPrefix ? `FZ${withoutPrefix}` : "";
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
  _previousState: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const mainImageEntry = formData.get("mainImageFile");
  const mainImageFile = isFileProvided(mainImageEntry) ? mainImageEntry : null;
  const galleryImageFiles = formData
    .getAll("galleryImageFiles")
    .filter(isFileProvided);

  const payload = {
    code: toCatalogCode(toText(formData, "code")),
    rank: toText(formData, "rank"),
    price: Number(formData.get("price") ?? 0),
    skins: toLineList(toText(formData, "skins")),
    region: toText(formData, "region"),
    premier: toText(formData, "premier") || "Can be changed",
    change_nick_status: toText(formData, "changeNickStatus"),
    agent_unlock: toText(formData, "agentUnlock"),
    sisa_vp: toText(formData, "sisaVp") || "-",
    status: toText(formData, "status") as CatalogStatus,
  };
  const mainImageExistingPath = toText(formData, "mainImageExistingPath") || null;
  const existingGalleryImagePaths = toRepeatedText(formData, "existingGalleryImagePaths");

  if (!payload.code || !payload.rank) {
    return createActionError("Kode akun dan rank wajib diisi.");
  }

  if (!Number.isFinite(payload.price) || payload.price < 0) {
    return createActionError("Harga harus berupa angka yang valid.");
  }

  if (!payload.skins.length) {
    return createActionError("Daftar skin minimal harus berisi satu item.");
  }

  if (payload.status !== "available" && payload.status !== "sold") {
    return createActionError("Status jual tidak valid.");
  }

  if (
    payload.change_nick_status !== "Ready" &&
    payload.change_nick_status !== "Not Ready"
  ) {
    return createActionError("Status change nick tidak valid.");
  }

  if (
    payload.premier !== "Can be changed" &&
    payload.premier !== "Cannot be changed"
  ) {
    return createActionError("Status premier tidak valid.");
  }

  if (!mainImageFile && !mainImageExistingPath) {
    return createActionError("Foto Utama (Thumbnail) wajib diisi.");
  }

  if (existingGalleryImagePaths.length + galleryImageFiles.length > getMaxGalleryImages()) {
    return createActionError("Foto tambahan maksimal hanya 5 gambar per catalog.");
  }

  const supabase = await createClient();
  const existingRecord = id
    ? await supabase
        .from("catalog_items")
        .select("id, code, main_image_path, gallery_image_paths")
        .eq("id", id)
        .maybeSingle()
    : null;

  if (existingRecord?.error) {
    return createActionError(`Gagal memuat catalog lama: ${existingRecord.error.message}`);
  }

  const duplicateCodeRecord = await findCatalogByCode(payload.code);

  if (duplicateCodeRecord && duplicateCodeRecord.id !== id) {
    return createActionError("Kode akun sudah dipakai catalog lain. Gunakan kode yang berbeda.");
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
    return createActionError(
      error instanceof Error ? error.message : "Gagal memproses gambar catalog.",
    );
  }

  const query = id
    ? supabase
        .from("catalog_items")
        .update({
          ...payload,
          main_image_path: persistedImages.mainImagePath,
          gallery_image_paths: persistedImages.galleryImagePaths,
        })
        .eq("id", id)
    : supabase.from("catalog_items").insert({
        ...payload,
        main_image_path: persistedImages.mainImagePath,
        gallery_image_paths: persistedImages.galleryImagePaths,
      });

  const { error } = await query;

  if (error) {
    return createActionError(`Gagal menyimpan catalog: ${error.message}`);
  }

  revalidateCatalogAdminPaths();
  return createActionSuccess(
    id ? "Catalog berhasil diperbarui." : "Catalog berhasil ditambahkan.",
    "/dashboard/catalog",
  );
}

export async function toggleCatalogStatusAction(
  id: string,
  currentStatus: CatalogStatus,
  _previousState: ActionResult,
  _formData: FormData,
): Promise<ActionResult> {
  const supabase = await createClient();
  const nextStatus: CatalogStatus = currentStatus === "available" ? "sold" : "available";

  const { error } = await supabase
    .from("catalog_items")
    .update({ status: nextStatus })
    .eq("id", id);

  if (error) {
    return createActionError(`Gagal mengubah status catalog: ${error.message}`);
  }

  revalidateCatalogAdminPaths();
  return createActionSuccess(`Status catalog diubah ke ${nextStatus}.`);
}

export async function deleteCatalogAction(
  id: string,
  _previousState: ActionResult,
  _formData: FormData,
): Promise<ActionResult> {
  const supabase = await createClient();
  const { data: record, error: loadError } = await supabase
    .from("catalog_items")
    .select("main_image_path, gallery_image_paths")
    .eq("id", id)
    .maybeSingle();

  if (loadError) {
    return createActionError(`Gagal memuat catalog sebelum hapus: ${loadError.message}`);
  }

  const { error } = await supabase.from("catalog_items").delete().eq("id", id);

  if (error) {
    return createActionError(`Gagal menghapus catalog: ${error.message}`);
  }

  if (record) {
    try {
      await deleteCatalogImages(supabase, [
        record.main_image_path,
        ...(record.gallery_image_paths ?? []),
      ]);
    } catch (storageError) {
      return createActionError(
        storageError instanceof Error
          ? storageError.message
          : "Catalog sudah dihapus, tapi pembersihan gambar gagal.",
      );
    }
  }

  revalidateCatalogAdminPaths();
  return createActionSuccess("Catalog berhasil dihapus.");
}
