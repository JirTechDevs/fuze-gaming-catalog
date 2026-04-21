"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import styles from "./intro-screen.module.css";

interface IntroScreenProps {
  onComplete: () => void;
}

export default function IntroScreen({ onComplete }: IntroScreenProps) {
  const [show, setShow] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShow(false);
      window.setTimeout(onComplete, 400);
    }, 1200);

    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <motion.div
            className={`absolute h-[280px] w-[280px] rounded-full sm:h-[400px] sm:w-[400px] ${styles.introRadialGlow}`}
            animate={prefersReducedMotion ? { scale: 1, opacity: 0.9 } : { scale: 1.2, opacity: 1 }}
            transition={{ duration: prefersReducedMotion ? 0.2 : 1.4, ease: "easeOut" }}
          />

          <motion.div
            className="relative flex flex-col items-center gap-4 px-6 text-center sm:gap-5"
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.img
              src="/images/logo.png"
              alt="Fuzevalo"
              className={`h-20 w-20 sm:h-24 sm:w-24 ${styles.introLogo}`}
              animate={
                prefersReducedMotion
                  ? undefined
                  : {
                      filter: [
                        "drop-shadow(0 0 20px hsl(187,100%,50%,0.3))",
                        "drop-shadow(0 0 40px hsl(187,100%,50%,0.6))",
                        "drop-shadow(0 0 20px hsl(187,100%,50%,0.3))",
                      ],
                    }
              }
              transition={
                prefersReducedMotion
                  ? undefined
                  : { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }
            />

            <motion.span
              className="font-display text-xl font-bold tracking-[0.24em] text-foreground sm:text-2xl sm:tracking-[0.3em]"
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              FUZE<span className="text-primary text-glow">VALO</span>
            </motion.span>

            <motion.div
              className="h-[2px] w-24 overflow-hidden rounded-full bg-border/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <motion.div
                className="h-full bg-primary"
                style={{ width: "0%" }}
                initial={{ width: "0%" }}
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
