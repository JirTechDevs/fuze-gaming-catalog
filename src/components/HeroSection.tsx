import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  const scrollToCatalog = () => {
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative flex min-h-[75vh] items-center justify-center overflow-hidden">
      {/* Background image */}
      <img
        src={heroBg}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        width={1920}
        height={800}
      />

      {/* Dark overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/80" />

      {/* Scan line effect */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(187 100% 50% / 0.1) 2px, hsl(187 100% 50% / 0.1) 4px)",
      }} />

      <div className="relative z-10 flex flex-col items-center gap-8 px-4 text-center">
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="mb-2 flex items-center gap-3">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/60" />
            <span className="font-display text-xs font-semibold tracking-[0.4em] text-primary/80">TRUSTED MARKETPLACE</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/60" />
          </div>

          <h1 className="font-display text-5xl font-bold leading-tight tracking-wider text-foreground md:text-7xl">
            PREMIUM
            <br />
            <span className="text-primary text-glow">VALORANT</span>
            <br />
            ACCOUNTS
          </h1>

          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground md:text-base">
            Curated collection of verified accounts.
            <br className="hidden sm:block" />
            Fast delivery. Secure transactions.
          </p>
        </motion.div>

        <motion.button
          type="button"
          onClick={scrollToCatalog}
          className="group flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <span className="rounded-lg bg-primary/10 px-4 py-2 font-display text-[10px] tracking-[0.3em] text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground">
            BROWSE CATALOG
          </span>
          <ChevronDown size={20} className="animate-bounce text-primary/70 transition-colors group-hover:text-primary" />
        </motion.button>
      </div>

      {/* Bottom edge accent */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
    </section>
  );
};

export default HeroSection;
