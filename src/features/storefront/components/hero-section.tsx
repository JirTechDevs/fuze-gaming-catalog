"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Headphones, Shield, Zap } from "lucide-react";
import type { CSSProperties } from "react";
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

const heroParticles = [
  { left: "6%", top: "18%", size: "0.42rem", duration: "8.5s", delay: "0s", opacity: 0.42 },
  { left: "14%", top: "58%", size: "0.28rem", duration: "10s", delay: "1.2s", opacity: 0.26 },
  { left: "28%", top: "32%", size: "0.52rem", duration: "7.8s", delay: "0.8s", opacity: 0.4 },
  { left: "44%", top: "74%", size: "0.34rem", duration: "9.2s", delay: "2.1s", opacity: 0.24 },
  { left: "61%", top: "22%", size: "0.46rem", duration: "8.8s", delay: "1.6s", opacity: 0.36 },
  { left: "73%", top: "48%", size: "0.62rem", duration: "11s", delay: "0.4s", opacity: 0.3 },
  { left: "86%", top: "16%", size: "0.32rem", duration: "9.6s", delay: "2.4s", opacity: 0.22 },
  { left: "92%", top: "66%", size: "0.54rem", duration: "8.2s", delay: "1s", opacity: 0.28 },
] as const;

type TickerIconName = (typeof trustTicker)[number]["icon"];

