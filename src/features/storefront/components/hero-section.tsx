"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import styles from "./hero-section.module.css";

const banners = [
  { src: "/images/banners/pink.webp", alt: "Fuzevalo banner pink edition" },
  { src: "/images/banners/red.webp", alt: "Fuzevalo banner red edition" },
  { src: "/images/banners/yellow.webp", alt: "Fuzevalo banner yellow edition" },
];

const particles = [
  { left: "6%", top: "22%", size: 4, delay: 0, duration: 4.2 },
  { left: "12%", top: "72%", size: 2, delay: 0.7, duration: 5.4 },
  { left: "20%", top: "38%", size: 3, delay: 1.3, duration: 5.8 },
  { left: "28%", top: "18%", size: 2, delay: 0.4, duration: 4.8 },
  { left: "34%", top: "66%", size: 4, delay: 1.8, duration: 5.2 },
  { left: "44%", top: "28%", size: 2, delay: 1.1, duration: 6 },
  { left: "55%", top: "76%", size: 3, delay: 2.2, duration: 5.6 },
  { left: "63%", top: "20%", size: 4, delay: 1.5, duration: 4.9 },
  { left: "72%", top: "44%", size: 2, delay: 0.8, duration: 5.7 },
  { left: "81%", top: "68%", size: 3, delay: 2.5, duration: 5.1 },
  { left: "88%", top: "30%", size: 2, delay: 1.9, duration: 4.6 },
  { left: "93%", top: "58%", size: 4, delay: 0.2, duration: 5.3 },
];

const consoleOrnaments = [
  {
    position: "left-[5%] top-[24%]",
    delay: 0,
    duration: 8,
    rotate: -6,
    scale: 1,
    type: "cluster",
  },
  {
    position: "right-[6%] top-[20%]",
    delay: 0.8,
    duration: 9,
    rotate: 7,
    scale: 1.05,
    type: "crosshair",
  },
  {
    position: "left-[10%] bottom-[20%]",
    delay: 1.3,
    duration: 7.2,
    rotate: 4,
    scale: 0.95,
    type: "radar",
  },
  {
    position: "right-[11%] bottom-[17%]",
    delay: 0.5,
    duration: 8.6,
    rotate: -4,
    scale: 0.98,
    type: "dpad",
  },
] as const;

const tacticalLines = [
  { position: "left-[18%] top-[30%]", width: "w-24", delay: 0.2 },
  { position: "right-[17%] top-[42%]", width: "w-20", delay: 0.9 },
  { position: "left-[24%] bottom-[26%]", width: "w-16", delay: 1.1 },
  { position: "right-[22%] bottom-[30%]", width: "w-28", delay: 0.4 },
];

const shopTicker = Array.from({ length: 10 }, (_, index) => ({
  id: index,
  label: "FUZEVALO GAMING SHOP",
}));

const ConsoleCluster = () => (
  <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
    <circle cx="28" cy="28" r="12" fill="none" stroke="currentColor" strokeWidth="3" />
    <rect x="64" y="16" width="24" height="24" rx="4" fill="none" stroke="currentColor" strokeWidth="3" />
    <path d="M22 82 L34 70 L46 82 L34 94 Z" fill="none" stroke="currentColor" strokeWidth="3" />
    <path d="M74 74 L92 92 M92 74 L74 92" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <circle
      cx="60"
      cy="60"
      r="44"
      fill="none"
      stroke="currentColor"
      strokeOpacity="0.3"
      strokeWidth="1.5"
      strokeDasharray="4 8"
    />
  </svg>
);

const TacticalCrosshair = () => (
  <svg viewBox="0 0 140 140" className="h-full w-full" aria-hidden="true">
    <circle cx="70" cy="70" r="34" fill="none" stroke="currentColor" strokeWidth="2.5" />
    <circle
      cx="70"
      cy="70"
      r="54"
      fill="none"
      stroke="currentColor"
      strokeOpacity="0.35"
      strokeWidth="1.5"
      strokeDasharray="6 10"
    />
    <path
      d="M70 8 V34 M70 106 V132 M8 70 H34 M106 70 H132"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M48 70 H60 M80 70 H92 M70 48 V60 M70 80 V92"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="70" cy="70" r="6" fill="currentColor" />
  </svg>
);

