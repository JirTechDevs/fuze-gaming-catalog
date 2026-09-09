import { createServiceRoleClient } from "@/lib/supabase/admin";

export type DashboardStats = {
  available: number;
  sold: number;
  addedThisMonth: number;
  viewsToday: number;
  views7d: number;
  views30d: number;
  conversionRate: number;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createServiceRoleClient();

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [availableRes, soldRes, addedRes, todayRes, week7Res, month30Res] = await Promise.all([
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
      .gte("viewed_at", startOfToday.toISOString()),
    supabase
      .from("storefront_views")
      .select("*", { count: "exact", head: true })
      .gte("viewed_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
    supabase
      .from("storefront_views")
      .select("*", { count: "exact", head: true })
      .gte("viewed_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
  ]);

  const available = availableRes.count ?? 0;
  const sold = soldRes.count ?? 0;
  const total = available + sold;

  return {
    available,
    sold,
    addedThisMonth: addedRes.count ?? 0,
    viewsToday: todayRes.count ?? 0,
    views7d: week7Res.count ?? 0,
    views30d: month30Res.count ?? 0,
    conversionRate: total > 0 ? Math.round((sold / total) * 1000) / 10 : 0,
  };
}
