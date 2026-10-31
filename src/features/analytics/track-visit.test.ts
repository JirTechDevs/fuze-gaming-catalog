import { describe, it, expect } from "vitest";
import { shouldCountVisit, type VisitSignal } from "@/features/analytics/track-visit";

const HUMAN: VisitSignal = {
  visitorId: "0b9f8c2e-4a1d-4f5e-9c3b-2d7e6a1f8b90",
  isAdminDevice: false,
  fetchSite: "same-origin",
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Safari/604.1",
  path: "/",
};

describe("shouldCountVisit", () => {
  it("counts a real browser on the homepage and on an account detail page", () => {
    expect(shouldCountVisit(HUMAN)).toBe(true);
    expect(shouldCountVisit({ ...HUMAN, path: "/jual-beli-akun/FZ6145" })).toBe(true);
  });

  it("rejects cookie-less clients (the bot that inflated the old counter)", () => {
    expect(shouldCountVisit({ ...HUMAN, visitorId: undefined })).toBe(false);
    expect(shouldCountVisit({ ...HUMAN, visitorId: "forged" })).toBe(false);
  });

  it("rejects admin devices, cross-site/scripted calls, bots, and other paths", () => {
    expect(shouldCountVisit({ ...HUMAN, isAdminDevice: true })).toBe(false);
    expect(shouldCountVisit({ ...HUMAN, fetchSite: null })).toBe(false);
    expect(shouldCountVisit({ ...HUMAN, fetchSite: "cross-site" })).toBe(false);
    expect(shouldCountVisit({ ...HUMAN, userAgent: "" })).toBe(false);
    expect(shouldCountVisit({ ...HUMAN, userAgent: "Mozilla/5.0 HeadlessChrome/120" })).toBe(false);
    expect(shouldCountVisit({ ...HUMAN, path: "/dashboard" })).toBe(false);
    expect(shouldCountVisit({ ...HUMAN, path: 42 })).toBe(false);
  });
});
