import { createServiceRoleClient } from "@/lib/supabase/admin";

const TRAFFIC_PAGE_SIZE = 1_000;
const JAKARTA_TIME_ZONE = "Asia/Jakarta";
const jakartaDateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: JAKARTA_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function getJakartaDateKey(date: Date) {
  const parts = jakartaDateFormatter.formatToParts(date);
  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  return `${values.year}-${values.month}-${values.day}`;
}

function shiftDateKey(dateKey: string, days: number) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return date.toISOString().slice(0, 10);
}

function getJakartaDayStart(dateKey: string) {
  return `${dateKey}T00:00:00+07:00`;
}

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

  const todayDate = getJakartaDateKey(new Date());
  const weekStartDate = shiftDateKey(todayDate, -6);
  const monthStartDate = shiftDateKey(todayDate, -29);
  // Keep the storefront chart on the same 28-calendar-day window used by
  // Google Search Console, including today.
  const chartStartDate = shiftDateKey(todayDate, -27);

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
      .gte("viewed_at", getJakartaDayStart(monthStartDate))
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
  const visitorSessionsByDate = new Map<string, Set<string>>();
  const salesCountByDate = new Map<string, number>();
  let trafficHistoryStart: string | null = null;
  let unattributedTrafficEvents = 0;
  const trafficPageCount = Math.ceil(
    (dailyTrafficFirstPageRes.count ?? dailyTrafficFirstPageRes.data?.length ?? 0) / TRAFFIC_PAGE_SIZE,
  );
  const remainingTrafficPages = await Promise.all(
    Array.from({ length: Math.max(trafficPageCount - 1, 0) }, (_, pageIndex) => {
      const from = (pageIndex + 1) * TRAFFIC_PAGE_SIZE;
      return supabase
        .from("storefront_views")
        .select("viewed_at, session_id")
        .gte("viewed_at", getJakartaDayStart(monthStartDate))
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

  for (const view of dailyTrafficEvents) {
    // `viewed_at` is the original event timestamp. Do not use `visited_date`
    // here: legacy rows received that column's default value when it was added,
    // which would incorrectly place historic traffic on one migration day.
    if (view.viewed_at) {
      const date = getJakartaDateKey(new Date(view.viewed_at));
      const sessionId = view.session_id;

      // These legacy rows predate session tracking. They are real page events,
      // but cannot be counted as unique visitors, so keep them out of the
      // unique-visitor trend and summary cards.
      if (!sessionId) {
        unattributedTrafficEvents += 1;
        continue;
      }

      trafficHistoryStart ??= date;

      const visitors = visitorSessionsByDate.get(date) ?? new Set<string>();
      visitors.add(sessionId);
      visitorSessionsByDate.set(date, visitors);
    }
  }

  const visitorsForDate = (date: string) => visitorSessionsByDate.get(date)?.size ?? 0;
  const visitorsInPeriod = (startDate: string) => {
    let visitors = 0;
    for (let date = startDate; date <= todayDate; date = shiftDateKey(date, 1)) {
      visitors += visitorsForDate(date);
    }
    return visitors;
  };

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
    views7d: visitorsInPeriod(weekStartDate),
    views30d: visitorsInPeriod(monthStartDate),
    conversionRate: total > 0 ? Math.round((sold / total) * 1000) / 10 : 0,
    dailyTraffic,
    trafficHistoryStart,
    unattributedTrafficEvents,
    salesTrackingAvailable: !dailySalesRes.error,
  };
}
