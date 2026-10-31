import { listCatalogProducts } from "@/features/catalog/application/list-products";
import StorefrontPage from "@/features/storefront/components/storefront-page";
import { listStorefrontBanners } from "@/features/storefront/server";
import TrackVisit from "@/features/analytics/components/track-visit";

// ISR: render once per minute, matching the 60s unstable_cache on catalog data.
export const revalidate = 60;

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
