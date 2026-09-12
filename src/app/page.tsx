import { listCatalogProducts } from "@/features/catalog/application/list-products";
import StorefrontPage from "@/features/storefront/components/storefront-page";
import { listStorefrontBanners } from "@/features/storefront/server";
import TrackVisit from "@/features/analytics/components/track-visit";

// Was implicitly dynamic via the old server-side tracker; keep render behavior unchanged.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await listCatalogProducts();
  const banners = await listStorefrontBanners();

  return (
    <>
      <TrackVisit />
      <StorefrontPage products={products} banners={banners} />
    </>
  );
}