const TacticalRadar = () => (
  <svg viewBox="0 0 160 120" className="h-full w-full" aria-hidden="true">
    <path
      d="M18 100 Q44 18 132 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M28 100 Q52 34 122 34"
      fill="none"
      stroke="currentColor"
      strokeOpacity="0.7"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M38 100 Q60 48 112 48"
      fill="none"
      stroke="currentColor"
      strokeOpacity="0.45"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="104" cy="40" r="4" fill="currentColor" />
    <path
      d="M18 100 H144"
      stroke="currentColor"
      strokeOpacity="0.35"
      strokeWidth="1.5"
      strokeDasharray="5 8"
    />
    <path d="M18 100 L50 68" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.5" />
  </svg>
);

const DPadPanel = () => (
  <svg viewBox="0 0 150 120" className="h-full w-full" aria-hidden="true">
    <rect
      x="18"
      y="18"
      width="114"
      height="84"
      rx="18"
      fill="none"
      stroke="currentColor"
      strokeOpacity="0.28"
      strokeWidth="2"
    />
    <path
      d="M56 40 H70 V26 H80 V40 H94 V50 H80 V64 H70 V50 H56 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    <circle cx="102" cy="44" r="7" fill="none" stroke="currentColor" strokeWidth="2.4" />
    <rect x="95" y="58" width="14" height="14" rx="3" fill="none" stroke="currentColor" strokeWidth="2.4" />
    <path d="M98 90 H118" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M32 82 H72" stroke="currentColor" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" />
    <path d="M32 90 H62" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % banners.length);
    }, 3500);

    return () => window.clearInterval(timer);
  }, []);

  const scrollToCatalog = () => {
    document
      .getElementById("catalog")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const prevIndex = (activeIndex - 1 + banners.length) % banners.length;
  const nextIndex = (activeIndex + 1) % banners.length;
  const goToPrevious = () => setActiveIndex(prevIndex);
  const goToNext = () => setActiveIndex(nextIndex);

  return (
    <section className="relative isolate overflow-hidden">
      <div className={`absolute inset-0 ${styles.heroShell}`} />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      <div className={`absolute inset-0 ${styles.heroSideFade}`} />
      <div className={`absolute inset-0 opacity-95 ${styles.heroHalo}`} />
      <div className={`absolute inset-x-0 top-1/2 h-[24rem] -translate-y-1/2 md:h-[34rem] ${styles.heroCenterGlow}`} />
      <div className={`absolute inset-0 bg-grid opacity-[0.14] ${styles.heroGridMask}`} />
      <div className={`absolute h-56 w-56 rounded-full bg-primary/20 blur-3xl md:h-72 md:w-72 ${styles.orbTopLeft}`} />
      <div className={`absolute h-44 w-44 rounded-full bg-primary/16 blur-3xl md:h-64 md:w-64 ${styles.orbTopRight}`} />
      <div className={`absolute h-48 w-48 rounded-full bg-primary/12 blur-3xl md:h-64 md:w-64 ${styles.orbBottomLeft}`} />
      <div className={`absolute h-56 w-56 rounded-full bg-primary/14 blur-3xl md:h-72 md:w-72 ${styles.orbBottomRight}`} />
      <div className={`absolute inset-0 ${styles.heroBottomFade}`} />

      {consoleOrnaments.map((ornament) => (
        <motion.div
          key={ornament.position}
          className={`pointer-events-none absolute hidden text-primary/55 lg:block ${ornament.position}`}
          style={{
            width:
              ornament.type === "radar"
                ? 160
                : ornament.type === "dpad"
                  ? 150
                  : 120,
          }}
          initial={{ opacity: 0.18, scale: ornament.scale, rotate: ornament.rotate }}
          animate={{
            opacity: [0.2, 0.52, 0.24],
            y: [0, -10, 0],
            rotate: [ornament.rotate, ornament.rotate + 2, ornament.rotate],
          }}
          transition={{
            duration: ornament.duration,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: ornament.delay,
          }}
        >
          {ornament.type === "cluster" && <ConsoleCluster />}
          {ornament.type === "crosshair" && <TacticalCrosshair />}
          {ornament.type === "radar" && <TacticalRadar />}
          {ornament.type === "dpad" && <DPadPanel />}
        </motion.div>
      ))}

      {tacticalLines.map((line) => (
        <motion.div
          key={line.position}
          className={`pointer-events-none absolute hidden items-center gap-2 lg:flex ${line.position}`}
          animate={{ opacity: [0.2, 0.55, 0.22], x: [0, 8, 0] }}
          transition={{
            duration: 4.8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: line.delay,
          }}
        >
          <span className={`h-1.5 w-1.5 rounded-full bg-primary/80 ${styles.ornamentDot}`} />
          <span className={`h-px ${line.width} bg-gradient-to-r from-primary/60 to-transparent`} />
        </motion.div>
      ))}

      <motion.div
        className="pointer-events-none absolute left-[14%] top-1/2 hidden h-24 w-24 -translate-y-1/2 rounded-full border border-primary/18 lg:block"
        animate={{ rotate: [0, 360], opacity: [0.18, 0.32, 0.18] }}
        transition={{ duration: 18, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      >
        <div className="absolute inset-3 rounded-full border border-primary/20 border-dashed" />
        <div className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-primary/60" />
        <div className="absolute bottom-0 left-1/2 h-3 w-px -translate-x-1/2 bg-primary/30" />
      </motion.div>

      <motion.div
        className="pointer-events-none absolute right-[15%] top-1/2 hidden h-28 w-28 -translate-y-1/2 lg:block"
        animate={{ rotate: [0, -360], opacity: [0.15, 0.28, 0.15] }}
        transition={{ duration: 22, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      >
        <div className="absolute inset-0 rounded-full border border-primary/16" />
        <div className="absolute inset-4 rounded-full border border-primary/18 border-dashed" />
        <div className="absolute left-1/2 top-2 h-[calc(50%-0.5rem)] w-px -translate-x-1/2 bg-primary/40" />
      </motion.div>

      {particles.map((particle) => (
        <motion.span
          key={`${particle.left}-${particle.top}`}
          className={`pointer-events-none absolute rounded-full bg-primary/70 ${styles.particle}`}
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
          }}
          animate={{ opacity: [0.18, 0.85, 0.25], y: [0, -14, 0], scale: [1, 1.35, 0.92] }}
          transition={{
            duration: particle.duration,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: particle.delay,
          }}
        />
      ))}

      <div className="relative z-10 container mx-auto px-4 pb-10 pt-10 sm:pb-14 sm:pt-12 md:pb-20 md:pt-16 lg:pb-24 lg:pt-20">
        <motion.div
          className="relative mx-auto flex w-full max-w-[1400px] flex-col items-center justify-center overflow-visible py-4 sm:py-8 md:py-12"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
        >
          <motion.div
            key={`prev-${prevIndex}`}
            className={`absolute left-0 top-1/2 z-10 hidden w-[440px] -translate-y-1/2 cursor-pointer overflow-hidden rounded-[22px] border border-white/12 bg-white/6 backdrop-blur-md lg:block ${styles.bannerSideCard}`}
            animate={{ x: "-7%", scale: 0.94, opacity: 0.66, rotate: -4 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            onClick={goToPrevious}
          >
            <img
              src={banners[prevIndex].src}
              alt={banners[prevIndex].alt}
              className="aspect-[1840/853] w-full bg-background/70 object-contain"
            />
            <div className={`absolute inset-0 ${styles.bannerSideOverlayLeft}`} />
          </motion.div>

          <div className={`relative z-20 w-full max-w-[920px] overflow-hidden rounded-[22px] border border-primary/25 bg-white/8 backdrop-blur-xl sm:rounded-[28px] ${styles.bannerStage}`}>
            <div className="relative overflow-hidden rounded-[22px] border border-white/10 bg-background/30 sm:rounded-[28px]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={banners[activeIndex].src}
                  src={banners[activeIndex].src}
                  alt={banners[activeIndex].alt}
                  className="aspect-[1840/853] w-full bg-background/70 object-contain"
                  initial={{ opacity: 0, scale: 1.035, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.985, y: -12 }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                />
              </AnimatePresence>

              <div className={`absolute inset-0 ${styles.bannerStageTop}`} />
              <div className="absolute bottom-0 left-0 right-0 flex flex-wrap items-end justify-between gap-3 p-3 sm:p-4 md:p-5">
                <div className="flex gap-2 rounded-full border border-white/10 bg-background/35 px-3 py-2 backdrop-blur-md">
                  {banners.map((banner, index) => (
                    <button
                      key={banner.src}
                      type="button"
                      onClick={() => setActiveIndex(index)}
                      aria-label={`Show banner ${index + 1}`}
                      className={`h-2 rounded-full transition-all ${
                        index === activeIndex ? "w-6 bg-primary" : "w-2 bg-foreground/30"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="pointer-events-none absolute inset-0 rounded-[22px] ring-1 ring-white/10 sm:rounded-[28px]" />

              <button
                type="button"
                onClick={goToPrevious}
                aria-label="Show previous banner"
                className="absolute left-2.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-background/55 text-foreground transition hover:bg-primary hover:text-primary-foreground sm:left-3 sm:h-10 sm:w-10 md:left-5 md:h-11 md:w-11"
              >
                <ChevronLeft size={18} className="sm:h-5 sm:w-5" />
              </button>
              <button
                type="button"
                onClick={goToNext}
                aria-label="Show next banner"
                className="absolute right-2.5 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-background/55 text-foreground transition hover:bg-primary hover:text-primary-foreground sm:right-3 sm:h-10 sm:w-10 md:right-5 md:h-11 md:w-11"
              >
                <ChevronRight size={18} className="sm:h-5 sm:w-5" />
              </button>
            </div>
          </div>

          <motion.div
            key={`next-${nextIndex}`}
            className={`absolute right-0 top-1/2 z-10 hidden w-[440px] -translate-y-1/2 cursor-pointer overflow-hidden rounded-[22px] border border-white/12 bg-white/6 backdrop-blur-md lg:block ${styles.bannerSideCard}`}
            animate={{ x: "7%", scale: 0.94, opacity: 0.66, rotate: 4 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            onClick={goToNext}
          >
            <img
              src={banners[nextIndex].src}
              alt={banners[nextIndex].alt}
              className="aspect-[1840/853] w-full bg-background/70 object-contain"
            />
            <div className={`absolute inset-0 ${styles.bannerSideOverlayRight}`} />
          </motion.div>
        </motion.div>
      </div>

      <div className="px-4 pb-10 md:hidden">
        <motion.button
          type="button"
          onClick={scrollToCatalog}
          className="mx-auto flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <span className={`font-display text-[10px] tracking-[0.26em] text-primary/70 ${styles.scrollLabel}`}>
            SCROLL FOR CATALOG
          </span>
          <ChevronDown size={18} className="animate-bounce text-primary" />
        </motion.button>

        <div className="mt-5 w-full">
          <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <div className="hero-shop-mask overflow-hidden py-3">
            <div className="hero-shop-track flex w-max items-center gap-6 whitespace-nowrap">
              {[...shopTicker, ...shopTicker].map((item, index) => (
                <span
                  key={`${item.id}-${index}`}
                  className="font-display text-xs tracking-[0.34em] text-primary/72"
                >
                  {item.label}
                </span>
              ))}
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </div>
      </div>

      <div className="absolute bottom-6 left-0 right-0 z-10 hidden flex-col items-center gap-6 md:flex">
        <motion.button
          type="button"
          onClick={scrollToCatalog}
          className="flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <span className={`font-display text-[10px] tracking-[0.3em] text-primary/70 ${styles.scrollLabel}`}>
            SCROLL FOR CATALOG
          </span>
          <ChevronDown size={20} className="animate-bounce text-primary" />
        </motion.button>

        <div className="w-full">
          <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <div className="hero-shop-mask overflow-hidden py-4">
            <div className="hero-shop-track flex w-max items-center gap-8 whitespace-nowrap">
              {[...shopTicker, ...shopTicker].map((item, index) => (
                <span
                  key={`${item.id}-${index}`}
                  className="font-display text-sm tracking-[0.5em] text-primary/72"
                >
                  {item.label}
                </span>
              ))}
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        </div>
      </div>
    </section>
  );
}
