"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import type { StorefrontBanner } from "@/features/storefront/server";
import styles from "./hero-section.module.css";

interface HeroSectionProps {
  banners: StorefrontBanner[];
  isLiteMode?: boolean;
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
  { icon: "transactions", label: "5000+ TRANSAKSI BERHASIL" },
  { icon: "shield", label: "GARANSI HACKBACK 100%" },
  { icon: "zap", label: "PROSES CEPAT <10 MENIT" },
  { icon: "headphones", label: "CS AKTIF 24/7" },
] as const;

type TickerIconName = (typeof tickerItems)[number]["icon"];

function WhatsAppGlyph({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true">
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

export default function HeroSection({ banners, isLiteMode = false }: HeroSectionProps) {
  const heroBanners = banners.length > 0 ? banners : fallbackHeroBanners;
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (heroBanners.length < 2 || isLiteMode) return;
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % heroBanners.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [heroBanners.length, isLiteMode]);

  const scrollToCatalog = () => {
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const prevIndex = (activeIndex - 1 + heroBanners.length) % heroBanners.length;
  const nextIndex = (activeIndex + 1) % heroBanners.length;
  const tickerLoop = isLiteMode
    ? [...tickerItems, ...tickerItems]
    : [...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems];

  return (
    <section className={`relative isolate overflow-hidden ${styles.heroSection} ${isLiteMode ? styles.heroSectionLite : ""}`}>
      {/* Layered beam composition — Types A (wide glow), B (medium core), C (thin bloom), D (broken) */}
      {!isLiteMode && (
        <div className={styles.heroBackdrop} aria-hidden="true">
          {/* Type A — wide blurred cyan glows */}
          <span className={`${styles.beamA} ${styles.beamA1}`} />
          <span className={`${styles.beamA} ${styles.beamA2}`} />
          <span className={`${styles.beamA} ${styles.beamA3}`} />
          {/* Type B — medium beams with visible cyan cores */}
          <span className={`${styles.beamB} ${styles.beamB1}`} />
          <span className={`${styles.beamB} ${styles.beamB2}`} />
          <span className={`${styles.beamB} ${styles.beamB3}`} />
          {/* Type C — ultra thin white highlights with strong bloom */}
          <span className={`${styles.beamC} ${styles.beamC1}`} />
          <span className={`${styles.beamC} ${styles.beamC2}`} />
          <span className={`${styles.beamC} ${styles.beamC3}`} />
          {/* Type D — broken beams (visible in fragments) */}
          <span className={`${styles.beamD} ${styles.beamD1}`} />
          <span className={`${styles.beamD} ${styles.beamD2}`} />
        </div>
      )}

      {/* Hero content split layout */}
      <div className={styles.heroLayout}>
        {/* LEFT: Copy panel */}
        <motion.div
          initial={isLiteMode ? false : { opacity: 0, x: -28 }}
          animate={isLiteMode ? undefined : { opacity: 1, x: 0 }}
          transition={isLiteMode ? undefined : { duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className={styles.heroCopy}
        >
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            STORE RESMI &amp; TERPERCAYA
          </div>

          <h1 className={styles.heroHeadline}>
            <span className={styles.heroHeadlineLead}>JUAL BELI AKUN</span>
            <span className={styles.heroHeadlineAccent}>VALORANT</span>
            <span className="sr-only"> Murah & Bergaransi</span>
          </h1>

          <p className={styles.heroLede}>
            Jual beli akun Valorant murah, aman, dan bergaransi. Katalog ready sesuai budget, proses cepat, dan garansi hackback 100%.
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
              Jual Akun Sekarang
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
          initial={isLiteMode ? false : { opacity: 0, x: 32 }}
          animate={isLiteMode ? undefined : { opacity: 1, x: 0 }}
          transition={isLiteMode ? undefined : { duration: 0.72, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
          className={styles.heroVisualPanel}
        >
          <div className={styles.bannerStack}>
            <div className={styles.bannerCard1}>
              {isLiteMode ? (
                <img
                  src={heroBanners[activeIndex].src}
                  alt={heroBanners[activeIndex].alt}
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
              ) : (
                <motion.img
                  key={heroBanners[activeIndex].src}
                  src={heroBanners[activeIndex].src}
                  alt={heroBanners[activeIndex].alt}
                  className="absolute inset-0 h-full w-full object-cover object-center"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
              <div className={`absolute inset-0 ${styles.bannerScreenGlow}`} />

              <button
                type="button"
                onClick={() => setActiveIndex(prevIndex)}
                aria-label="Show previous banner"
                className={`${styles.bannerNav} ${styles.bannerNavPrev}`}
              >
                <ChevronLeft size={18} />
              </button>

              <button
                type="button"
                onClick={() => setActiveIndex(nextIndex)}
                aria-label="Show next banner"
                className={`${styles.bannerNav} ${styles.bannerNavNext}`}
              >
                <ChevronRight size={18} />
              </button>

              <div className={styles.bannerDots}>
                {heroBanners.map((banner, index) => (
                  <button
                    key={banner.src}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Show banner ${index + 1}`}
                    className={`${styles.bannerDot} ${index === activeIndex ? styles.bannerDotActive : ""}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Ticker */}
      <div className={styles.tickerBar}>
        {/* ponytail: drop mask on lite so mask + animating child doesn't trigger per-frame recomposite on iOS. Animation itself (translateX) is cheap. */}
        <div className={`${isLiteMode ? "" : "hero-shop-mask"} overflow-hidden py-4 sm:py-5`}>
          <div
            className="hero-shop-track flex w-max items-center whitespace-nowrap"
            style={{ animationDuration: "28s" }}
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
