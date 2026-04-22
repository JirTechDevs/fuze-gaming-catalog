"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const navLinks = [
  { label: "Beranda", href: "#", active: true },
  { label: "Katalog", href: "#catalog" },
  { label: "Tukar Tambah", href: "#" },
  { label: "Cara Beli", href: "#" },
  { label: "Testimoni", href: "#testimoni" },
  { label: "FAQ", href: "#faq" },
] as const;

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

function WhatsAppGlyph() {
  return (
    <svg viewBox="0 0 32 32" className="h-[18px] w-[18px]" aria-hidden="true">
      <path
        fill="currentColor"
        d="M27.2 15.4c0 6.2-5 11.3-11.3 11.3-2 0-4-.5-5.7-1.5l-6.1 1.9 2-5.9a11.2 11.2 0 0 1-1.8-5.9C4.3 9.1 9.4 4 15.7 4S27.2 9.1 27.2 15.4Zm-11.5-9.5c-5.2 0-9.4 4.2-9.4 9.4 0 1.9.6 3.7 1.6 5.2l.2.2-1.2 3.7 3.8-1.2.2.1c1.5.9 3.2 1.4 4.9 1.4 5.2 0 9.4-4.2 9.4-9.4 0-5.2-4.2-9.4-9.5-9.4Zm5.4 12c-.3-.2-1.8-.9-2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.7-1.7-2-.2-.3 0-.4.1-.6l.5-.6c.2-.2.2-.4.3-.6.1-.2 0-.4 0-.6 0-.2-.7-1.7-.9-2.3-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.1 1.1-1.1 2.6s1.1 3 1.3 3.2c.2.2 2.2 3.5 5.4 4.8 3.2 1.2 3.2.8 3.8.7.6-.1 1.8-.8 2.1-1.5.3-.7.3-1.4.2-1.5-.1-.1-.3-.2-.6-.4Z"
      />
    </svg>
  );
}

function InstagramGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden="true">
      <path
        fill="currentColor"
        d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2Zm0 1.8A3.7 3.7 0 0 0 3.8 7.5v9a3.7 3.7 0 0 0 3.7 3.7h9a3.7 3.7 0 0 0 3.7-3.7v-9a3.7 3.7 0 0 0-3.7-3.7h-9Zm9.7 1.4a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8A3.2 3.2 0 1 0 12 15.2 3.2 3.2 0 0 0 12 8.8Z"
      />
    </svg>
  );
}

function DiscordGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden="true">
      <path
        fill="currentColor"
        d="M19.54 5.27A16.4 16.4 0 0 0 15.5 4l-.2.39a14.9 14.9 0 0 1 3.57 1.22c-3.44-1.6-7.32-1.6-10.76 0A14.9 14.9 0 0 1 11.7 4.4L11.5 4a16.4 16.4 0 0 0-4.04 1.27C4.92 9.05 4.22 12.72 4.5 16.35A16.6 16.6 0 0 0 9.46 19l.4-.66a10.8 10.8 0 0 1-1.7-.82l.16-.12c3.27 1.5 6.8 1.5 10.07 0l.16.12c-.55.33-1.12.6-1.7.82l.4.66a16.5 16.5 0 0 0 4.96-2.65c.33-4.2-.56-7.84-2.67-11.08ZM9.98 14.15c-.98 0-1.77-.88-1.77-1.97 0-1.08.78-1.96 1.77-1.96.98 0 1.78.89 1.77 1.96 0 1.09-.79 1.97-1.77 1.97Zm4.04 0c-.98 0-1.77-.88-1.77-1.97 0-1.08.78-1.96 1.77-1.96.98 0 1.78.89 1.77 1.96 0 1.09-.79 1.97-1.77 1.97Z"
      />
    </svg>
  );
}

function TikTokGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" aria-hidden="true">
      <path
        fill="currentColor"
        d="M14.6 3c.25 2.06 1.43 3.77 3.4 4.4v2.52a6.4 6.4 0 0 1-3.16-.88v5.12c0 3.12-2.3 5.84-5.6 5.84A5.68 5.68 0 0 1 3.6 14.3c0-3.14 2.57-5.7 5.74-5.7.23 0 .46.02.68.05v2.8a2.9 2.9 0 0 0-.68-.08A2.9 2.9 0 0 0 6.4 14.3a2.9 2.9 0 0 0 2.84 2.95c1.72 0 2.84-1.37 2.84-3.3V3h2.52Z"
      />
    </svg>
  );
}

