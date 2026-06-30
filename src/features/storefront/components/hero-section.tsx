"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import type { StorefrontBanner } from "@/features/storefront/server";
import styles from "./hero-section.module.css";

interface HeroSectionProps {
  banners: StorefrontBanner[];
}

const fallbackHeroBanners: StorefrontBanner[] = [
  { src: "/images/banners/pink.webp", alt: "Fuzevalo banner pink edition" },
];

const featureStats = [
  { value: "100%", label: "Garansi Hackback" },
  { value: "<10 Menit", label: "Proses Cepat" },
  { value: "24/7", label: "Fast Response" },
] as const;

const tickerItems = [
  { icon: "transactions", label: "1000+ TRANSAKSI BERHASIL" },
  { icon: "shield", label: "GARANSI HACKBACK 100%" },
  { icon: "zap", label: "PROSES CEPAT <10 MENIT" },
  { icon: "headphones", label: "CS AKTIF 24/7" },
] as const;

type TickerIconName = (typeof tickerItems)[number]["icon"];

const STAR_COUNT = 50;

function WhatsAppGlyph({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M17.6 6.32A7.85 7.85 0 0 0 12.05 4a7.94 7.94 0 0 0-6.88 11.9L4 20l4.2-1.1a7.93 7.93 0 0 0 3.84.98 7.94 7.94 0 0 0 7.94-7.93 7.88 7.88 0 0 0-2.39-5.63z" />
    </svg>
  );
}

