import type { Metadata } from "next";
import { listCatalogProducts } from "@/features/catalog/application/list-products";
import AdminCatalogPage from "@/features/admin-catalog/components/admin-catalog-page";
import { requireAuthenticatedUser } from "@/features/admin-auth/guards";

export const metadata: Metadata = {
  title: "Admin | Fuzevalo",
  description: "Manage the Fuzevalo gaming catalog.",
};

export default async function AdminPage() {
  await requireAuthenticatedUser();

  const products = await listCatalogProducts();

  return <AdminCatalogPage initialProducts={products} />;
}
