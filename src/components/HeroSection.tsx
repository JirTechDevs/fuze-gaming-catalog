import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden bg-grid">
      {/* Glow orbs */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-primary/5 blur-[100px]" />

      <div className="relative z-10 flex flex-col items-center gap-6 px-4 text-center">
        <motion.img
          src="/images/logo.png"
          alt="Fuzevalo"
          className="h-28 w-28 drop-shadow-[0_0_30px_hsl(187,100%,50%,0.4)]"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6 }}
        />
        <motion.h1
          className="font-display text-4xl font-bold tracking-widest text-foreground md:text-6xl"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          FUZE<span className="text-primary text-glow">VALO</span>
        </motion.h1>
        <motion.p
          className="max-w-md text-sm text-muted-foreground md:text-base"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Premium Valorant Account Marketplace — Trusted, Fast & Secure
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-4 animate-bounce text-primary/60"
        >
          <ChevronDown size={28} />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
