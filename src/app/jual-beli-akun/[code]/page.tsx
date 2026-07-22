import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCatalogProductByCode } from "@/features/catalog/application/get-product-by-code";
import ProductDetailPage from "@/features/storefront/components/product-detail-page";

interface ProductDetailRouteProps {
  params: Promise<{ code: string }>;
}

function normalizeCode(raw: string) {
  return raw.trim().toUpperCase();
}

export async function generateMetadata({
  params,
}: ProductDetailRouteProps): Promise<Metadata> {
  const { code } = await params;
  const product = await getCatalogProductByCode(normalizeCode(code));

  if (!product) {
    return {
      title: "Akun Tidak Ditemukan | Fuzevalo",
      description: "Akun Valorant yang kamu cari tidak ditemukan di katalog Fuzevalo.",
    };
  }

  const skinPreview = product.skins.slice(0, 3).join(", ");
  const title = `Jual Beli Akun Valorant ${product.rank} ${product.code} | Fuzevalo`;
  const description = `${product.code} rank ${product.rank}. Skin ${skinPreview}. Harga Rp ${product.price.toLocaleString("id-ID")}. Garansi hackback 100% di Fuzevalo.`;
  const canonical = `/jual-beli-akun/${product.code}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      images: product.image ? [product.image] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.image ? [product.image] : undefined,
    },
  };
}

export default async function ProductDetailRoute({
  params,
}: ProductDetailRouteProps) {
  const { code } = await params;
  const product = await getCatalogProductByCode(normalizeCode(code));
  if (!product) notFound();
  return <ProductDetailPage product={product} />;
}
