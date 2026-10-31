// Canonical analytics day is WIB (Asia/Jakarta, UTC+7, no DST). Daily buckets,
// deduplication (visited_date), and chart windows must all share these helpers.
const jakartaDate = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" });

export function getJakartaDateKey(date: Date) {
  return jakartaDate.format(date);
}

export function shiftDateKey(dateKey: string, days: number) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return date.toISOString().slice(0, 10);
}

export function getJakartaDayStart(dateKey: string) {
  return new Date(`${dateKey}T00:00:00+07:00`).toISOString();
}
