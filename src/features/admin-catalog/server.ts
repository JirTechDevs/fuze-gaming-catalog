import { createClient } from "@/lib/supabase/server";
import {
  mapCatalogRow,
  type CatalogListItem,
  type CatalogRecord,
  type CatalogRecordRow,
} from "@/features/admin-catalog/types";

export type ListAdminCatalogResult = {
  items: CatalogListItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

const catalogTableColumns = "id, code, rank, price, region, status";

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

export async function listAdminCatalog(
  search = "",
  page = 1,
  pageSize = 25,
): Promise<ListAdminCatalogResult> {
  const supabase = await createClient();
  const normalizedSearch = search.trim();
  const safePage = Math.max(1, page);
  const from = (safePage - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("catalog_items")
    .select(catalogTableColumns, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (normalizedSearch) {
    query = query.or(`code.ilike.%${normalizedSearch}%,rank.ilike.%${normalizedSearch}%`);
  }

  const { data, count, error } = await query;

  if (error) {
    throw new Error(`Failed to list catalog items: ${error.message}`);
  }

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return {
    items: (data ?? []) as CatalogListItem[],
    total,
    page: safePage,
    pageSize,
    totalPages,
  };
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
