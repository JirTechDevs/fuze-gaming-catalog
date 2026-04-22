"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Headphones, Shield, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import type { StorefrontBanner } from "@/features/storefront/server";
import styles from "./hero-section.module.css";

const fallbackHeroBanners: StorefrontBanner[] = [
  { src: "/images/banners/pink.webp", alt: "Fuzevalo banner pink edition" },
];

const trustTicker = [
  { icon: "transactions", label: "1000+ TRANSAKSI BERHASIL" },
  { icon: "shield", label: "GARANSI HACKBACK 100%" },
  { icon: "zap", label: "PROSES CEPAT <10 MENIT" },
  { icon: "headphones", label: "CS AKTIF 24/7" },
] as const;

const featureBadges = [
  { icon: Shield, value: "100%", label: "Garansi Hackback" },
  { icon: Zap, value: "<10 Menit", label: "Proses Cepat" },
  { icon: Headphones, value: "24/7", label: "Fast Response" },
] as const;

const showcaseSlides = [
  {
    eyebrow: "AKUN READY",
    title: "IMMORTAL 1",
    detailTop: "FULL SKIN • PRIME VANDAL",
    detailBottom: "REAVER • RGX • 20+ SKIN",
    price: "Rp 2.500.000",
  },
  {
    eyebrow: "STOK PREMIUM",
    title: "ASCENDANT 3",
    detailTop: "FULL AGENT • SKIN PILIHAN",
    detailBottom: "ONI • CHAMPIONS • 18+ SKIN",
    price: "Rp 1.950.000",
  },
  {
    eyebrow: "LIMITED DROP",
    title: "RADIANT",
    detailTop: "EMAIL AMAN • SIAP MAIN",
    detailBottom: "PRELUDE • XEROFANG • 25+ SKIN",
    price: "Rp 3.200.000",
  },
] as const;

type TickerIconName = (typeof trustTicker)[number]["icon"];

function WhatsAppGlyph() {
  return (
    <svg viewBox="0 0 32 32" className="h-5 w-5" aria-hidden="true">
      <path
        fill="currentColor"
        d="M27.2 15.4c0 6.2-5 11.3-11.3 11.3-2 0-4-.5-5.7-1.5l-6.1 1.9 2-5.9a11.2 11.2 0 0 1-1.8-5.9C4.3 9.1 9.4 4 15.7 4S27.2 9.1 27.2 15.4Zm-11.5-9.5c-5.2 0-9.4 4.2-9.4 9.4 0 1.9.6 3.7 1.6 5.2l.2.2-1.2 3.7 3.8-1.2.2.1c1.5.9 3.2 1.4 4.9 1.4 5.2 0 9.4-4.2 9.4-9.4 0-5.2-4.2-9.4-9.5-9.4Zm5.4 12c-.3-.2-1.8-.9-2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.7-1.7-2-.2-.3 0-.4.1-.6l.5-.6c.2-.2.2-.4.3-.6.1-.2 0-.4 0-.6 0-.2-.7-1.7-.9-2.3-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.1 1.1-1.1 2.6s1.1 3 1.3 3.2c.2.2 2.2 3.5 5.4 4.8 3.2 1.2 3.2.8 3.8.7.6-.1 1.8-.8 2.1-1.5.3-.7.3-1.4.2-1.5-.1-.1-.3-.2-.6-.4Z"
      />
    </svg>
  );
}

