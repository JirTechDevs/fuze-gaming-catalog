"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const scrollToCatalog = () => {
    setOpen(false);

    if (pathname !== "/") {
      router.push("/#catalog");
      return;
    }

    document
      .getElementById("catalog")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[linear-gradient(180deg,hsl(var(--background)_/_0.9),hsl(var(--background)_/_0.58))] shadow-[0_10px_45px_hsl(226_56%_4%_/_0.4)] backdrop-blur-2xl">
      <div className="container mx-auto flex h-14 items-center justify-between gap-3 px-4 sm:h-16">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <img src="/images/logo.png" alt="Fuzevalo" className="h-7 w-7 shrink-0 object-contain sm:h-8 sm:w-8" />
          <span className="truncate font-display text-sm font-bold tracking-[0.16em] text-foreground sm:text-base sm:tracking-[0.2em]">
            FUZE<span className="text-primary">VALO</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 sm:flex">
          <button
            type="button"
            onClick={scrollToCatalog}
            className="rounded-full border border-primary/30 bg-primary/12 px-3 py-1.5 font-display text-[10px] tracking-[0.15em] text-primary transition-all hover:bg-primary hover:text-primary-foreground"
          >
            CATALOG
          </button>
        </div>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-background/40 text-foreground backdrop-blur-sm transition hover:border-primary/30 hover:text-primary sm:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-white/10 bg-background/92 backdrop-blur-2xl sm:hidden"
          >
            <div className="flex flex-col gap-2 p-3">
              <button
                type="button"
                onClick={() => {
                  scrollToCatalog();
                }}
                className="rounded-xl border border-white/5 bg-background/30 px-4 py-3 text-left font-display text-[11px] tracking-[0.15em] text-foreground transition hover:bg-primary/10 hover:text-primary"
              >
                CATALOG
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
