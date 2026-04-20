import type {
  Product,
  ProductRepository,
} from "@/features/catalog/domain/product";
import { supabaseProductRepository } from "@/features/catalog/infrastructure/supabase-product-repository";

export async function listCatalogProducts(
  repository: ProductRepository = supabaseProductRepository,
): Promise<Product[]> {
  return repository.list();
}
