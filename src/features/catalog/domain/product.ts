export type ProductStatus = "available" | "sold";
export type ProductFeaturedTag = "hot" | "best-deal" | "rare";

export interface Product {
  id: string;
  code: string;
  image: string;
  images?: string[];
  rank: string;
  price: number;
  skins: string[];
  sisaVP: string;
  agent: string;
  changeNick: string;
  region: string;
  premier: string;
  status: ProductStatus;
  featured?: ProductFeaturedTag;
}

export interface ProductRepository {
  list(): Promise<Product[]>;
  getById(id: string): Promise<Product | null>;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID").format(price);
}

export function buildWhatsAppLink(product: Product): string {
  const message = encodeURIComponent(
    `Halo, saya tertarik membeli akun ${product.code} (${product.rank}) seharga Rp ${formatPrice(product.price)}. Apakah masih tersedia?`,
  );

  return `https://wa.me/6281234567890?text=${message}`;
}
