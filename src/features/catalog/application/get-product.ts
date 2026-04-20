import type {
  Product,
  ProductRepository,
} from "@/features/catalog/domain/product";
import { supabaseProductRepository } from "@/features/catalog/infrastructure/supabase-product-repository";

export async function getCatalogProductById(
  id: string,
  repository: ProductRepository = supabaseProductRepository,
): Promise<Product | null> {
  return repository.getById(id);
}
