import type {
  Product,
  ProductRepository,
} from "@/features/catalog/domain/product";
import { inMemoryProductRepository } from "@/features/catalog/infrastructure/in-memory-product-repository";

export async function getCatalogProductById(
  id: string,
  repository: ProductRepository = inMemoryProductRepository,
): Promise<Product | null> {
  return repository.getById(id);
}
