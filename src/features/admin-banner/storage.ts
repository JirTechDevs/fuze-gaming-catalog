import sharp from "sharp";
import type { SupabaseClient } from "@supabase/supabase-js";
import { isFileProvided } from "@/features/admin-catalog/storage";
import {
  buildImagePublicUrl,
  deleteR2Object,
  extractManagedObjectKey,
  putR2Object,
} from "@/lib/r2/client";

const MAX_INPUT_FILE_BYTES = 12 * 1024 * 1024;
const MAX_OUTPUT_FILE_BYTES = 5 * 1024 * 1024;
const MAX_IMAGE_WIDTH = 1840;
const WEBP_QUALITY = 82;

function getManagedBannerObjectKey(imagePath: string) {
  const key = extractManagedObjectKey(imagePath);
  if (!key || !key.startsWith("storefront-banners/")) return null;
  return key;
}

async function convertImageToWebp(file: File) {
  if (file.size > MAX_INPUT_FILE_BYTES) {
    throw new Error(
      `Ukuran file ${file.name} terlalu besar. Maksimal upload mentah adalah 12 MB per gambar.`,
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const output = await sharp(buffer)
    .rotate()
    .resize({ width: MAX_IMAGE_WIDTH, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toBuffer();

  if (output.byteLength > MAX_OUTPUT_FILE_BYTES) {
    throw new Error(
      `Ukuran akhir ${file.name} masih terlalu besar setelah dikompres. Coba gunakan gambar yang lebih ringan.`,
    );
  }

  return output;
}

async function deleteManagedBannerImage(imagePath: string | null | undefined) {
  if (!imagePath) return;
  const key = getManagedBannerObjectKey(imagePath);
  if (!key) return;
  await deleteR2Object(key);
}

async function uploadBannerImage(file: File, slot: number) {
  const output = await convertImageToWebp(file);
  const objectKey = `storefront-banners/banner-${slot}.webp`;
  await putR2Object(objectKey, output, "image/webp");
  return buildImagePublicUrl(objectKey);
}

export type PersistBannerImageInput = {
  supabase: SupabaseClient;
  slot: number;
  previousImagePath?: string | null;
  nextImageEntry: FormDataEntryValue | null;
  shouldRemove: boolean;
};

export async function persistBannerImage({
  slot,
  previousImagePath,
  nextImageEntry,
  shouldRemove,
}: PersistBannerImageInput) {
  if (isFileProvided(nextImageEntry)) {
    if (previousImagePath) {
      await deleteManagedBannerImage(previousImagePath);
    }
    return uploadBannerImage(nextImageEntry, slot);
  }

  if (shouldRemove) {
    if (previousImagePath) {
      await deleteManagedBannerImage(previousImagePath);
    }
    return null;
  }

  return previousImagePath ?? null;
}
