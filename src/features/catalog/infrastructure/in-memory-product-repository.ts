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

  async getById(id: string): Promise<Product | null> {
    const product = mockProducts.find((entry) => entry.id === id);

    return product ? structuredClone(product) : null;
  }
}

export const inMemoryProductRepository = new InMemoryProductRepository();
