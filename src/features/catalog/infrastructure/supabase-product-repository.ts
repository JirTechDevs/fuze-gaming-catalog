import { unstable_noStore as noStore } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type {
  Product,
  ProductRepository,
} from "@/features/catalog/domain/product";

const CATALOG_IMAGE_FALLBACK = "/images/catalog/mock_image.jpg";

type CatalogProductRow = {
  id: string;
  code: string;
  main_image_path: string | null;
  gallery_image_paths: string[] | null;
  rank: string;
  price: number;
  skins: string[] | null;
  region: string | null;
  change_nick_status: string | null;
  agent_unlock: string | null;
  sisa_vp: string | null;
  premier: string | null;
  status: "available" | "sold";
};

const catalogProductSelect = `
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

function uniqueImages(images: Array<string | null | undefined>) {
  return [...new Set(images.filter(Boolean))] as string[];
}

function mapCatalogRowToProduct(row: CatalogProductRow): Product {
  const primaryImage = row.main_image_path || CATALOG_IMAGE_FALLBACK;
  const images = uniqueImages([primaryImage, ...(row.gallery_image_paths ?? [])]);

  return {
    id: row.id,
    code: row.code,
    image: primaryImage,
    images,
    rank: row.rank,
    price: row.price,
    skins: row.skins ?? [],
    sisaVP: row.sisa_vp || "-",
    agent: row.agent_unlock || "-",
    changeNick: row.change_nick_status || "Not Ready",
    region: row.region || "IDN",
    premier: row.premier || "-",
    status: row.status,
  };
}

class SupabaseProductRepository implements ProductRepository {
  async list(): Promise<Product[]> {
    noStore();

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("catalog_items")
      .select(catalogProductSelect)
      .eq("status", "available")
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to list storefront products: ${error.message}`);
    }

    return ((data ?? []) as CatalogProductRow[]).map(mapCatalogRowToProduct);
  }

  async getById(id: string): Promise<Product | null> {
    noStore();

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("catalog_items")
      .select(catalogProductSelect)
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to load storefront product: ${error.message}`);
    }

    if (!data) {
      return null;
    }

    return mapCatalogRowToProduct(data as CatalogProductRow);
  }
}

export const supabaseProductRepository = new SupabaseProductRepository();
