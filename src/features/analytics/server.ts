import { createServiceRoleClient } from "@/lib/supabase/admin";

export type DailyStorefrontTraffic = {
  date: string;
  visitors: number;
};

export type DashboardStats = {
  available: number;
  sold: number;
  addedThisMonth: number;
  viewsToday: number;
  views7d: number;
  views30d: number;
  conversionRate: number;
  dailyTraffic: DailyStorefrontTraffic[];
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createServiceRoleClient();

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  // Keep the storefront chart on the same 28-calendar-day window used by
  // Google Search Console, including today.
  const chartStart = new Date(startOfToday);
  chartStart.setDate(chartStart.getDate() - 27);
  const chartStartDate = chartStart.toISOString().slice(0, 10);

  const [availableRes, soldRes, addedRes, todayRes, week7Res, month30Res, dailyTrafficRes] = await Promise.all([
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
    supabase
      .from("storefront_views")
      .select("visited_date")
      .gte("visited_date", chartStartDate)
      .order("visited_date", { ascending: true })
      .range(0, 9999),
  ]);

  const available = availableRes.count ?? 0;
  const sold = soldRes.count ?? 0;
  const total = available + sold;
  const visitorCountByDate = new Map<string, number>();

  for (const view of dailyTrafficRes.data ?? []) {
    const date = view.visited_date;
    if (date) {
      visitorCountByDate.set(date, (visitorCountByDate.get(date) ?? 0) + 1);
    }
  }

  const dailyTraffic = Array.from({ length: 28 }, (_, index) => {
    const date = new Date(chartStart);
    date.setDate(chartStart.getDate() + index);
    const dateKey = date.toISOString().slice(0, 10);

    return { date: dateKey, visitors: visitorCountByDate.get(dateKey) ?? 0 };
  });

  return {
    available,
    sold,
    addedThisMonth: addedRes.count ?? 0,
    viewsToday: todayRes.count ?? 0,
    views7d: week7Res.count ?? 0,
    views30d: month30Res.count ?? 0,
    conversionRate: total > 0 ? Math.round((sold / total) * 1000) / 10 : 0,
    dailyTraffic,
  };
}
