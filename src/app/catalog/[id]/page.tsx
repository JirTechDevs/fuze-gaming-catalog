import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCatalogProductById } from "@/features/catalog/application/get-product";
import ProductDetailPage from "@/features/storefront/components/product-detail-page";

interface ProductDetailRouteProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductDetailRouteProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getCatalogProductById(id);

  if (!product) {
    return {
      title: "Account Not Found | Fuzevalo",
      description: "Account detail was not found in the catalog.",
    };
  }

  const description = `${product.code} dengan rank ${product.rank}, ${product.skins.slice(0, 3).join(", ")} dan harga Rp ${product.price.toLocaleString("id-ID")}.`;

  return {
    title: `${product.code} | ${product.rank} | Fuzevalo`,
    description,
    openGraph: {
      title: `${product.code} | ${product.rank} | Fuzevalo`,
      description,
    },
    twitter: {
      title: `${product.code} | ${product.rank} | Fuzevalo`,
      description,
    },
  };
}

export default async function ProductDetailRoute({
  params,
}: ProductDetailRouteProps) {
  const { id } = await params;
  const product = await getCatalogProductById(id);

  if (!product) {
    notFound();
  }

  return <ProductDetailPage product={product} />;
}
