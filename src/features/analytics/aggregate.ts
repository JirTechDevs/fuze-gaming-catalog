import { getUtcDateKey, shiftDateKey } from "@/features/analytics/time";

export type VisitorEvent = {
  viewedAt: string | null;
  sessionId: string | null;
};

export type DailyVisitorAggregation = {
  visitorsByDate: Map<string, Set<string>>;
  unattributedEvents: number;
  historyStart: string | null;
};

// One visitor counts at most once per UTC calendar day. NULL session ids are
// historical/unattributable events and are excluded from unique visitors.
export function aggregateDailyUniqueVisitors(
  events: VisitorEvent[],
): DailyVisitorAggregation {
  const visitorsByDate = new Map<string, Set<string>>();
  let unattributedEvents = 0;
  let historyStart: string | null = null;

  for (const event of events) {
    const viewedAt = event.viewedAt ? new Date(event.viewedAt) : null;
    if (!viewedAt || Number.isNaN(viewedAt.getTime())) continue;

    const date = getUtcDateKey(viewedAt);
    const sessionId = event.sessionId;

    if (!sessionId) {
      unattributedEvents += 1;
      continue;
    }

    if (historyStart === null || date < historyStart) {
      historyStart = date;
    }

    const visitors = visitorsByDate.get(date) ?? new Set<string>();
    visitors.add(sessionId);
    visitorsByDate.set(date, visitors);
  }

  return { visitorsByDate, unattributedEvents, historyStart };
}

// 7d / 30d metrics are the SUM of daily uniques, not a DISTINCT over the span.
export function sumDailyUniques(
  visitorsByDate: Map<string, Set<string>>,
  startDate: string,
  endDate: string,
): number {
  let total = 0;
  for (let date = startDate; date <= endDate; date = shiftDateKey(date, 1)) {
    total += visitorsByDate.get(date)?.size ?? 0;
  }
  return total;
}
