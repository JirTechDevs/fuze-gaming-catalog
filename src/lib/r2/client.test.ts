import { afterEach, expect, test, vi } from "vitest";
import { toDirectImageUrl } from "./client";

afterEach(() => vi.unstubAllEnvs());

test("rewrites /img/ URLs to R2 and leaves others alone", () => {
  vi.stubEnv("R2_PUBLIC_URL", "https://r2.example");
  expect(toDirectImageUrl("/img/catalog/a.webp")).toBe("https://r2.example/catalog/a.webp");
  expect(toDirectImageUrl("/images/catalog/mock_image.webp")).toBe("/images/catalog/mock_image.webp");
  expect(toDirectImageUrl("https://x.supabase.co/a.png")).toBe("https://x.supabase.co/a.png");

  vi.stubEnv("R2_PUBLIC_URL", "");
  expect(toDirectImageUrl("/img/catalog/a.webp")).toBe("/img/catalog/a.webp");
});
