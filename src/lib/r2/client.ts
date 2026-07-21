import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

let cachedClient: S3Client | null = null;

function getEnv(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing env var: ${key}`);
  }
  return value;
}

export function getR2Bucket() {
  return getEnv("R2_BUCKET");
}

export function getR2Client() {
  if (cachedClient) return cachedClient;

  const accountId = getEnv("R2_ACCOUNT_ID");
  cachedClient = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: getEnv("R2_ACCESS_KEY_ID"),
      secretAccessKey: getEnv("R2_SECRET_ACCESS_KEY"),
    },
  });
  return cachedClient;
}

const IMAGE_URL_PREFIX = "/img/";

export function buildImagePublicUrl(objectKey: string) {
  return `${IMAGE_URL_PREFIX}${objectKey}`;
}

// Extract object key from a URL we manage. Handles both new /img/ URLs and
// legacy Supabase Storage URLs (until legacy data is fully cleaned up).
export function extractManagedObjectKey(url: string): string | null {
  if (url.startsWith(IMAGE_URL_PREFIX)) {
    return decodeURIComponent(url.slice(IMAGE_URL_PREFIX.length));
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (supabaseUrl) {
    const legacyPrefix = `${supabaseUrl}/storage/v1/object/public/catalog-images/`;
    if (url.startsWith(legacyPrefix)) {
      return decodeURIComponent(url.slice(legacyPrefix.length));
    }
  }

  return null;
}

export async function putR2Object(
  key: string,
  body: Buffer | Uint8Array,
  contentType: string,
) {
  await getR2Client().send(
    new PutObjectCommand({
      Bucket: getR2Bucket(),
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    }),
  );
}

export async function deleteR2Object(key: string) {
  await getR2Client().send(
    new DeleteObjectCommand({ Bucket: getR2Bucket(), Key: key }),
  );
}

export async function deleteR2Objects(keys: string[]) {
  if (!keys.length) return;
  await getR2Client().send(
    new DeleteObjectsCommand({
      Bucket: getR2Bucket(),
      Delete: { Objects: keys.map((Key) => ({ Key })) },
    }),
  );
}

export async function moveR2Object(fromKey: string, toKey: string) {
  if (fromKey === toKey) return;

  // R2 has no native move — copy then delete. Use PutObject with CopySource header
  // via the S3 CopyObjectCommand.
  const { CopyObjectCommand } = await import("@aws-sdk/client-s3");
  await getR2Client().send(
    new CopyObjectCommand({
      Bucket: getR2Bucket(),
      Key: toKey,
      CopySource: encodeURIComponent(`${getR2Bucket()}/${fromKey}`),
      CacheControl: "public, max-age=31536000, immutable",
      MetadataDirective: "REPLACE",
    }),
  );
  await deleteR2Object(fromKey);
}
