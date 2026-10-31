import { describe, it, expect } from "vitest";
import {
  aggregateDailyUniqueVisitors,
  sumDailyUniques,
} from "@/features/analytics/aggregate";

describe("daily unique visitor aggregation", () => {
  it("counts the same visitor once per WIB day and once again the next day", () => {
    const result = aggregateDailyUniqueVisitors([
      { viewedAt: "2026-09-10T15:30:00.000Z", sessionId: "visitor-a" },
      { viewedAt: "2026-09-10T16:45:00.000Z", sessionId: "visitor-a" },
      { viewedAt: "2026-09-10T17:30:00.000Z", sessionId: "visitor-a" },
    ]);

    expect(result.visitorsByDate.get("2026-09-10")?.size).toBe(1);
    expect(result.visitorsByDate.get("2026-09-11")?.size).toBe(1);
  });

  it("excludes NULL session ids from unique visitors", () => {
    const result = aggregateDailyUniqueVisitors([
      { viewedAt: "2026-09-10T10:00:00.000Z", sessionId: null },
      { viewedAt: "2026-09-10T11:00:00.000Z", sessionId: "visitor-a" },
    ]);

    expect(result.unattributedEvents).toBe(1);
    expect(result.visitorsByDate.get("2026-09-10")?.size).toBe(1);
  });

  it("sums daily uniques for a period, not DISTINCT over the whole span", () => {
    const { visitorsByDate } = aggregateDailyUniqueVisitors([
      { viewedAt: "2026-09-05T10:00:00.000Z", sessionId: "visitor-a" },
      { viewedAt: "2026-09-06T10:00:00.000Z", sessionId: "visitor-a" },
      { viewedAt: "2026-09-07T10:00:00.000Z", sessionId: "visitor-a" },
      { viewedAt: "2026-09-08T10:00:00.000Z", sessionId: "visitor-a" },
    ]);

    expect(sumDailyUniques(visitorsByDate, "2026-09-05", "2026-09-08")).toBe(4);
  });
});
