import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const after = vi.fn();
  const headersGet = vi.fn();
  const cookiesGet = vi.fn();

  return { after, headersGet, cookiesGet };
});

vi.mock("next/server", () => ({
  after: mocks.after,
}));

vi.mock("next/headers", () => ({
  headers: async () => ({ get: mocks.headersGet }),
  cookies: async () => ({ get: mocks.cookiesGet }),
}));

import { trackStorefrontView } from "@/features/analytics/track-view";

const HUMAN_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36";

function stubHeaders({ track, userAgent }: { track: string; userAgent: string }) {
  mocks.headersGet.mockImplementation((name: string) => {
    if (name === "x-fvz-track") return track;
    if (name === "user-agent") return userAgent;
    return "/";
  });
}

describe("trackStorefrontView gating", () => {
  beforeEach(() => {
    mocks.after.mockReset();
    mocks.headersGet.mockReset();
    mocks.cookiesGet.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("does not schedule tracking when the middleware gate is off", async () => {
    stubHeaders({ track: "0", userAgent: HUMAN_UA });

    await trackStorefrontView();

    expect(mocks.after).not.toHaveBeenCalled();
  });

  it("skips bot user agents", async () => {
    stubHeaders({ track: "1", userAgent: "Googlebot/2.1" });

    await trackStorefrontView();

    expect(mocks.after).not.toHaveBeenCalled();
  });

  it("schedules tracking exactly once for a human visitor with a cookie", async () => {
    stubHeaders({ track: "1", userAgent: HUMAN_UA });
    mocks.cookiesGet.mockReturnValue({ value: "visitor-a" });

    await trackStorefrontView();

    expect(mocks.after).toHaveBeenCalledTimes(1);
  });

  it("fails safe when the visitor cookie is missing", async () => {
    stubHeaders({ track: "1", userAgent: HUMAN_UA });
    mocks.cookiesGet.mockReturnValue(undefined);
    vi.spyOn(console, "warn").mockImplementation(() => {});

    await trackStorefrontView();

    expect(mocks.after).not.toHaveBeenCalled();
  });
});
