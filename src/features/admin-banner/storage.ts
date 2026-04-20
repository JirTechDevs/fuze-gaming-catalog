import sharp from "sharp";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/env";
import { isFileProvided } from "@/features/admin-catalog/storage";

const BANNER_IMAGE_BUCKET = "catalog-images";
const MAX_INPUT_FILE_BYTES = 12 * 1024 * 1024;
const MAX_OUTPUT_FILE_BYTES = 5 * 1024 * 1024;
const MAX_IMAGE_WIDTH = 1840;
const WEBP_QUALITY = 82;

function getBucketPublicPrefix() {
  return `${getSupabaseUrl()}/storage/v1/object/public/${BANNER_IMAGE_BUCKET}/`;
}

function getManagedBannerObjectPath(imagePath: string) {
  const prefix = getBucketPublicPrefix();

  if (!imagePath.startsWith(prefix)) {
    return null;
  }

  const objectPath = decodeURIComponent(imagePath.slice(prefix.length));

  if (!objectPath.startsWith("storefront-banners/")) {
    return null;
  }

  return objectPath;
}

function getPublicBannerImageUrl(supabase: SupabaseClient, objectPath: string) {
  return supabase.storage.from(BANNER_IMAGE_BUCKET).getPublicUrl(objectPath).data.publicUrl;
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
    .resize({
      width: MAX_IMAGE_WIDTH,
      withoutEnlargement: true,
    })
    .webp({
      quality: WEBP_QUALITY,
    })
    .toBuffer();

  if (output.byteLength > MAX_OUTPUT_FILE_BYTES) {
    throw new Error(
      `Ukuran akhir ${file.name} masih terlalu besar setelah dikompres. Coba gunakan gambar yang lebih ringan.`,
    );
  }

  return output;
}

async function deleteManagedBannerImage(
  supabase: SupabaseClient,
  imagePath: string | null | undefined,
) {
  if (!imagePath) {
    return;
  }

  const objectPath = getManagedBannerObjectPath(imagePath);

  if (!objectPath) {
    return;
  }

  const { error } = await supabase.storage.from(BANNER_IMAGE_BUCKET).remove([objectPath]);

  if (error) {
    throw new Error(`Gagal menghapus banner lama: ${error.message}`);
  }
}

async function uploadBannerImage(
  supabase: SupabaseClient,
  file: File,
  slot: number,
) {
  const output = await convertImageToWebp(file);
  const objectPath = `storefront-banners/banner-${slot}.webp`;
  const { error } = await supabase.storage
    .from(BANNER_IMAGE_BUCKET)
    .upload(objectPath, output, {
      contentType: "image/webp",
      upsert: true,
    });

  if (error) {
    throw new Error(`Gagal upload banner ${slot}: ${error.message}`);
  }

  return getPublicBannerImageUrl(supabase, objectPath);
}

export type PersistBannerImageInput = {
  supabase: SupabaseClient;
  slot: number;
  previousImagePath?: string | null;
  nextImageEntry: FormDataEntryValue | null;
  shouldRemove: boolean;
};

export async function persistBannerImage({
  supabase,
  slot,
  previousImagePath,
  nextImageEntry,
  shouldRemove,
}: PersistBannerImageInput) {
  if (isFileProvided(nextImageEntry)) {
    if (previousImagePath) {
      await deleteManagedBannerImage(supabase, previousImagePath);
    }

    return uploadBannerImage(supabase, nextImageEntry, slot);
  }

  if (shouldRemove) {
    if (previousImagePath) {
      await deleteManagedBannerImage(supabase, previousImagePath);
    }

    return null;
  }

  return previousImagePath ?? null;
}
