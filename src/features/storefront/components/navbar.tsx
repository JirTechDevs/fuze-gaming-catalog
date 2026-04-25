"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import styles from "./navbar.module.css";

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
    <header className={styles.navbar}>
      <div className={styles.navInner}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoMark}>
            <img src="/images/logo.png" alt="Fuzevalo" className={styles.logoImage} />
          </span>
          <span className={styles.logoText}>
            FUZE<span className={styles.logoAccent}>VALO</span>
          </span>
        </Link>

        <div className={styles.navMenu}>
          {navLinks.map((link) => {
            const isActive = "active" in link && Boolean(link.active);

            return (
              <button
                key={link.label}
                type="button"
                onClick={() => scrollToSection(link.href)}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
              >
                {link.label}
              </button>
            );
          })}
        </div>

        <div className={styles.navActions}>
          {socialLinks.map((item) => {
            const Icon = item.icon;

            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                className={styles.navSocial}
              >
                <Icon />
              </a>
            );
          })}

          <a
            href="https://wa.me/628881462675"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsappBtn}
          >
            <WhatsAppGlyph />
            Chat WhatsApp
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className={styles.menuToggle}
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
            className={styles.mobilePanel}
          >
            <div className={styles.mobileInner}>
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
                    className={`${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ""}`}
                  >
                    <span>{link.label}</span>
                    {isActive && <span className={styles.mobileLinkActiveIndicator} />}
                  </button>
                );
              })}

              <div className={styles.mobileSocialGrid}>
                {socialLinks.map((item) => {
                  const Icon = item.icon;

                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setOpen(false)}
                      className={styles.navSocial}
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
                className={`${styles.whatsappBtn} ${styles.mobileWhatsapp}`}
              >
                <WhatsAppGlyph />
                Chat WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
