import { listCatalogProducts } from "@/features/catalog/application/list-products";
import StorefrontPage from "@/features/storefront/components/storefront-page";

export default async function HomePage() {
  const products = await listCatalogProducts();

  return <StorefrontPage products={products} />;
}
