// Canonical analytics timezone is UTC. All daily buckets, deduplication, and
// the official cutoff must share these helpers so there is no timezone drift.

export function getUtcDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function shiftDateKey(dateKey: string, days: number) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return date.toISOString().slice(0, 10);
}

export function getUtcDayStart(dateKey: string) {
  return `${dateKey}T00:00:00.000Z`;
}

// Single source for the official analytics cutover. Set once at deployment to
// the exact go-live timestamp (e.g. STOREFRONT_ANALYTICS_START_AT).
export function getStorefrontAnalyticsStartAt(): string | null {
  const raw = process.env.STOREFRONT_ANALYTICS_START_AT;
  if (!raw) return null;

  const parsed = new Date(raw);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}
