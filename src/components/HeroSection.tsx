import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ShieldCheck, Sparkles, Zap } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import pinkBanner from "@/assets/banner/pink.webp";
import redBanner from "@/assets/banner/red.webp";
import yellowBanner from "@/assets/banner/yellow.webp";

const banners = [
  { src: pinkBanner, alt: "Fuzevalo banner pink edition" },
  { src: redBanner, alt: "Fuzevalo banner red edition" },
  { src: yellowBanner, alt: "Fuzevalo banner yellow edition" },
];

const trustPoints = [
  { label: "Updated Stock", icon: Sparkles },
  { label: "Fast Delivery", icon: Zap },
  { label: "Secure Deal", icon: ShieldCheck },
];

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

  return (
    <section className="relative overflow-hidden">
      {/* Background */}
      <img
        src={heroBg}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        width={1920}
        height={960}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/65" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(187 100% 50% / 0.1) 2px, hsl(187 100% 50% / 0.1) 4px)",
        }}
      />
      <div className="absolute left-[-12%] top-[12%] h-64 w-64 rounded-full bg-primary/12 blur-3xl" />
      <div className="absolute bottom-[-12%] right-[8%] h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

      {/* Main grid */}
      <div
        className="relative z-10 container mx-auto px-4 pb-24 pt-14 md:pt-16"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "3rem",
          minHeight: "82vh",
          alignItems: "center",
        }}
      >
        {/* LEFT: Text */}
        <motion.div
          className="flex flex-col items-start"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-5 flex items-center gap-3">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/60" />
            <span className="font-display text-xs font-semibold tracking-[0.4em] text-primary/80">
              TRUSTED MARKETPLACE
            </span>
          </div>

          <h1 className="font-display text-5xl font-bold leading-[0.95] tracking-[0.08em] text-foreground md:text-7xl">
            PREMIUM
            <br />
            <span className="text-primary text-glow">VALORANT</span>
            <br />
            ACCOUNTS
          </h1>

          <p className="mt-5 max-w-lg text-sm leading-7 text-muted-foreground md:text-base">
            Curated collection of verified accounts for players who want fast checkout, clean stock,
            and a storefront that feels active every time they land here.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={scrollToCatalog}
              className="rounded-lg bg-primary/10 px-4 py-2 font-display text-[10px] tracking-[0.3em] text-primary transition-all hover:bg-primary hover:text-primary-foreground"
            >
              BROWSE CATALOG
            </button>
            <span className="rounded-lg border border-border/40 bg-background/40 px-4 py-2 font-display text-[10px] tracking-[0.3em] text-muted-foreground backdrop-blur-sm">
              LIVE STOCK PREVIEW
            </span>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {trustPoints.map(({ label, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-full border border-border/30 bg-background/35 px-3 py-2 backdrop-blur-sm"
              >
                <Icon size={14} className="text-primary" />
                <span className="font-display text-[10px] tracking-[0.22em] text-foreground/85">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT: Banner carousel */}
        <motion.div
          className="relative flex items-center justify-center overflow-hidden py-12"
          style={{ minHeight: "520px" }}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          {/* PREV — peeks from left edge */}
          <motion.div
            key={`prev-${prevIndex}`}
            className="absolute left-0 top-1/2 z-0 w-[38%] -translate-y-1/2 cursor-pointer overflow-hidden rounded-[20px] border border-border/20 bg-card/60 shadow-xl"
            animate={{ x: "-30%", scale: 0.84, opacity: 0.45, rotate: -5 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setActiveIndex(prevIndex)}
          >
            <img
              src={banners[prevIndex].src}
              alt={banners[prevIndex].alt}
              className="aspect-[3/4] w-full object-cover"
            />
            <div className="absolute inset-0 bg-background/50" />
          </motion.div>

          {/* ACTIVE — centered */}
          <div className="relative z-10 w-[72%] overflow-hidden rounded-[28px] border border-primary/20 bg-card/80 p-2.5 shadow-[0_0_40px_hsl(187_100%_50%_/_0.15)] backdrop-blur-md">
            <div className="relative overflow-hidden rounded-[20px] border border-border/20 bg-background/40">
              <AnimatePresence mode="wait">
                <motion.img
                  key={banners[activeIndex].src}
                  src={banners[activeIndex].src}
                  alt={banners[activeIndex].alt}
                  className="aspect-[3/4] w-full object-cover"
                  initial={{ opacity: 0, scale: 1.04, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -16 }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                />
              </AnimatePresence>

              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-4">
                <div>
                  <p className="font-display text-[10px] tracking-[0.3em] text-primary/80">
                    FUZEVALO DROP
                  </p>
                  <p className="mt-1 font-display text-base font-bold tracking-[0.14em] text-foreground">
                    LIVE BANNER ROTATION
                  </p>
                </div>
                <div className="flex gap-2">
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
            </div>
          </div>

          {/* NEXT — peeks from right edge */}
          <motion.div
            key={`next-${nextIndex}`}
            className="absolute right-0 top-1/2 z-0 w-[38%] -translate-y-1/2 cursor-pointer overflow-hidden rounded-[20px] border border-border/20 bg-card/60 shadow-xl"
            animate={{ x: "30%", scale: 0.84, opacity: 0.45, rotate: 5 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => setActiveIndex(nextIndex)}
          >
            <img
              src={banners[nextIndex].src}
              alt={banners[nextIndex].alt}
              className="aspect-[3/4] w-full object-cover"
            />
            <div className="absolute inset-0 bg-background/50" />
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
