import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import pinkBanner from "@/assets/banner/pink.webp";
import redBanner from "@/assets/banner/red.webp";
import yellowBanner from "@/assets/banner/yellow.webp";

const banners = [
  { src: pinkBanner, alt: "Fuzevalo banner pink edition" },
  { src: redBanner, alt: "Fuzevalo banner red edition" },
  { src: yellowBanner, alt: "Fuzevalo banner yellow edition" },
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
];

const tacticalLines = [
  { position: "left-[18%] top-[30%]", width: "w-24", delay: 0.2 },
  { position: "right-[17%] top-[42%]", width: "w-20", delay: 0.9 },
  { position: "left-[24%] bottom-[26%]", width: "w-16", delay: 1.1 },
  { position: "right-[22%] bottom-[30%]", width: "w-28", delay: 0.4 },
];

const ConsoleCluster = () => (
  <svg viewBox="0 0 120 120" className="h-full w-full" aria-hidden="true">
    <circle cx="28" cy="28" r="12" fill="none" stroke="currentColor" strokeWidth="3" />
    <rect x="64" y="16" width="24" height="24" rx="4" fill="none" stroke="currentColor" strokeWidth="3" />
    <path d="M22 82 L34 70 L46 82 L34 94 Z" fill="none" stroke="currentColor" strokeWidth="3" />
    <path d="M74 74 L92 92 M92 74 L74 92" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <circle cx="60" cy="60" r="44" fill="none" stroke="currentColor" strokeOpacity="0.3" strokeWidth="1.5" strokeDasharray="4 8" />
  </svg>
);

const TacticalCrosshair = () => (
  <svg viewBox="0 0 140 140" className="h-full w-full" aria-hidden="true">
    <circle cx="70" cy="70" r="34" fill="none" stroke="currentColor" strokeWidth="2.5" />
    <circle cx="70" cy="70" r="54" fill="none" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="6 10" />
    <path d="M70 8 V34 M70 106 V132 M8 70 H34 M106 70 H132" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <path d="M48 70 H60 M80 70 H92 M70 48 V60 M70 80 V92" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="70" cy="70" r="6" fill="currentColor" />
  </svg>
);

const TacticalRadar = () => (
  <svg viewBox="0 0 160 120" className="h-full w-full" aria-hidden="true">
    <path d="M18 100 Q44 18 132 18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M28 100 Q52 34 122 34" fill="none" stroke="currentColor" strokeOpacity="0.7" strokeWidth="2" strokeLinecap="round" />
    <path d="M38 100 Q60 48 112 48" fill="none" stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="104" cy="40" r="4" fill="currentColor" />
    <path d="M18 100 H144" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="5 8" />
    <path d="M18 100 L50 68" stroke="currentColor" strokeOpacity="0.4" strokeWidth="1.5" />
  </svg>
);

