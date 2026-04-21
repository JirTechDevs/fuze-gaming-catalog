"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/fuzevalo/",
    icon: InstagramGlyph,
  },
  {
    label: "Discord",
    href: "https://discord.com/invite/fuzevalo-1147449215237226517",
    icon: DiscordGlyph,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@fuzevalo_",
    icon: TikTokGlyph,
  },
] as const;

function InstagramGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 xl:h-6 xl:w-6" aria-hidden="true">
      <path
        fill="currentColor"
        d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 1.8A3.7 3.7 0 0 0 3.8 7.5v9a3.7 3.7 0 0 0 3.7 3.7h9a3.7 3.7 0 0 0 3.7-3.7v-9a3.7 3.7 0 0 0-3.7-3.7h-9Zm9.7 1.4a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8A3.2 3.2 0 1 0 12 15.2 3.2 3.2 0 0 0 12 8.8Z"
      />
    </svg>
  );
}

function DiscordGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 xl:h-6 xl:w-6" aria-hidden="true">
      <path
        fill="currentColor"
        d="M19.54 5.27A16.4 16.4 0 0 0 15.5 4l-.2.39a14.9 14.9 0 0 1 3.57 1.22c-3.44-1.6-7.32-1.6-10.76 0A14.9 14.9 0 0 1 11.7 4.4L11.5 4a16.4 16.4 0 0 0-4.04 1.27C4.92 9.05 4.22 12.72 4.5 16.35A16.6 16.6 0 0 0 9.46 19l.4-.66a10.8 10.8 0 0 1-1.7-.82l.16-.12c3.27 1.5 6.8 1.5 10.07 0l.16.12c-.55.33-1.12.6-1.7.82l.4.66a16.5 16.5 0 0 0 4.96-2.65c.33-4.2-.56-7.84-2.67-11.08ZM9.98 14.15c-.98 0-1.77-.88-1.77-1.97 0-1.08.78-1.96 1.77-1.96.98 0 1.78.89 1.77 1.96 0 1.09-.79 1.97-1.77 1.97Zm4.04 0c-.98 0-1.77-.88-1.77-1.97 0-1.08.78-1.96 1.77-1.96.98 0 1.78.89 1.77 1.96 0 1.09-.79 1.97-1.77 1.97Z"
      />
    </svg>
  );
}

function TikTokGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 xl:h-6 xl:w-6" aria-hidden="true">
      <path
        fill="currentColor"
        d="M14.6 3c.25 2.06 1.43 3.77 3.4 4.4v2.52a6.4 6.4 0 0 1-3.16-.88v5.12c0 3.12-2.3 5.84-5.6 5.84A5.68 5.68 0 0 1 3.6 14.3c0-3.14 2.57-5.7 5.74-5.7.23 0 .46.02.68.05v2.8a2.9 2.9 0 0 0-.68-.08A2.9 2.9 0 0 0 6.4 14.3a2.9 2.9 0 0 0 2.84 2.95c1.72 0 2.84-1.37 2.84-3.3V3h2.52Z"
      />
    </svg>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-[linear-gradient(180deg,hsl(var(--background)_/_0.96),hsl(var(--background)_/_0.88))] shadow-[0_8px_28px_hsl(226_56%_4%_/_0.28)] backdrop-blur-md sm:bg-[linear-gradient(180deg,hsl(var(--background)_/_0.9),hsl(var(--background)_/_0.58))] sm:shadow-[0_10px_45px_hsl(226_56%_4%_/_0.4)] sm:backdrop-blur-2xl">
      <div className="container mx-auto flex h-14 items-center justify-between gap-3 px-4 sm:h-20">
        <Link href="/" className="flex min-w-0 items-center gap-2.5">
          <img src="/images/logo.png" alt="Fuzevalo" className="h-7 w-7 shrink-0 object-contain sm:h-8 sm:w-8" />
          <span className="truncate font-display text-sm font-bold tracking-[0.16em] text-foreground sm:text-base sm:tracking-[0.2em]">
            FUZE<span className="text-primary">VALO</span>
          </span>
        </Link>

        <div className="hidden items-center gap-3 sm:flex">
          {socialLinks.map((item) => {
            const Icon = item.icon;

            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-background/40 text-foreground/82 shadow-[0_10px_24px_hsl(226_56%_4%_/_0.22)] transition hover:border-primary/35 hover:bg-primary/10 hover:text-primary xl:h-12 xl:w-12"
              >
                <Icon />
              </a>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-background/70 text-foreground backdrop-blur-none transition hover:border-primary/30 hover:text-primary sm:hidden"
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
            className="overflow-hidden border-b border-white/10 bg-background/96 backdrop-blur-none sm:hidden"
          >
            <div className="flex flex-col gap-2 p-3">
              {socialLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl border border-white/5 bg-background/30 px-4 py-3 text-left font-display text-[11px] tracking-[0.15em] text-foreground transition hover:bg-primary/10 hover:text-primary"
                  >
                    <Icon />
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
