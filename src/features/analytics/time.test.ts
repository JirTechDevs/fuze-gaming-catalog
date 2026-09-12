import { describe, it, expect, afterEach } from "vitest";
import {
  getStorefrontAnalyticsStartAt,
  getUtcDateKey,
  getUtcDayStart,
  shiftDateKey,
} from "@/features/analytics/time";

describe("UTC analytics time helpers", () => {
  it("splits the UTC day boundary at midnight, not local time", () => {
    expect(getUtcDateKey(new Date("2026-09-10T23:30:00.000Z"))).toBe("2026-09-10");
    expect(getUtcDateKey(new Date("2026-09-11T00:30:00.000Z"))).toBe("2026-09-11");
  });

  it("maps repeated same-day visits to the same UTC date key", () => {
    expect(getUtcDateKey(new Date("2026-09-10T23:30:00.000Z"))).toBe(
      getUtcDateKey(new Date("2026-09-10T23:45:00.000Z")),
    );
  });

  it("shifts date keys across day and month boundaries", () => {
    expect(shiftDateKey("2026-09-11", -6)).toBe("2026-09-05");
    expect(shiftDateKey("2026-09-11", -29)).toBe("2026-08-13");
    expect(shiftDateKey("2026-01-02", -2)).toBe("2025-12-31");
  });

  it("produces a UTC start-of-day timestamp", () => {
    expect(getUtcDayStart("2026-09-11")).toBe("2026-09-11T00:00:00.000Z");
  });

  describe("official analytics start", () => {
    afterEach(() => {
      delete process.env.STOREFRONT_ANALYTICS_START_AT;
    });

    it("returns null when not configured", () => {
      delete process.env.STOREFRONT_ANALYTICS_START_AT;
      expect(getStorefrontAnalyticsStartAt()).toBeNull();
    });

    it("parses a valid timestamp as an ISO UTC string", () => {
      process.env.STOREFRONT_ANALYTICS_START_AT = "2026-09-11T14:30:00.000Z";
      expect(getStorefrontAnalyticsStartAt()).toBe("2026-09-11T14:30:00.000Z");
    });

    it("returns null for an invalid timestamp", () => {
      process.env.STOREFRONT_ANALYTICS_START_AT = "not-a-date";
      expect(getStorefrontAnalyticsStartAt()).toBeNull();
    });
  });
});
