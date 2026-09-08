import { createServiceRoleClient } from "@/lib/supabase/admin";

export type DashboardStats = {
  available: number;
  sold: number;
  addedThisMonth: number;
  views30d: number;
  conversionRate: number;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createServiceRoleClient();

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [availableRes, soldRes, addedRes, viewsRes] = await Promise.all([
    supabase
      .from("catalog_items")
      .select("*", { count: "exact", head: true })
      .eq("status", "available"),
    supabase
      .from("catalog_items")
      .select("*", { count: "exact", head: true })
      .eq("status", "sold"),
    supabase
      .from("catalog_items")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfMonth.toISOString()),
    supabase
      .from("storefront_views")
      .select("*", { count: "exact", head: true })
      .gte("viewed_at", thirtyDaysAgo.toISOString()),
  ]);

  const available = availableRes.count ?? 0;
  const sold = soldRes.count ?? 0;
  const total = available + sold;

  return {
    available,
    sold,
    addedThisMonth: addedRes.count ?? 0,
    views30d: viewsRes.count ?? 0,
    conversionRate: total > 0 ? Math.round((sold / total) * 1000) / 10 : 0,
  };
}
