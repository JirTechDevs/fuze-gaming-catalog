"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

interface IntroScreenProps {
  onComplete: () => void;
}

export default function IntroScreen({ onComplete }: IntroScreenProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShow(false);
      window.setTimeout(onComplete, 600);
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <motion.div
            className="absolute h-[400px] w-[400px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, hsl(187 100% 50% / 0.15) 0%, transparent 70%)",
            }}
            animate={{ scale: 1.2, opacity: 1 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
          />

          <motion.div
            className="relative flex flex-col items-center gap-5"
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.img
              src="/images/logo.png"
              alt="Fuzevalo"
              className="h-24 w-24 drop-shadow-[0_0_40px_hsl(187,100%,50%,0.5)]"
              animate={{
                filter: [
                  "drop-shadow(0 0 20px hsl(187,100%,50%,0.3))",
                  "drop-shadow(0 0 40px hsl(187,100%,50%,0.6))",
                  "drop-shadow(0 0 20px hsl(187,100%,50%,0.3))",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.span
              className="font-display text-2xl font-bold tracking-[0.3em] text-foreground"
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              FUZE<span className="text-primary text-glow">VALO</span>
            </motion.span>

            <motion.div
              className="h-[2px] w-24 overflow-hidden rounded-full bg-border/30"
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <motion.div
                className="h-full bg-primary"
                style={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.7, duration: 1, ease: "easeInOut" }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
