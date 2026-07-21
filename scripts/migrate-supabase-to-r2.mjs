// One-off: copy every object in the Supabase `catalog-images` bucket into
// Cloudflare R2 at the same key. Idempotent — re-run safe.
//
// Usage:
//   bun run scripts/migrate-supabase-to-r2.mjs --dry-run   # list only, don't copy
//   bun run scripts/migrate-supabase-to-r2.mjs             # do the copy
//
// Env vars (from .env):
//   NEXT_PUBLIC_SUPABASE_URL
//   SUPABASE_SECRET_KEY  (service-role key, for listing + downloading)
//   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET

import { createClient } from "@supabase/supabase-js";
import {
  S3Client,
  HeadObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";

const dryRun = process.argv.includes("--dry-run");

const {
  NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SECRET_KEY,
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET,
} = process.env;

for (const [k, v] of Object.entries({
  NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_SECRET_KEY,
  R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_BUCKET,
})) {
  if (!v) {
    console.error(`Missing env var: ${k}`);
    process.exit(1);
  }
}

const SUPABASE_BUCKET = "catalog-images";
const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY, {
  auth: { persistSession: false },
});

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

async function* walkSupabase(prefix = "") {
  let offset = 0;
  const limit = 100;
  while (true) {
    const { data, error } = await supabase.storage
      .from(SUPABASE_BUCKET)
      .list(prefix, {
        limit,
        offset,
        sortBy: { column: "name", order: "asc" },
      });
    if (error) throw new Error(`list ${prefix}: ${error.message}`);
    if (!data || data.length === 0) return;
    for (const item of data) {
      const path = prefix ? `${prefix}/${item.name}` : item.name;
      if (item.id === null) {
        yield* walkSupabase(path);
      } else {
        yield { key: path, size: item.metadata?.size, mimeType: item.metadata?.mimetype };
      }
    }
    if (data.length < limit) return;
    offset += limit;
  }
}

async function existsInR2(key) {
  try {
    await r2.send(new HeadObjectCommand({ Bucket: R2_BUCKET, Key: key }));
    return true;
  } catch (err) {
    if (err?.$metadata?.httpStatusCode === 404 || err?.name === "NotFound") return false;
    throw err;
  }
}

let copied = 0;
let skipped = 0;
let failed = 0;
const started = Date.now();

console.log(`Mode: ${dryRun ? "DRY-RUN" : "LIVE COPY"}`);
console.log(`Source: Supabase bucket "${SUPABASE_BUCKET}"`);
console.log(`Target: R2 bucket "${R2_BUCKET}"`);
console.log("");

for await (const item of walkSupabase()) {
  try {
    if (await existsInR2(item.key)) {
      skipped += 1;
      if (dryRun) console.log(`SKIP (exists in R2): ${item.key}`);
      continue;
    }

    if (dryRun) {
      console.log(`COPY: ${item.key} (${item.size ?? "?"} bytes, ${item.mimeType ?? "?"})`);
      copied += 1;
      continue;
    }

    const { data: blob, error: dlErr } = await supabase.storage
      .from(SUPABASE_BUCKET)
      .download(item.key);
    if (dlErr) throw new Error(`download: ${dlErr.message}`);
    const buf = Buffer.from(await blob.arrayBuffer());

    await r2.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: item.key,
        Body: buf,
        ContentType: item.mimeType || blob.type || "application/octet-stream",
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );

    copied += 1;
    if (copied % 25 === 0) console.log(`  copied ${copied} objects…`);
  } catch (err) {
    failed += 1;
    console.error(`FAIL ${item.key}: ${err.message}`);
  }
}

const seconds = ((Date.now() - started) / 1000).toFixed(1);
console.log("");
console.log(`Done. copied=${copied} skipped=${skipped} failed=${failed} in ${seconds}s`);
process.exit(failed === 0 ? 0 : 1);
