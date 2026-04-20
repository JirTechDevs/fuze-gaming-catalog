import { listCatalogProducts } from "@/features/catalog/application/list-products";
import StorefrontPage from "@/features/storefront/components/storefront-page";
import { listStorefrontBanners } from "@/features/storefront/server";

export default async function HomePage() {
  const products = await listCatalogProducts();
  const banners = await listStorefrontBanners();

  return <StorefrontPage products={products} banners={banners} />;
}
