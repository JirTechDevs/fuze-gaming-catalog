import sharp from "sharp";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  buildImagePublicUrl,
  deleteR2Objects,
  extractManagedObjectKey,
  moveR2Object,
  putR2Object,
} from "@/lib/r2/client";

const MAX_INPUT_FILE_BYTES = 12 * 1024 * 1024;
const MAX_OUTPUT_FILE_BYTES = 5 * 1024 * 1024;
const MAX_GALLERY_IMAGES = 5;
const MAX_IMAGE_WIDTH = 1600;
const WEBP_QUALITY = 82;

type CatalogImageSource =
  | { kind: "existing"; path: string }
  | { kind: "upload"; file: File };

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

export function getManagedCatalogImageObjectPath(imagePath: string) {
  return extractManagedObjectKey(imagePath);
}

function isManagedCatalogImage(imagePath: string) {
  return Boolean(extractManagedObjectKey(imagePath));
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

async function deleteManagedCatalogImages(imagePaths: string[]) {
  const keys = imagePaths
    .map(extractManagedObjectKey)
    .filter((value): value is string => Boolean(value));
  if (!keys.length) return;
  await deleteR2Objects(keys);
}

async function moveManagedCatalogImage(currentImagePath: string, targetObjectKey: string) {
  const currentKey = extractManagedObjectKey(currentImagePath);
  if (!currentKey) return currentImagePath;
  if (currentKey === targetObjectKey) return currentImagePath;

  await moveR2Object(currentKey, targetObjectKey);
  return buildImagePublicUrl(targetObjectKey);
}

async function uploadCatalogImage(file: File, targetObjectKey: string) {
  const output = await convertImageToWebp(file);
  await putR2Object(targetObjectKey, output, "image/webp");
  return buildImagePublicUrl(targetObjectKey);
}

async function resolveCatalogImageSource(
  code: string,
  imageNumber: number,
  source: CatalogImageSource,
) {
  const targetObjectKey = buildCatalogImageObjectPath(code, imageNumber);

  if (source.kind === "upload") {
    return uploadCatalogImage(source.file, targetObjectKey);
  }

  if (!isManagedCatalogImage(source.path)) {
    return source.path;
  }

  return moveManagedCatalogImage(source.path, targetObjectKey);
}

export async function persistCatalogImages({
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
    await deleteManagedCatalogImages(removedImages);
  }

  const mainSource: CatalogImageSource | null = mainImageFile
    ? { kind: "upload", file: mainImageFile }
    : mainImageExistingPath
      ? { kind: "existing", path: mainImageExistingPath }
      : null;

  if (!mainSource) {
    throw new Error("Foto Utama (Thumbnail) wajib diisi.");
  }

  const mainImagePath = await resolveCatalogImageSource(code, 1, mainSource);

  const gallerySources: CatalogImageSource[] = [
    ...existingGalleryImagePaths.map((path) => ({ kind: "existing" as const, path })),
    ...galleryImageFiles.map((file) => ({ kind: "upload" as const, file })),
  ];

  const galleryImagePaths: string[] = [];

  for (const [index, source] of gallerySources.entries()) {
    const imagePath = await resolveCatalogImageSource(code, index + 2, source);
    galleryImagePaths.push(imagePath);
  }

  return { mainImagePath, galleryImagePaths };
}

export async function deleteCatalogImages(_supabase: SupabaseClient, imagePaths: string[]) {
  await deleteManagedCatalogImages(imagePaths);
}
