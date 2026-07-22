import { notFound, permanentRedirect } from "next/navigation";
import { getCatalogProductById } from "@/features/catalog/application/get-product";

interface LegacyProductDetailRouteProps {
  params: Promise<{ id: string }>;
}

// Legacy UUID route — kept for SEO continuity + old shares/bookmarks.
// Resolve the id to its catalog code, then 301 to the new SEO URL.
export default async function LegacyProductDetailRoute({
  params,
}: LegacyProductDetailRouteProps) {
  const { id } = await params;
  const product = await getCatalogProductById(id);
  if (!product) notFound();
  permanentRedirect(`/jual-beli-akun/${product.code}`);
}
