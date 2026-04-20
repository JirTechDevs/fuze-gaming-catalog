import sharp from "sharp";
import type { SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "@/lib/supabase/env";

const CATALOG_IMAGE_BUCKET = "catalog-images";
const MAX_INPUT_FILE_BYTES = 12 * 1024 * 1024;
const MAX_OUTPUT_FILE_BYTES = 5 * 1024 * 1024;
const MAX_GALLERY_IMAGES = 5;
const MAX_IMAGE_WIDTH = 1600;
const WEBP_QUALITY = 82;

type CatalogImageSource =
  | {
      kind: "existing";
      path: string;
    }
  | {
      kind: "upload";
      file: File;
    };

export type PersistCatalogImagesInput = {
  supabase: SupabaseClient;
  code: string;
  previousMainImagePath?: string | null;
  previousGalleryImagePaths?: string[];
  mainImageExistingPath?: string | null;
  mainImageFile?: File | null;
  existingGalleryImagePaths: string[];
  galleryImageFiles: File[];
};

export type PersistCatalogImagesResult = {
  mainImagePath: string;
  galleryImagePaths: string[];
};

export function getMaxGalleryImages() {
  return MAX_GALLERY_IMAGES;
}

export function isFileProvided(value: FormDataEntryValue | null): value is File {
  return value instanceof File && value.size > 0;
}

export function sanitizeCatalogCode(code: string) {
  const normalized = code.toUpperCase().replace(/[^A-Z0-9]/g, "");

  return normalized || "CATALOG";
}

export function buildCatalogImageObjectPath(code: string, imageNumber: number) {
  return `${sanitizeCatalogCode(code)}IMG${imageNumber}.webp`;
}

function getBucketPublicPrefix() {
  return `${getSupabaseUrl()}/storage/v1/object/public/${CATALOG_IMAGE_BUCKET}/`;
}

export function getManagedCatalogImageObjectPath(imagePath: string) {
  const prefix = getBucketPublicPrefix();

  if (!imagePath.startsWith(prefix)) {
    return null;
  }

  return decodeURIComponent(imagePath.slice(prefix.length));
}

function isManagedCatalogImage(imagePath: string) {
  return Boolean(getManagedCatalogImageObjectPath(imagePath));
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

function getPublicCatalogImageUrl(supabase: SupabaseClient, objectPath: string) {
  return supabase.storage.from(CATALOG_IMAGE_BUCKET).getPublicUrl(objectPath).data.publicUrl;
}

async function deleteManagedCatalogImages(supabase: SupabaseClient, imagePaths: string[]) {
  const objectPaths = imagePaths
    .map(getManagedCatalogImageObjectPath)
    .filter((value): value is string => Boolean(value));

  if (!objectPaths.length) {
    return;
  }

  const { error } = await supabase.storage.from(CATALOG_IMAGE_BUCKET).remove(objectPaths);

  if (error) {
    throw new Error(`Gagal menghapus gambar lama: ${error.message}`);
  }
}

async function moveManagedCatalogImage(
  supabase: SupabaseClient,
  currentImagePath: string,
  targetObjectPath: string,
) {
  const currentObjectPath = getManagedCatalogImageObjectPath(currentImagePath);

  if (!currentObjectPath) {
    return currentImagePath;
  }

  if (currentObjectPath === targetObjectPath) {
    return currentImagePath;
  }

  const { error } = await supabase.storage
    .from(CATALOG_IMAGE_BUCKET)
    .move(currentObjectPath, targetObjectPath);

  if (error) {
    throw new Error(`Gagal merapikan nama gambar: ${error.message}`);
  }

  return getPublicCatalogImageUrl(supabase, targetObjectPath);
}

async function uploadCatalogImage(
  supabase: SupabaseClient,
  file: File,
  targetObjectPath: string,
) {
  const output = await convertImageToWebp(file);

  const { error } = await supabase.storage
    .from(CATALOG_IMAGE_BUCKET)
    .upload(targetObjectPath, output, {
      contentType: "image/webp",
      upsert: true,
    });

  if (error) {
    throw new Error(`Gagal upload gambar ${file.name}: ${error.message}`);
  }

  return getPublicCatalogImageUrl(supabase, targetObjectPath);
}

async function resolveCatalogImageSource(
  supabase: SupabaseClient,
  code: string,
  imageNumber: number,
  source: CatalogImageSource,
) {
  const targetObjectPath = buildCatalogImageObjectPath(code, imageNumber);

  if (source.kind === "upload") {
    return uploadCatalogImage(supabase, source.file, targetObjectPath);
  }

  if (!isManagedCatalogImage(source.path)) {
    return source.path;
  }

  return moveManagedCatalogImage(supabase, source.path, targetObjectPath);
}

export async function persistCatalogImages({
  supabase,
  code,
  previousMainImagePath,
  previousGalleryImagePaths = [],
  mainImageExistingPath,
  mainImageFile,
  existingGalleryImagePaths,
  galleryImageFiles,
}: PersistCatalogImagesInput): Promise<PersistCatalogImagesResult> {
  if (existingGalleryImagePaths.length + galleryImageFiles.length > MAX_GALLERY_IMAGES) {
    throw new Error("Foto tambahan maksimal hanya 5 gambar per catalog.");
  }

  const retainedImages = new Set(
    [mainImageExistingPath, ...existingGalleryImagePaths].filter(Boolean) as string[],
  );
  const previousImages = [previousMainImagePath, ...previousGalleryImagePaths].filter(
    Boolean,
  ) as string[];
  const removedImages = previousImages.filter((imagePath) => !retainedImages.has(imagePath));

  if (removedImages.length) {
    await deleteManagedCatalogImages(supabase, removedImages);
  }

  const mainSource: CatalogImageSource | null = mainImageFile
    ? { kind: "upload", file: mainImageFile }
    : mainImageExistingPath
      ? { kind: "existing", path: mainImageExistingPath }
      : null;

  if (!mainSource) {
    throw new Error("Foto Utama (Thumbnail) wajib diisi.");
  }

  const mainImagePath = await resolveCatalogImageSource(supabase, code, 1, mainSource);

  const gallerySources: CatalogImageSource[] = [
    ...existingGalleryImagePaths.map((path) => ({
      kind: "existing" as const,
      path,
    })),
    ...galleryImageFiles.map((file) => ({
      kind: "upload" as const,
      file,
    })),
  ];

  const galleryImagePaths: string[] = [];

  for (const [index, source] of gallerySources.entries()) {
    const imagePath = await resolveCatalogImageSource(supabase, code, index + 2, source);
    galleryImagePaths.push(imagePath);
  }

  return {
    mainImagePath,
    galleryImagePaths,
  };
}

export async function deleteCatalogImages(
  supabase: SupabaseClient,
  imagePaths: string[],
) {
  await deleteManagedCatalogImages(supabase, imagePaths);
}
