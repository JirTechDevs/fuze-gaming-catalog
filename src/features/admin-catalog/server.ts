import { createClient } from "@/lib/supabase/server";
import {
  mapCatalogRow,
  type CatalogRecord,
  type CatalogRecordRow,
} from "@/features/admin-catalog/types";

const catalogSelect = `
  id,
  code,
  main_image_path,
  gallery_image_paths,
  rank,
  price,
  skins,
  region,
  change_nick_status,
  agent_unlock,
  sisa_vp,
  premier,
  status
`;

export async function listAdminCatalog(search = ""): Promise<CatalogRecord[]> {
  const supabase = await createClient();
  let query = supabase
    .from("catalog_items")
    .select(catalogSelect)
    .order("created_at", { ascending: false });

  const normalizedSearch = search.trim();

  if (normalizedSearch) {
    query = query.or(`code.ilike.%${normalizedSearch}%,rank.ilike.%${normalizedSearch}%`);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to list catalog items: ${error.message}`);
  }

  return ((data ?? []) as CatalogRecordRow[]).map(mapCatalogRow);
}

export async function getAdminCatalogById(id: string): Promise<CatalogRecord | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("catalog_items")
    .select(catalogSelect)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load catalog item: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  return mapCatalogRow(data as CatalogRecordRow);
}
