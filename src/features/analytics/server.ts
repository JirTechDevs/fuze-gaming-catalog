import { createServiceRoleClient } from "@/lib/supabase/admin";
import {
  aggregateDailyUniqueVisitors,
  sumDailyUniques,
} from "@/features/analytics/aggregate";
import {
  getJakartaDateKey,
  getJakartaDayStart,
  shiftDateKey,
} from "@/features/analytics/time";

const TRAFFIC_PAGE_SIZE = 1_000;

export type DailyStorefrontTraffic = {
  date: string;
  visitors: number;
  sales: number;
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
  trafficHistoryStart: string | null;
  unattributedTrafficEvents: number;
  salesTrackingAvailable: boolean;
};

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createServiceRoleClient();

  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const now = new Date();
  const todayDate = getJakartaDateKey(now);
  const weekStartDate = shiftDateKey(todayDate, -6);
  const monthStartDate = shiftDateKey(todayDate, -29);
  // Keep the storefront chart on the same 28-calendar-day window used by
  // Google Search Console, including today.
  const chartStartDate = shiftDateKey(todayDate, -27);

  const trafficQueryStart = getJakartaDayStart(monthStartDate);

  const [availableRes, soldRes, addedRes, dailyTrafficFirstPageRes, dailySalesRes] = await Promise.all([
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
      .select("viewed_at, session_id", { count: "exact" })
      .gte("viewed_at", trafficQueryStart)
      // Only rows from the client beacon carry user_agent. Everything recorded by
      // the old server-side tracker (bot-inflated) is excluded, so counting
      // starts at the deploy of the beacon.
      .not("user_agent", "is", null)
      .order("viewed_at", { ascending: true })
      .range(0, TRAFFIC_PAGE_SIZE - 1),
    supabase
      .from("catalog_items")
      .select("sold_at")
      .eq("status", "sold")
      .not("sold_at", "is", null)
      .gte("sold_at", getJakartaDayStart(chartStartDate)),
  ]);

  const available = availableRes.count ?? 0;
  const sold = soldRes.count ?? 0;
  const total = available + sold;
  const salesCountByDate = new Map<string, number>();

  const trafficPageCount = Math.ceil(
    (dailyTrafficFirstPageRes.count ?? dailyTrafficFirstPageRes.data?.length ?? 0) / TRAFFIC_PAGE_SIZE,
  );
  const remainingTrafficPages = await Promise.all(
    Array.from({ length: Math.max(trafficPageCount - 1, 0) }, (_, pageIndex) => {
      const from = (pageIndex + 1) * TRAFFIC_PAGE_SIZE;
      return supabase
        .from("storefront_views")
        .select("viewed_at, session_id")
        .gte("viewed_at", trafficQueryStart)
        .not("user_agent", "is", null)
        .order("viewed_at", { ascending: true })
        .range(from, from + TRAFFIC_PAGE_SIZE - 1);
    }),
  );
  const dailyTrafficEvents = [
    ...(dailyTrafficFirstPageRes.data ?? []),
    ...remainingTrafficPages.flatMap((page) => page.data ?? []),
  ];

  for (const sale of dailySalesRes.data ?? []) {
    if (sale.sold_at) {
      const date = getJakartaDateKey(new Date(sale.sold_at));
      salesCountByDate.set(date, (salesCountByDate.get(date) ?? 0) + 1);
    }
  }

  const { visitorsByDate, unattributedEvents, historyStart } =
    aggregateDailyUniqueVisitors(
      dailyTrafficEvents.map((view) => ({
        viewedAt: view.viewed_at,
        sessionId: view.session_id,
      })),
    );

  const visitorsForDate = (date: string) => visitorsByDate.get(date)?.size ?? 0;

  const dailyTraffic = Array.from({ length: 28 }, (_, index) => {
    const dateKey = shiftDateKey(chartStartDate, index);

    return {
      date: dateKey,
      visitors: visitorsForDate(dateKey),
      sales: salesCountByDate.get(dateKey) ?? 0,
    };
  });

  return {
    available,
    sold,
    addedThisMonth: addedRes.count ?? 0,
    viewsToday: visitorsForDate(todayDate),
    views7d: sumDailyUniques(visitorsByDate, weekStartDate, todayDate),
    views30d: sumDailyUniques(visitorsByDate, monthStartDate, todayDate),
    conversionRate: total > 0 ? Math.round((sold / total) * 1000) / 10 : 0,
    dailyTraffic,
    trafficHistoryStart: historyStart,
    unattributedTrafficEvents: unattributedEvents,
    salesTrackingAvailable: !dailySalesRes.error,
  };
}