function TickerItemIcon({ icon }: { icon: TickerIconName }) {
  if (icon === "shield") {
    return (
      <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-[#6de4ff]" aria-hidden="true">
        <path
          fill="currentColor"
          d="M10 2.1 16.4 4v5.2c0 4-2.5 6.7-6.4 8.7-3.9-2-6.4-4.7-6.4-8.7V4L10 2.1Zm0 3.1a1 1 0 0 0-1 1v3.2l-1.2 1.2a1 1 0 0 0 1.4 1.4l1.5-1.5c.2-.2.3-.4.3-.7V6.2a1 1 0 0 0-1-1Z"
        />
      </svg>
    );
  }

  if (icon === "zap") {
    return (
      <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-[#6de4ff]" aria-hidden="true">
        <path
          fill="currentColor"
          d="M11.5 1.8 4.6 10h3.8l-1.3 8.2 8-9.6h-4L11.5 1.8Z"
        />
      </svg>
    );
  }

  if (icon === "headphones") {
    return (
      <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-[#6de4ff]" aria-hidden="true">
        <path
          fill="currentColor"
          d="M10 3a7 7 0 0 0-7 7v2.6A2.4 2.4 0 0 0 5.4 15H7a1 1 0 0 0 1-1V9.8a1 1 0 0 0-1-1H5.2a4.8 4.8 0 0 1 9.6 0H13a1 1 0 0 0-1 1V14a1 1 0 0 0 1 1h1.6a2.4 2.4 0 0 0 2.4-2.4V10a7 7 0 0 0-7-7Z"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-[#6de4ff]" aria-hidden="true">
      <path
        fill="currentColor"
        d="M6.7 2.7a1 1 0 0 1 1.4 0l9.2 9.2a1 1 0 0 1 0 1.4l-3 3a1 1 0 0 1-1.4 0L3.7 7.1a1 1 0 0 1 0-1.4l3-3Zm.7 2.1L5.8 6.4l7.8 7.8 1.6-1.6-7.8-7.8ZM6 8.9a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2Z"
      />
    </svg>
  );
}

interface HeroSectionProps {
  banners: StorefrontBanner[];
}

export default function HeroSection({ banners }: HeroSectionProps) {
  const heroBanners = banners.length > 0 ? banners : fallbackHeroBanners;
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (heroBanners.length < 2) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroBanners.length);
    }, prefersReducedMotion ? 5600 : 4200);

    return () => window.clearInterval(timer);
  }, [heroBanners.length, prefersReducedMotion]);

  const scrollToCatalog = () => {
    document
      .getElementById("catalog")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const prevIndex = (activeIndex - 1 + heroBanners.length) % heroBanners.length;
  const nextIndex = (activeIndex + 1) % heroBanners.length;
  const secondNextIndex = (activeIndex + 2) % heroBanners.length;
  const showcase = showcaseSlides[activeIndex % showcaseSlides.length];
  const previewIndices =
    heroBanners.length > 2
      ? [nextIndex, secondNextIndex]
      : heroBanners.length > 1
        ? [nextIndex]
        : [];
  const tickerItems = [...trustTicker, ...trustTicker, ...trustTicker, ...trustTicker];

  return (
    <section className="relative isolate overflow-hidden">
      <div className={`absolute inset-0 ${styles.heroShell}`} />
      <div className={`absolute inset-0 ${styles.heroAurora}`} />
      <div className={`absolute inset-0 ${styles.heroTechLines}`} />
      <div className={`absolute inset-y-0 left-0 w-[42%] ${styles.heroCopyGlow}`} />
      <div className={`absolute inset-x-0 bottom-0 h-28 ${styles.heroBottomFade}`} />
      <div className={`pointer-events-none absolute -left-16 top-20 hidden h-56 w-56 lg:block ${styles.heroReticleLeft}`} />
      <div className={`pointer-events-none absolute right-10 top-10 hidden h-40 w-40 xl:block ${styles.heroReticleRight}`} />

      <div className="relative z-10 mx-auto flex max-w-[1512px] flex-col gap-10 px-4 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-8 lg:flex-row lg:items-center lg:gap-8 xl:px-8">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, x: -28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.65, ease: [0.16, 1, 0.3, 1] }}
          className={`relative flex w-full flex-col gap-6 rounded-[2rem] border border-[#14345a] bg-[linear-gradient(180deg,rgba(6,18,39,0.92),rgba(4,14,31,0.78))] px-5 py-6 shadow-[0_28px_70px_rgba(1,8,22,0.4)] sm:px-6 lg:max-w-[410px] lg:border-transparent lg:bg-transparent lg:px-0 lg:py-0 lg:shadow-none ${styles.heroCopyPanel}`}
        >
          <div className="flex">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#255886] bg-[#0b2345]/82 px-4 py-2 font-display text-[10px] font-bold tracking-[0.14em] text-[#60e3ff] shadow-[0_0_20px_rgba(78,209,255,0.12)] sm:text-[11px]">
              <Shield size={13} />
              STORE RESMI & TERPERCAYA
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="font-display text-[2.9rem] font-extrabold leading-[0.92] tracking-[-0.055em] text-white sm:text-[4rem] xl:text-[4.85rem]">
              JUAL AKUN
              <br />
              <span className="bg-[linear-gradient(180deg,#8ff4ff_0%,#51d8ff_45%,#27b8ff_100%)] bg-clip-text text-transparent">
                VALORANT
              </span>
            </h1>
          </div>

          <div className="flex items-start gap-4 sm:gap-0">
            {featureBadges.map((badge, index) => (
              <div
                key={badge.label}
                className={`relative flex-1 pr-4 sm:pr-5 ${
                  index < featureBadges.length - 1
                    ? "after:absolute after:right-0 after:top-1 after:h-12 after:w-px after:bg-white/10 sm:after:h-14"
                    : ""
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <badge.icon
                    size={16}
                    strokeWidth={2.1}
                    className="shrink-0 text-[#66e4ff]"
                  />
                  <p className="font-display text-base font-bold leading-none text-white sm:text-[1.15rem]">
                    {badge.value}
                  </p>
                </div>
                <p className="mt-1.5 text-[11px] leading-tight text-white/64 sm:text-[12px]">
                  {badge.label}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <a
              href="https://wa.me/628881462675"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[54px] items-center justify-center gap-2.5 rounded-[1.1rem] border border-[#43f399]/25 bg-[linear-gradient(180deg,#2fe26e,#1ccb59)] px-6 py-3.5 font-display text-[13px] font-bold tracking-[0.02em] text-white shadow-[0_0_0_1px_rgba(110,255,173,0.14),0_16px_32px_rgba(24,185,85,0.35),0_0_30px_rgba(46,225,109,0.24)] transition hover:brightness-105 sm:min-w-[254px]"
            >
              <WhatsAppGlyph />
              Chat WhatsApp Sekarang
            </a>
            <button
              type="button"
              onClick={scrollToCatalog}
              className="inline-flex min-h-[54px] items-center justify-center rounded-[1.1rem] border border-[#244e7e] bg-[linear-gradient(180deg,rgba(10,27,53,0.94),rgba(6,18,39,0.92))] px-6 py-3.5 font-display text-[13px] font-semibold tracking-[0.02em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_0_24px_rgba(76,213,255,0.12)] transition hover:border-[#57ddff] hover:text-[#7de8ff] sm:min-w-[168px]"
            >
              Lihat Katalog
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.72, ease: [0.16, 1, 0.3, 1], delay: prefersReducedMotion ? 0 : 0.08 }}
          className="relative flex min-w-0 flex-1 items-center justify-center lg:justify-end"
        >
          <div className="relative w-full max-w-[1120px] lg:pr-[210px] xl:pr-[280px]">
            <div className={`relative overflow-hidden rounded-[2rem] border border-[#173c64] bg-[#07142b]/92 ${styles.bannerStage}`}>
              <div className="relative aspect-[16/10.5] overflow-hidden sm:aspect-[16/8.8] lg:aspect-[16/7.8]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={heroBanners[activeIndex].src}
                    src={heroBanners[activeIndex].src}
                    alt={heroBanners[activeIndex].alt}
                    className="h-full w-full object-cover"
                    initial={prefersReducedMotion ? false : { opacity: 0, scale: 1.04, x: 10 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, x: -10 }}
                    transition={{ duration: prefersReducedMotion ? 0.2 : 0.6, ease: [0.16, 1, 0.3, 1] }}
                  />
                </AnimatePresence>

                <div className={`absolute inset-0 ${styles.bannerScreenGlow}`} />
                <div className={`absolute inset-0 ${styles.bannerOverlay}`} />

                <div className="absolute inset-x-3 bottom-3 rounded-[1.25rem] border border-[#1f4c79]/85 bg-[#081a36]/88 p-4 shadow-[0_18px_46px_rgba(2,9,22,0.38)] backdrop-blur-md sm:inset-y-0 sm:left-auto sm:right-0 sm:bottom-auto sm:flex sm:w-[15.5rem] sm:flex-col sm:justify-center sm:rounded-none sm:border-y-0 sm:border-r-0 sm:border-l sm:bg-[linear-gradient(90deg,rgba(6,18,39,0.08),rgba(5,15,32,0.86)_18%,rgba(4,11,25,0.97)_100%)] sm:p-7 sm:shadow-none sm:backdrop-blur-none md:w-[18rem] lg:w-[20rem]">
                  <p className="font-display text-[11px] font-bold tracking-[0.14em] text-[#65e4ff] sm:text-xs">
                    {showcase.eyebrow}
                  </p>
                  <h2 className="mt-2 font-display text-[1.85rem] font-extrabold leading-none text-white sm:text-[2.4rem]">
                    {showcase.title}
                  </h2>
                  <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.08em] text-white/92 sm:text-[12px]">
                    {showcase.detailTop}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#70dfff] sm:text-[12px]">
                    {showcase.detailBottom}
                  </p>
                  <div className="mt-5 inline-flex w-fit rounded-[1rem] border border-[#2ccaff]/70 bg-[linear-gradient(180deg,rgba(10,31,61,0.96),rgba(6,19,40,0.94))] px-4 py-3 font-display text-lg font-bold text-[#74e8ff] shadow-[0_0_28px_rgba(57,207,255,0.26)] sm:px-5 sm:text-[1.35rem]">
                    {showcase.price}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveIndex(prevIndex)}
                  aria-label="Show previous banner"
                  className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#214a79] bg-[#07152d]/92 text-white/92 shadow-[0_10px_28px_rgba(1,8,20,0.45)] transition hover:border-[#59dfff] hover:text-[#7ee9ff] sm:left-4 sm:h-11 sm:w-11"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveIndex(nextIndex)}
                  aria-label="Show next banner"
                  className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#214a79] bg-[#07152d]/92 text-white/92 shadow-[0_10px_28px_rgba(1,8,20,0.45)] transition hover:border-[#59dfff] hover:text-[#7ee9ff] sm:right-4 sm:h-11 sm:w-11"
                >
                  <ChevronRight size={18} />
                </button>

                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-[#06152d]/68 px-3 py-2 backdrop-blur-md">
                  {heroBanners.map((banner, index) => (
                    <button
                      key={banner.src}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      aria-label={`Show banner ${index + 1}`}
                      className={`h-2 rounded-full transition-all ${
                        index === activeIndex
                          ? "w-7 bg-[#67e3ff] shadow-[0_0_12px_rgba(103,227,255,0.8)]"
                          : "w-2 bg-white/28"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {previewIndices.map((previewIndex, index) => (
              <button
                key={`${heroBanners[previewIndex].src}-${index}`}
                type="button"
                onClick={() => setActiveIndex(previewIndex)}
                className={`absolute right-0 hidden overflow-hidden rounded-[1.55rem] border border-[#173c64] bg-[#07142b]/80 shadow-[0_26px_70px_rgba(1,7,18,0.52)] transition hover:border-[#53dcff] xl:block ${
                  index === 0 ? styles.previewPrimary : styles.previewSecondary
                }`}
              >
                <img
                  src={heroBanners[previewIndex].src}
                  alt={heroBanners[previewIndex].alt}
                  className="h-full w-full object-cover"
                />
                <div className={`absolute inset-0 ${styles.previewShade}`} />
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      <div className={`relative z-10 border-y border-[#16385f] ${styles.tickerBar}`}>
        <div className="hero-shop-mask overflow-hidden py-3 sm:py-3.5">
          <div
            className={`${prefersReducedMotion ? "" : "hero-shop-track"} flex w-max items-center whitespace-nowrap`}
            style={prefersReducedMotion ? undefined : { animationDuration: "28s" }}
          >
            {tickerItems.map((item, index) => (
              <span
                key={`${item.label}-${index}`}
                className="inline-flex items-center gap-3 px-5 sm:px-6"
              >
                <TickerItemIcon icon={item.icon} />
                <span className="font-display text-[11px] font-semibold tracking-[0.12em] text-white/84 sm:text-xs">
                  {item.label}
                </span>
                <span className="ml-1 text-white/16">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
