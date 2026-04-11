import type {
  Product,
  ProductRepository,
} from "@/features/catalog/domain/product";
import { mockProducts } from "@/features/catalog/infrastructure/mock-products";

function cloneProducts(products: Product[]): Product[] {
  return structuredClone(products);
}

class InMemoryProductRepository implements ProductRepository {
  async list(): Promise<Product[]> {
    return cloneProducts(mockProducts);
  }
}

export const inMemoryProductRepository = new InMemoryProductRepository();
