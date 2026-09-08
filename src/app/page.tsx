import { listCatalogProducts } from "@/features/catalog/application/list-products";
import StorefrontPage from "@/features/storefront/components/storefront-page";
import { listStorefrontBanners } from "@/features/storefront/server";
import { trackStorefrontView } from "@/features/analytics/track-view";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) await trackStorefrontView("/");
  const products = await listCatalogProducts();
  const banners = await listStorefrontBanners();

  return <StorefrontPage products={products} banners={banners} />;
}
