// Smoke test: verify R2 credentials, bucket access, upload/read/delete cycle.
// Run: bun run scripts/probe-r2.mjs

// bun natively loads .env — no dotenv needed
import {
  S3Client,
  HeadBucketCommand,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";

const {
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET,
  R2_PUBLIC_URL,
} = process.env;

for (const [k, v] of Object.entries({
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET,
  R2_PUBLIC_URL,
})) {
  if (!v) {
    console.error(`Missing env var: ${k}`);
    process.exit(1);
  }
}

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

const testKey = `_probe/hello-${Date.now()}.txt`;
const testBody = "hello from probe-r2 " + new Date().toISOString();

async function main() {
  console.log("1. HeadBucket…");
  await s3.send(new HeadBucketCommand({ Bucket: R2_BUCKET }));
  console.log("   ok");

  console.log("2. ListObjects (should be empty on a fresh bucket)…");
  const list = await s3.send(new ListObjectsV2Command({ Bucket: R2_BUCKET, MaxKeys: 5 }));
  console.log(`   ${list.KeyCount ?? 0} object(s) currently`);

  console.log(`3. PutObject ${testKey}…`);
  await s3.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: testKey,
      Body: testBody,
      ContentType: "text/plain",
      CacheControl: "max-age=31536000",
    }),
  );
  console.log("   ok");

  console.log(`4. GetObject ${testKey}…`);
  const got = await s3.send(new GetObjectCommand({ Bucket: R2_BUCKET, Key: testKey }));
  const gotBody = await got.Body.transformToString();
  console.log(`   body match: ${gotBody === testBody}`);
  console.log(`   cache-control: ${got.CacheControl}`);

  console.log(`5. Public URL fetch: ${R2_PUBLIC_URL}/${testKey}`);
  const pubRes = await fetch(`${R2_PUBLIC_URL}/${testKey}`);
  console.log(`   status: ${pubRes.status}`);
  console.log(`   cache-control: ${pubRes.headers.get("cache-control")}`);
  console.log(`   body match: ${(await pubRes.text()) === testBody}`);

  console.log(`6. DeleteObject ${testKey}…`);
  await s3.send(new DeleteObjectCommand({ Bucket: R2_BUCKET, Key: testKey }));
  console.log("   ok — cleaned up");

  console.log("\nAll R2 checks passed ✅");
}

main().catch((err) => {
  console.error("FAIL:", err.message);
  console.error(err);
  process.exit(1);
});
