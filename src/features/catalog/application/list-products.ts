import type {
  Product,
  ProductRepository,
} from "@/features/catalog/domain/product";
import { inMemoryProductRepository } from "@/features/catalog/infrastructure/in-memory-product-repository";

export async function listCatalogProducts(
  repository: ProductRepository = inMemoryProductRepository,
): Promise<Product[]> {
  return repository.list();
}