function scrollToSection(href: string) {
  if (typeof window === "undefined") {
    return;
  }

  if (href === "#") {
    if (window.location.pathname !== "/") {
      window.location.assign("/");
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const id = href.replace("#", "");
  const target = document.getElementById(id);

  if (window.location.pathname === "/" && target) {
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  window.location.assign(`/${href}`);
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 border-b border-[#143257]/95 bg-[rgba(2,9,24,0.84)] shadow-[0_20px_56px_rgba(1,6,18,0.52)] backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_-60%,rgba(80,215,255,0.18),transparent_28%),radial-gradient(circle_at_82%_-40%,rgba(80,215,255,0.12),transparent_24%),linear-gradient(180deg,rgba(5,16,40,0.98),rgba(3,12,30,0.94))]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(90,217,255,0.48),transparent)]" />

      <div className="relative mx-auto flex h-16 max-w-[1512px] items-center justify-between gap-4 px-4 sm:h-20 sm:px-6 xl:px-8">
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#21446f] bg-[linear-gradient(180deg,rgba(11,25,53,0.95),rgba(6,18,39,0.95))] shadow-[0_0_24px_rgba(79,209,255,0.16)]">
            <img src="/images/logo.png" alt="Fuzevalo" className="h-7 w-7 object-contain" />
          </div>
          <span className="truncate font-display text-sm font-extrabold tracking-[0.22em] text-white sm:text-base">
            FUZE<span className="text-[#52dbff]">VALO</span>
          </span>
        </Link>

        <div className="hidden h-full items-center lg:flex">
          {navLinks.map((link) => {
            const isActive = "active" in link && Boolean(link.active);

            return (
              <button
                key={link.label}
                type="button"
                onClick={() => scrollToSection(link.href)}
                className={`relative flex h-full items-center px-4 font-display text-[14px] font-semibold transition-colors xl:px-5 ${
                  isActive
                    ? "text-[#63e4ff]"
                    : "text-white/88 hover:text-[#7ae8ff]"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-[10px] left-1/2 h-[2px] w-14 -translate-x-1/2 rounded-full bg-[#63e4ff] shadow-[0_0_12px_rgba(99,228,255,0.7)]" />
                )}
              </button>
            );
          })}
        </div>

        <div className="hidden items-center gap-2.5 lg:flex">
          {socialLinks.map((item) => {
            const Icon = item.icon;

            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[#244b79] bg-[linear-gradient(180deg,rgba(10,24,50,0.94),rgba(6,18,38,0.88))] text-white/88 shadow-[0_10px_30px_rgba(2,10,28,0.36)] transition hover:border-[#4bd6ff] hover:text-[#6ee5ff]"
              >
                <Icon />
              </a>
            );
          })}

          <a
            href="https://wa.me/628881462675"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-3 inline-flex items-center gap-2.5 rounded-full border border-[#43f399]/25 bg-[linear-gradient(180deg,#2ee16d,#1cca59)] px-6 py-3 font-display text-[13px] font-bold tracking-[0.02em] text-white shadow-[0_0_0_1px_rgba(110,255,173,0.12),0_16px_32px_rgba(24,185,85,0.34),0_0_28px_rgba(46,225,109,0.24)] transition hover:brightness-105"
          >
            <WhatsAppGlyph />
            Chat WhatsApp
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[#1f446e] bg-[linear-gradient(180deg,rgba(10,24,50,0.94),rgba(6,18,38,0.9))] text-white transition hover:border-[#54ddff] hover:text-[#7be8ff] lg:hidden"
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
            className="overflow-hidden border-t border-[#15345b] bg-[linear-gradient(180deg,rgba(5,16,40,0.98),rgba(3,12,30,0.98))] lg:hidden"
          >
            <div className="space-y-2 px-4 py-4">
              {navLinks.map((link) => {
                const isActive = "active" in link && Boolean(link.active);

                return (
                  <button
                    key={link.label}
                    type="button"
                    onClick={() => {
                      scrollToSection(link.href);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left font-display text-[12px] font-semibold tracking-[0.08em] transition ${
                      isActive
                        ? "border-[#2e6396] bg-[#0b2345] text-[#66e3ff]"
                        : "border-[#173a61] bg-[#081b36]/90 text-white/86 hover:border-[#2e6396] hover:text-[#66e3ff]"
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && <span className="h-2 w-2 rounded-full bg-[#63e4ff]" />}
                  </button>
                );
              })}

              <div className="grid grid-cols-3 gap-2 pt-1">
                {socialLinks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setOpen(false)}
                      className="flex h-12 items-center justify-center rounded-2xl border border-[#173a61] bg-[#081b36]/90 text-white/86 transition hover:border-[#4bd6ff] hover:text-[#6ee5ff]"
                    >
                      <Icon />
                    </a>
                  );
                })}
              </div>

              <a
                href="https://wa.me/628881462675"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center justify-center gap-2.5 rounded-2xl border border-[#43f399]/25 bg-[linear-gradient(180deg,#2ee16d,#1cca59)] px-4 py-3.5 font-display text-[12px] font-bold tracking-[0.08em] text-white shadow-[0_14px_28px_rgba(24,185,85,0.28)]"
              >
                <WhatsAppGlyph />
                Chat WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
