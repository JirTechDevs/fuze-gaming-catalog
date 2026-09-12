import { describe, it, expect } from "vitest";
import {
  getJakartaDateKey,
  getJakartaDayStart,
  shiftDateKey,
} from "@/features/analytics/time";

describe("WIB analytics time helpers", () => {
  it("splits the day at 00:00 WIB (17:00 UTC), not UTC midnight", () => {
    expect(getJakartaDateKey(new Date("2026-09-12T16:59:59.000Z"))).toBe("2026-09-12");
    expect(getJakartaDateKey(new Date("2026-09-12T17:00:00.000Z"))).toBe("2026-09-13");
    // 02:00 WIB on 13 Sep is still 12 Sep in UTC.
    expect(getJakartaDateKey(new Date("2026-09-12T19:00:00.000Z"))).toBe("2026-09-13");
  });

  it("shifts date keys across day and month boundaries", () => {
    expect(shiftDateKey("2026-09-11", -6)).toBe("2026-09-05");
    expect(shiftDateKey("2026-09-11", -29)).toBe("2026-08-13");
    expect(shiftDateKey("2026-01-02", -2)).toBe("2025-12-31");
  });

  it("produces the UTC instant of 00:00 WIB", () => {
    expect(getJakartaDayStart("2026-09-13")).toBe("2026-09-12T17:00:00.000Z");
  });
});
