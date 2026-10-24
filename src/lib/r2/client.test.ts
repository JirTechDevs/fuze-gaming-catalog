import { afterEach, expect, test, vi } from "vitest";
import { toProxiedImageUrl } from "./client";

afterEach(() => vi.unstubAllEnvs());

test("maps r2.dev URLs to /img/ and leaves others alone", () => {
  vi.stubEnv("R2_PUBLIC_URL", "https://r2.example");
  expect(toProxiedImageUrl("https://r2.example/storefront-banners/b.webp")).toBe("/img/storefront-banners/b.webp");
  expect(toProxiedImageUrl("/img/catalog/a.webp")).toBe("/img/catalog/a.webp");
  expect(toProxiedImageUrl("https://x.supabase.co/a.png")).toBe("https://x.supabase.co/a.png");

  vi.stubEnv("R2_PUBLIC_URL", "");
  expect(toProxiedImageUrl("https://r2.example/a.webp")).toBe("https://r2.example/a.webp");
});
