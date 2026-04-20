import { notFound } from "next/navigation";
import CatalogForm from "@/features/admin-catalog/components/catalog-form";
import { getAdminCatalogById } from "@/features/admin-catalog/server";

interface EditCatalogPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditCatalogPage({ params }: EditCatalogPageProps) {
  const { id } = await params;
  const record = await getAdminCatalogById(id);

  if (!record) {
    notFound();
  }

  return <CatalogForm mode="edit" record={record} />;
}
