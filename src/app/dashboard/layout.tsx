import type { ReactNode } from "react";
import AdminShell from "@/features/admin-dashboard/components/admin-shell";
import { requireAuthenticatedUser } from "@/features/admin-auth/guards";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  await requireAuthenticatedUser();

  return <AdminShell>{children}</AdminShell>;
}
