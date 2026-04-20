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
    `Halo min! aku mau beli akun code {"${product.code}"}`,
  );

  return `https://wa.me/628881462675?text=${message}`;
}