function TickerItemIcon({ icon }: { icon: TickerIconName }) {
  if (icon === "shield") {
    return (
      <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-[#22d3ff]" aria-hidden="true">
        <path fill="currentColor" d="M10 2.1 16.4 4v5.2c0 4-2.5 6.7-6.4 8.7-3.9-2-6.4-4.7-6.4-8.7V4L10 2.1Zm0 3.1a1 1 0 0 0-1 1v3.2l-1.2 1.2a1 1 0 0 0 1.4 1.4l1.5-1.5c.2-.2.3-.4.3-.7V6.2a1 1 0 0 0-1-1Z" />
      </svg>
    );
  }
  if (icon === "zap") {
    return (
      <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-[#22d3ff]" aria-hidden="true">
        <path fill="currentColor" d="M11.5 1.8 4.6 10h3.8l-1.3 8.2 8-9.6h-4L11.5 1.8Z" />
      </svg>
    );
  }
  if (icon === "headphones") {
    return (
      <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-[#22d3ff]" aria-hidden="true">
        <path fill="currentColor" d="M10 3a7 7 0 0 0-7 7v2.6A2.4 2.4 0 0 0 5.4 15H7a1 1 0 0 0 1-1V9.8a1 1 0 0 0-1-1H5.2a4.8 4.8 0 0 1 9.6 0H13a1 1 0 0 0-1 1V14a1 1 0 0 0 1 1h1.6a2.4 2.4 0 0 0 2.4-2.4V10a7 7 0 0 0-7-7Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-[#22d3ff]" aria-hidden="true">
      <path fill="currentColor" d="M6.7 2.7a1 1 0 0 1 1.4 0l9.2 9.2a1 1 0 0 1 0 1.4l-3 3a1 1 0 0 1-1.4 0L3.7 7.1a1 1 0 0 1 0-1.4l3-3Zm.7 2.1L5.8 6.4l7.8 7.8 1.6-1.6-7.8-7.8ZM6 8.9a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2Z" />
    </svg>
  );
}

export default function HeroSection({ banners }: HeroSectionProps) {
  const heroBanners = banners.length > 0 ? banners : fallbackHeroBanners;
  const [activeIndex, setActiveIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (heroBanners.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroBanners.length);
    }, prefersReducedMotion ? 5600 : 4200);
    return () => window.clearInterval(timer);
  }, [heroBanners.length, prefersReducedMotion]);

  const scrollToCatalog = () => {
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const prevIndex = (activeIndex - 1 + heroBanners.length) % heroBanners.length;
  const nextIndex = (activeIndex + 1) % heroBanners.length;
  const secondNextIndex = (activeIndex + 2) % heroBanners.length;
  const tickerLoop = [...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems];

  return (
    <section className={`relative isolate overflow-hidden ${styles.heroSection}`}>
      {/* Aurora background */}
      <div className={styles.heroAurora} aria-hidden="true" />

      {/* SVG grid + radial mask */}
      <svg className={styles.heroGrid} aria-hidden="true">
        <defs>
          <pattern id="auroraGrid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M48 0 L0 0 0 48" stroke="#00b4ff" strokeWidth="0.5" fill="none" />
          </pattern>
          <radialGradient id="auroraGridMask" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="1" />
          </radialGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#auroraGrid)" />
        <rect width="100%" height="100%" fill="url(#auroraGridMask)" />
      </svg>

      {/* Stars */}
      <div className={styles.heroStars} aria-hidden="true">
        {Array.from({ length: STAR_COUNT }, (_, i) => {
          const starStyle: CSSProperties = {
            left: `${(i * 37) % 100}%`,
            top: `${(i * 73) % 100}%`,
            opacity: 0.3 + (i % 4) * 0.15,
          };
          return <span key={i} className={styles.heroStar} style={starStyle} />;
        })}
      </div>

      {/* Hero content split layout */}
      <div className={styles.heroLayout}>
        {/* LEFT: Copy panel */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, x: -28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.65, ease: [0.16, 1, 0.3, 1] }}
          className={styles.heroCopy}
        >
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            STORE RESMI &amp; TERPERCAYA
          </div>

          <h1 className={styles.heroHeadline}>
            <span className={styles.heroHeadlineLead}>JUAL AKUN</span>
            <span className={styles.heroHeadlineAccent}>FUZEVALO</span>
          </h1>

          <p className={styles.heroLede}>
            Marketplace akun FPS kompetitif dengan garansi hackback 100%. Proses cepat, transaksi aman.
          </p>

          <div className={styles.heroStats}>
            {featureStats.map((stat) => (
              <div key={stat.label} className={styles.heroStat}>
                <div className={styles.heroStatValue}>{stat.value}</div>
                <div className={styles.heroStatLabel}>{stat.label}</div>
              </div>
            ))}
          </div>

          <div className={styles.heroActions}>
            <a
              href="https://wa.me/628881462675"
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.heroActionButton} ${styles.heroActionPrimary}`}
            >
              <WhatsAppGlyph />
              Chat WhatsApp Sekarang
            </a>
            <button
              type="button"
              onClick={scrollToCatalog}
              className={`${styles.heroActionButton} ${styles.heroActionSecondary}`}
            >
              Lihat Katalog →
            </button>
          </div>
        </motion.div>

        {/* RIGHT: Stacked banners */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.72, ease: [0.16, 1, 0.3, 1], delay: prefersReducedMotion ? 0 : 0.08 }}
          className={styles.heroVisualPanel}
        >
          <div className={styles.bannerStack}>
            {heroBanners.length > 2 && (
              <button
                type="button"
                onClick={() => setActiveIndex(secondNextIndex)}
                aria-label="Go to banner 3"
                className={styles.bannerCard3}
              >
                <img src={heroBanners[secondNextIndex].src} alt={heroBanners[secondNextIndex].alt} className="h-full w-full object-cover" />
                <div className={styles.cardShade} />
              </button>
            )}

            {heroBanners.length > 1 && (
              <button
                type="button"
                onClick={() => setActiveIndex(nextIndex)}
                aria-label="Go to banner 2"
                className={styles.bannerCard2}
              >
                <img src={heroBanners[nextIndex].src} alt={heroBanners[nextIndex].alt} className="h-full w-full object-cover" />
                <div className={styles.cardShade} />
              </button>
            )}

            <div className={styles.bannerCard1}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={heroBanners[activeIndex].src}
                  src={heroBanners[activeIndex].src}
                  alt={heroBanners[activeIndex].alt}
                  className="absolute inset-0 h-full w-full object-contain object-center"
                  initial={prefersReducedMotion ? false : { opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98 }}
                  transition={{ duration: prefersReducedMotion ? 0.2 : 0.55, ease: [0.16, 1, 0.3, 1] }}
                />
              </AnimatePresence>
              <div className={`absolute inset-0 ${styles.bannerScreenGlow}`} />

              <button
                type="button"
                onClick={() => setActiveIndex(prevIndex)}
                aria-label="Show previous banner"
                className="absolute left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#00b4ff]/35 bg-[#030712]/80 text-white/92 shadow-[0_10px_28px_rgba(1,8,20,0.45)] transition hover:border-[#22d3ff] hover:text-[#22d3ff] sm:left-4 sm:h-10 sm:w-10"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                type="button"
                onClick={() => setActiveIndex(nextIndex)}
                aria-label="Show next banner"
                className="absolute right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#00b4ff]/35 bg-[#030712]/80 text-white/92 shadow-[0_10px_28px_rgba(1,8,20,0.45)] transition hover:border-[#22d3ff] hover:text-[#22d3ff] sm:right-4 sm:h-10 sm:w-10"
              >
                <ChevronRight size={18} />
              </button>

              <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#00b4ff]/25 bg-[#030712]/70 px-2.5 py-1.5 backdrop-blur-md sm:bottom-4 sm:px-3 sm:py-2">
                {heroBanners.map((banner, index) => (
                  <button
                    key={banner.src}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Show banner ${index + 1}`}
                    className={`h-2 rounded-full transition-all ${
                      index === activeIndex
                        ? "w-7 bg-[#22d3ff] shadow-[0_0_12px_rgba(34,211,255,0.72)]"
                        : "w-2 bg-white/28"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Ticker */}
      <div className={styles.tickerBar}>
        <div className="hero-shop-mask overflow-hidden py-2.5 sm:py-3">
          <div
            className={`${prefersReducedMotion ? "" : "hero-shop-track"} flex w-max items-center whitespace-nowrap`}
            style={prefersReducedMotion ? undefined : { animationDuration: "28s" }}
          >
            {tickerLoop.map((item, index) => (
              <span key={`${item.label}-${index}`} className={styles.tickerItem}>
                <TickerItemIcon icon={item.icon} />
                <span className={styles.tickerText}>{item.label}</span>
                <span className="ml-1 text-white/14">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
