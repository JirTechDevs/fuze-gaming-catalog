import { S3Client, HeadObjectCommand } from "@aws-sdk/client-s3";
import { createClient } from "@supabase/supabase-js";

const key = process.argv[2] || "FZ9999IMG1.webp";
const {
  R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET,
  NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY,
} = process.env;

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
});
const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY, {
  auth: { persistSession: false },
});

console.log(`Checking key: ${key}`);
console.log("");

try {
  const r = await r2.send(new HeadObjectCommand({ Bucket: R2_BUCKET, Key: key }));
  console.log(`R2:  EXISTS  (${r.ContentLength} bytes, ${r.ContentType}, cache-control: ${r.CacheControl})`);
  console.log(`     LastModified: ${r.LastModified?.toISOString()}`);
} catch (e) {
  console.log(`R2:  NOT FOUND (${e.name})`);
}

const { data: sbList } = await supabase.storage.from("catalog-images").list("", { search: key });
const sbHit = sbList?.find(f => f.name === key);
if (sbHit) {
  console.log(`Sb:  EXISTS  (${sbHit.metadata?.size} bytes, ${sbHit.metadata?.mimetype})`);
  console.log(`     LastModified: ${sbHit.updated_at}`);
} else {
  console.log(`Sb:  NOT FOUND`);
}
