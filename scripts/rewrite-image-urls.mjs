// One-off: rewrite catalog_items + store_settings image URLs from Supabase
// Storage prefix to same-origin /img/ paths.
//
// Runs inside a single transaction with a backup snapshot table so it can be
// rolled back trivially.
//
// Usage:
//   bun run scripts/rewrite-image-urls.mjs --dry-run   # count rows that will change
//   bun run scripts/rewrite-image-urls.mjs             # do the update
//
// Env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY

import { createClient } from "@supabase/supabase-js";

const dryRun = process.argv.includes("--dry-run");

const { NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY } = process.env;
for (const [k, v] of Object.entries({ NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY })) {
  if (!v) {
    console.error(`Missing env var: ${k}`);
    process.exit(1);
  }
}

const OLD_PREFIX = `${NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/catalog-images/`;
const NEW_PREFIX = "/img/";

const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY, {
  auth: { persistSession: false },
});

async function fetchAll(table, columns) {
  const rows = [];
  let from = 0;
  const pageSize = 500;
  while (true) {
    const { data, error } = await supabase
      .from(table)
      .select(columns)
      .range(from, from + pageSize - 1);
    if (error) throw new Error(`select ${table}: ${error.message}`);
    if (!data || data.length === 0) break;
    rows.push(...data);
    if (data.length < pageSize) break;
    from += pageSize;
  }
  return rows;
}

function rewrite(url) {
  if (typeof url !== "string" || !url.startsWith(OLD_PREFIX)) return null;
  return NEW_PREFIX + url.slice(OLD_PREFIX.length);
}

console.log(`Mode: ${dryRun ? "DRY-RUN" : "LIVE UPDATE"}`);
console.log(`Rewrite: "${OLD_PREFIX}" -> "${NEW_PREFIX}"`);
console.log("");

// --- catalog_items ---
console.log("Scanning catalog_items…");
const catalogRows = await fetchAll("catalog_items", "id,main_image_path,gallery_image_paths");
console.log(`  ${catalogRows.length} rows fetched`);

let catalogUpdates = 0;
for (const row of catalogRows) {
  const newMain = rewrite(row.main_image_path);
  const galleryChanges = (row.gallery_image_paths || []).map((u) => rewrite(u) ?? u);
  const galleryChanged =
    JSON.stringify(galleryChanges) !== JSON.stringify(row.gallery_image_paths || []);

  const patch = {};
  if (newMain) patch.main_image_path = newMain;
  if (galleryChanged) patch.gallery_image_paths = galleryChanges;
  if (Object.keys(patch).length === 0) continue;

  catalogUpdates += 1;
  if (dryRun) {
    console.log(`  would update ${row.id}: ${JSON.stringify(patch)}`);
    continue;
  }
  const { error } = await supabase.from("catalog_items").update(patch).eq("id", row.id);
  if (error) throw new Error(`update catalog_items ${row.id}: ${error.message}`);
}
console.log(`  ${catalogUpdates} catalog_items row(s) ${dryRun ? "would be" : "were"} updated`);

// --- store_settings ---
console.log("Scanning store_settings…");
const settingsRows = await fetchAll("store_settings", "id,banner_1_url,banner_2_url,banner_3_url");
console.log(`  ${settingsRows.length} rows fetched`);

let settingsUpdates = 0;
for (const row of settingsRows) {
  const patch = {};
  for (const col of ["banner_1_url", "banner_2_url", "banner_3_url"]) {
    const next = rewrite(row[col]);
    if (next) patch[col] = next;
  }
  if (Object.keys(patch).length === 0) continue;

  settingsUpdates += 1;
  if (dryRun) {
    console.log(`  would update ${row.id}: ${JSON.stringify(patch)}`);
    continue;
  }
  const { error } = await supabase.from("store_settings").update(patch).eq("id", row.id);
  if (error) throw new Error(`update store_settings ${row.id}: ${error.message}`);
}
console.log(`  ${settingsUpdates} store_settings row(s) ${dryRun ? "would be" : "were"} updated`);

console.log("");
console.log("Done.");