function WhatsAppGlyph() {
  return (
    <svg viewBox="0 0 32 32" className="h-[18px] w-[18px] shrink-0" aria-hidden="true">
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
      <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-[#00C8FF]" aria-hidden="true">
        <path fill="currentColor" d="M10 2.1 16.4 4v5.2c0 4-2.5 6.7-6.4 8.7-3.9-2-6.4-4.7-6.4-8.7V4L10 2.1Zm0 3.1a1 1 0 0 0-1 1v3.2l-1.2 1.2a1 1 0 0 0 1.4 1.4l1.5-1.5c.2-.2.3-.4.3-.7V6.2a1 1 0 0 0-1-1Z" />
      </svg>
    );
  }
  if (icon === "zap") {
    return (
      <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-[#00C8FF]" aria-hidden="true">
        <path fill="currentColor" d="M11.5 1.8 4.6 10h3.8l-1.3 8.2 8-9.6h-4L11.5 1.8Z" />
      </svg>
    );
  }
  if (icon === "headphones") {
    return (
      <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-[#00C8FF]" aria-hidden="true">
        <path fill="currentColor" d="M10 3a7 7 0 0 0-7 7v2.6A2.4 2.4 0 0 0 5.4 15H7a1 1 0 0 0 1-1V9.8a1 1 0 0 0-1-1H5.2a4.8 4.8 0 0 1 9.6 0H13a1 1 0 0 0-1 1V14a1 1 0 0 0 1 1h1.6a2.4 2.4 0 0 0 2.4-2.4V10a7 7 0 0 0-7-7Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-[#00C8FF]" aria-hidden="true">
      <path fill="currentColor" d="M6.7 2.7a1 1 0 0 1 1.4 0l9.2 9.2a1 1 0 0 1 0 1.4l-3 3a1 1 0 0 1-1.4 0L3.7 7.1a1 1 0 0 1 0-1.4l3-3Zm.7 2.1L5.8 6.4l7.8 7.8 1.6-1.6-7.8-7.8ZM6 8.9a1.1 1.1 0 1 0 0-2.2 1.1 1.1 0 0 0 0 2.2Z" />
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
  const tickerItems = [...trustTicker, ...trustTicker, ...trustTicker, ...trustTicker];

  return (
    <section className="relative isolate overflow-hidden">
      <div className={`absolute inset-0 ${styles.heroShell}`} />
      <div className={`absolute inset-0 ${styles.heroAurora}`} />
      <div className={`absolute inset-0 ${styles.heroAmbientGlow}`} />
      <div className={`absolute inset-0 ${styles.heroTechLines}`} />
      <div className={`absolute inset-0 ${styles.heroParticlesLayer}`} aria-hidden="true">
        {heroParticles.map((particle, index) => {
          const particleStyle = {
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
            opacity: particle.opacity,
            animationDuration: prefersReducedMotion ? undefined : particle.duration,
            animationDelay: prefersReducedMotion ? undefined : particle.delay,
          } satisfies CSSProperties;

          return <span key={index} className={styles.heroParticle} style={particleStyle} />;
        })}
      </div>
      <div className={`absolute inset-y-0 left-0 w-[42%] ${styles.heroCopyGlow}`} />
      <div className={`absolute inset-x-0 bottom-0 h-28 ${styles.heroBottomFade}`} />
      <div className={`pointer-events-none absolute -left-16 top-20 hidden h-56 w-56 lg:block ${styles.heroReticleLeft}`} />
      <div className={`pointer-events-none absolute right-10 top-10 hidden h-40 w-40 xl:block ${styles.heroReticleRight}`} />

      <div className={`relative z-10 mx-auto max-w-[1512px] px-4 pb-8 pt-6 sm:px-6 sm:pb-10 sm:pt-8 xl:px-8 ${styles.heroLayout}`}>

        {/* LEFT: Copy panel */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, x: -28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.65, ease: [0.16, 1, 0.3, 1] }}
          className={`relative flex w-full min-w-0 flex-col gap-6 rounded-[12px] border border-white/[0.08] bg-[#0A1128]/90 px-5 py-6 shadow-[0_20px_48px_rgba(1,8,22,0.24)] backdrop-blur-sm sm:px-6 lg:max-w-none lg:border-transparent lg:bg-transparent lg:px-0 lg:py-0 lg:shadow-none lg:backdrop-blur-none ${styles.heroCopyPanel}`}
        >
          <div className={styles.heroCopyDetailTop} aria-hidden="true" />
          <div className={styles.heroCopyDetailBottom} aria-hidden="true" />

          <div className="flex">
            <span className={`${styles.heroTrustBadge} inline-flex items-center gap-2 rounded-full px-4 py-2 font-display text-[10px] font-bold tracking-[0.14em] text-[#8CDFFF] sm:text-[11px]`}>
              <Shield size={13} />
              STORE RESMI & TERPERCAYA
            </span>
          </div>

          <div className="space-y-3">
            <h1 className={styles.heroHeadline}>
              <span className={styles.heroHeadlineLead}>JUAL AKUN</span>
              <span className={styles.heroHeadlineAccent}>VALORANT</span>
            </h1>
          </div>

          <div className={styles.heroStats}>
            {featureBadges.map((badge) => (
              <div
                key={badge.label}
                className={styles.heroStat}
              >
                <div className="flex items-start gap-1">
                  <badge.icon size={11} strokeWidth={2.1} className="mt-0.5 shrink-0 text-[#22D3EE]" />
                  <p className="font-display text-[0.84rem] font-bold leading-[0.92] text-white sm:text-[0.95rem] xl:text-[1.02rem]">
                    {badge.value}
                  </p>
                </div>
                <p className="mt-0.5 break-words text-[8px] leading-[1.15] tracking-[0.01em] text-white/64 sm:text-[8.5px] xl:text-[9px]">
                  {badge.label}
                </p>
              </div>
            ))}
          </div>

          <div className={styles.heroActions}>
            <button
              type="button"
              onClick={scrollToCatalog}
              className={`${styles.heroActionButton} inline-flex min-h-[54px] items-center justify-center rounded-[10px] border border-[#00C8FF]/18 bg-[#0D1530] px-6 py-3.5 text-center font-display text-[13px] font-semibold tracking-[0.02em] text-white shadow-[0_0_20px_rgba(0,200,255,0.06)] transition hover:border-[#00C8FF]/34 hover:text-[#8CDFFF]`}
            >
              Lihat Katalog
            </button>
            <a
              href="https://wa.me/628881462675"
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.heroActionButton} inline-flex min-h-[54px] items-center justify-center gap-2 rounded-[10px] bg-[#22C55E] px-5 py-3.5 text-center font-display text-[13px] font-semibold leading-none whitespace-nowrap tracking-[0.02em] text-white shadow-[0_12px_24px_rgba(34,197,94,0.24)] transition hover:brightness-105`}
            >
              <WhatsAppGlyph />
              Chat WhatsApp
            </a>
          </div>
        </motion.div>

        {/* RIGHT: Stacked banners */}
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.72, ease: [0.16, 1, 0.3, 1], delay: prefersReducedMotion ? 0 : 0.08 }}
          className={`relative flex min-w-0 items-center ${styles.heroVisualPanel}`}
        >
          {/*
            The front card defines the visible size.
            Card 2 and card 3 then sit to the right as preview layers.
          */}
          <div className={styles.bannerStack}>

            {/* Card 3 — furthest back, right-most preview */}
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

            {/* Card 2 — middle preview */}
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

            {/* Card 1 — front, full size, active */}
            <div className={styles.bannerCard1}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={heroBanners[activeIndex].src}
                  src={heroBanners[activeIndex].src}
                  alt={heroBanners[activeIndex].alt}
                  className="absolute inset-0 h-full w-full object-cover object-center"
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
                className="absolute left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#0EA5E9]/30 bg-[#041C32]/92 text-white/92 shadow-[0_10px_28px_rgba(1,8,20,0.45)] transition hover:border-[#22D3EE] hover:text-[#00E5FF] sm:left-4 sm:h-10 sm:w-10"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                type="button"
                onClick={() => setActiveIndex(nextIndex)}
                aria-label="Show next banner"
                className="absolute right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[#0EA5E9]/30 bg-[#041C32]/92 text-white/92 shadow-[0_10px_28px_rgba(1,8,20,0.45)] transition hover:border-[#22D3EE] hover:text-[#00E5FF] sm:right-4 sm:h-10 sm:w-10"
              >
                <ChevronRight size={18} />
              </button>

              <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#0EA5E9]/16 bg-[#041C32]/68 px-2.5 py-1.5 backdrop-blur-md sm:bottom-4 sm:px-3 sm:py-2">
                {heroBanners.map((banner, index) => (
                  <button
                    key={banner.src}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Show banner ${index + 1}`}
                    className={`h-2 rounded-full transition-all ${
                      index === activeIndex
                        ? "w-7 bg-[#22D3EE] shadow-[0_0_12px_rgba(0,229,255,0.72)]"
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
      <div className={`relative z-10 border-y border-white/[0.07] ${styles.tickerBar}`}>
        <div className="hero-shop-mask overflow-hidden py-3 sm:py-3.5">
          <div
            className={`${prefersReducedMotion ? "" : "hero-shop-track"} flex w-max items-center whitespace-nowrap`}
            style={prefersReducedMotion ? undefined : { animationDuration: "28s" }}
          >
            {tickerItems.map((item, index) => (
              <span key={`${item.label}-${index}`} className="inline-flex items-center gap-3 px-5 sm:px-6">
                <TickerItemIcon icon={item.icon} />
                <span className="font-display text-[13px] font-semibold tracking-[0.06em] text-white">
                  {item.label}
                </span>
                <span className="ml-1 text-white/14">•</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
