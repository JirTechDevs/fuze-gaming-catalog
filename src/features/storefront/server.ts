import { unstable_cache } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import { getSupabaseUrl } from "@/lib/supabase/env";

export interface StorefrontBanner {
  src: string;
  alt: string;
}

export const fallbackStorefrontBanners: StorefrontBanner[] = [
  { src: "/images/banners/pink.webp", alt: "Fuzevalo banner pink edition" },
  { src: "/images/banners/red.webp", alt: "Fuzevalo banner red edition" },
  { src: "/images/banners/yellow.webp", alt: "Fuzevalo banner yellow edition" },
];

function normalizeBannerSource(value: unknown) {
  if (typeof value !== "string") {
    return null;
  }

  const normalized = value.trim();

  if (!normalized) {
    return null;
  }

  if (
    normalized.startsWith("http://") ||
    normalized.startsWith("https://") ||
    normalized.startsWith("/")
  ) {
    return normalized;
  }

  if (normalized.startsWith("storage/v1/object/public/")) {
    return `${getSupabaseUrl()}/${normalized}`;
  }

  return normalized;
}

function toBannerItems(sources: string[]) {
  return sources.map((src, index) => ({
    src,
    alt: `Fuzevalo banner ${index + 1}`,
  }));
}

function extractBannerSources(settings: Record<string, unknown>) {
  const arrayFieldCandidates = [
    "hero_banners",
    "hero_banner_urls",
    "banner_urls",
    "banners",
  ] as const;

  for (const key of arrayFieldCandidates) {
    const value = settings[key];

    if (!Array.isArray(value)) {
      continue;
    }

    const sources = value
      .map((item) => normalizeBannerSource(item))
      .filter((item): item is string => Boolean(item));

    if (sources.length > 0) {
      return sources;
    }
  }

  const groupedFieldCandidates = [
    ["hero_banner_1_url", "hero_banner_2_url", "hero_banner_3_url"],
    ["banner_1_url", "banner_2_url", "banner_3_url"],
    ["hero_banner_1", "hero_banner_2", "hero_banner_3"],
    ["banner_1", "banner_2", "banner_3"],
    ["banner1", "banner2", "banner3"],
  ] as const;

  for (const fieldGroup of groupedFieldCandidates) {
    const sources = fieldGroup
      .map((field) => normalizeBannerSource(settings[field]))
      .filter((item): item is string => Boolean(item));

    if (sources.length > 0) {
      return sources;
    }
  }

  return [];
}

async function fetchStorefrontBanners(): Promise<StorefrontBanner[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("store_settings")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return fallbackStorefrontBanners;
  }

  const bannerSources = extractBannerSources(data as Record<string, unknown>);

  if (bannerSources.length === 0) {
    return fallbackStorefrontBanners;
  }

  return toBannerItems(bannerSources);
}

export const listStorefrontBanners = unstable_cache(
  fetchStorefrontBanners,
  ["storefront-banners"],
  { revalidate: 120, tags: ["storefront-banners"] },
);