const DPadPanel = () => (
  <svg viewBox="0 0 150 120" className="h-full w-full" aria-hidden="true">
    <rect x="18" y="18" width="114" height="84" rx="18" fill="none" stroke="currentColor" strokeOpacity="0.28" strokeWidth="2" />
    <path d="M56 40 H70 V26 H80 V40 H94 V50 H80 V64 H70 V50 H56 Z" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
    <circle cx="102" cy="44" r="7" fill="none" stroke="currentColor" strokeWidth="2.4" />
    <rect x="95" y="58" width="14" height="14" rx="3" fill="none" stroke="currentColor" strokeWidth="2.4" />
    <path d="M98 90 H118" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    <path d="M32 82 H72" stroke="currentColor" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" />
    <path d="M32 90 H62" stroke="currentColor" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const HeroSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % banners.length);
    }, 3500);
    return () => window.clearInterval(timer);
  }, []);

  const scrollToCatalog = () => {
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const prevIndex = (activeIndex - 1 + banners.length) % banners.length;
  const nextIndex = (activeIndex + 1) % banners.length;
  const goToPrevious = () => setActiveIndex(prevIndex);
  const goToNext = () => setActiveIndex(nextIndex);

  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(226_50%_6%)_0%,hsl(228_45%_8%)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-transparent to-background/95" />
      <div
        className="absolute inset-0 opacity-95"
        style={{
          backgroundImage: [
            "radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.38) 0%, transparent 21%)",
            "radial-gradient(circle at 50% 50%, hsl(193 100% 85% / 0.2) 0%, transparent 44%)",
            "radial-gradient(circle at 14% 20%, hsl(185 100% 68% / 0.15) 0%, transparent 18%)",
            "radial-gradient(circle at 86% 32%, hsl(190 100% 76% / 0.14) 0%, transparent 18%)",
          ].join(", "),
        }}
      />
      <div className="absolute inset-x-0 top-1/2 h-[24rem] -translate-y-1/2 bg-[radial-gradient(ellipse_at_center,hsl(189_100%_72%_/_0.22)_0%,hsl(189_100%_72%_/_0.12)_35%,transparent_72%)] md:h-[34rem]" />
      <div className="absolute inset-0 bg-grid opacity-[0.14] [mask-image:radial-gradient(circle_at_center,black,transparent_86%)]" />
      <div className="absolute left-[-10%] top-[14%] h-56 w-56 rounded-full bg-primary/20 blur-3xl md:h-72 md:w-72" />
      <div className="absolute right-[-8%] top-[18%] h-44 w-44 rounded-full bg-primary/16 blur-3xl md:h-64 md:w-64" />
      <div className="absolute bottom-[-18%] left-[14%] h-48 w-48 rounded-full bg-primary/12 blur-3xl md:h-64 md:w-64" />
      <div className="absolute bottom-[-14%] right-[12%] h-56 w-56 rounded-full bg-primary/14 blur-3xl md:h-72 md:w-72" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,transparent_74%,hsl(var(--background))_100%)]" />

      {consoleOrnaments.map((ornament) => (
        <motion.div
          key={ornament.position}
          className={`pointer-events-none absolute hidden text-primary/55 lg:block ${ornament.position}`}
          style={{ width: ornament.type === "radar" ? 160 : ornament.type === "dpad" ? 150 : 120 }}
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
          <span className="h-1.5 w-1.5 rounded-full bg-primary/80 shadow-[0_0_16px_hsl(var(--primary)_/_0.85)]" />
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
          className="pointer-events-none absolute rounded-full bg-primary/70 shadow-[0_0_18px_hsl(var(--primary)_/_0.7)]"
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

      <div className="relative z-10 container mx-auto px-4 pb-16 pt-16 md:pb-24 md:pt-20">
        {/*
          <motion.div
            className="mx-auto flex max-w-4xl flex-col items-center text-center"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-5 flex items-center gap-3">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/60" />
              <span className="font-display text-xs font-semibold tracking-[0.4em] text-primary/80">
                TRUSTED MARKETPLACE
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/60" />
            </div>

            <h1 className="font-display text-4xl font-bold leading-[0.95] tracking-[0.08em] text-foreground sm:text-5xl md:text-7xl">
              FUZEVALO
              <br />
              <span className="text-primary text-glow">LIVE GLOW</span>
              <br />
              SHOWCASE
            </h1>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-foreground/72 md:text-base">
              A brighter cyan stage, layered atmosphere, and rotating featured banners give the storefront
              a more active first impression before visitors dive into the catalog.
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={scrollToCatalog}
                className="rounded-full border border-primary/30 bg-primary/12 px-5 py-2.5 font-display text-[10px] tracking-[0.3em] text-primary transition-all hover:bg-primary hover:text-primary-foreground"
              >
                BROWSE CATALOG
              </button>
              <span className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 font-display text-[10px] tracking-[0.3em] text-foreground/70 backdrop-blur-sm">
                FEATURED BANNER STAGE
              </span>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {trustPoints.map(({ label, icon: Icon }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-md"
                >
                  <Icon size={14} className="text-primary" />
                  <span className="font-display text-[10px] tracking-[0.22em] text-foreground/85">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        */}

        <motion.div
          className="relative mx-auto flex w-full max-w-[1180px] items-center justify-center overflow-hidden py-10 md:py-14"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.12 }}
        >
          <motion.div
            key={`prev-${prevIndex}`}
            className="absolute left-0 top-1/2 z-10 hidden w-[280px] -translate-y-1/2 cursor-pointer overflow-hidden rounded-[22px] border border-white/12 bg-white/6 shadow-[0_30px_90px_hsl(225_60%_3%_/_0.42)] backdrop-blur-md lg:block"
            animate={{ x: "-14%", scale: 0.88, opacity: 0.55, rotate: -4 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            onClick={goToPrevious}
          >
            <img
              src={banners[prevIndex].src}
              alt={banners[prevIndex].alt}
              className="aspect-[1840/853] w-full bg-background/70 object-contain"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,hsl(var(--background)_/_0.12),hsl(var(--background)_/_0.52))]" />
          </motion.div>

          <div className="relative z-20 w-full max-w-[920px] overflow-hidden rounded-[28px] border border-primary/25 bg-white/8 shadow-[0_0_60px_hsl(var(--primary)_/_0.24)] backdrop-blur-xl">
            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-background/30">
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

              <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(var(--background)_/_0.02),transparent_32%,hsl(var(--background)_/_0.64)_100%)]" />
              <div className="absolute bottom-0 left-0 right-0 flex flex-wrap items-end justify-between gap-3 p-4 md:p-5">
                <div className="rounded-full border border-white/10 bg-background/35 px-3 py-1.5 backdrop-blur-md">
                  <p className="font-display text-[10px] tracking-[0.3em] text-primary/80">
                    FUZEVALO DROP
                  </p>
                  <p className="mt-1 font-display text-sm font-bold tracking-[0.16em] text-foreground md:text-base">
                    LIVE BANNER ROTATION
                  </p>
                </div>
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

              <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-white/10" />

              <button
                type="button"
                onClick={goToPrevious}
                aria-label="Show previous banner"
                className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-background/50 text-foreground transition hover:bg-primary hover:text-primary-foreground md:left-5"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={goToNext}
                aria-label="Show next banner"
                className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-background/50 text-foreground transition hover:bg-primary hover:text-primary-foreground md:right-5"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <motion.div
            key={`next-${nextIndex}`}
            className="absolute right-0 top-1/2 z-10 hidden w-[280px] -translate-y-1/2 cursor-pointer overflow-hidden rounded-[22px] border border-white/12 bg-white/6 shadow-[0_30px_90px_hsl(225_60%_3%_/_0.42)] backdrop-blur-md lg:block"
            animate={{ x: "14%", scale: 0.88, opacity: 0.55, rotate: 4 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            onClick={goToNext}
          >
            <img
              src={banners[nextIndex].src}
              alt={banners[nextIndex].alt}
              className="aspect-[1840/853] w-full bg-background/70 object-contain"
            />
            <div className="absolute inset-0 bg-[linear-gradient(270deg,hsl(var(--background)_/_0.12),hsl(var(--background)_/_0.52))]" />
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll cue */}
      <motion.button
        type="button"
        onClick={scrollToCatalog}
        className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <span className="font-display text-[10px] tracking-[0.3em] text-primary/70">
          SCROLL FOR CATALOG
        </span>
        <ChevronDown size={20} className="animate-bounce text-primary" />
      </motion.button>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </section>
  );
};

export default HeroSection;
