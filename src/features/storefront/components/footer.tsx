import Image from "next/image";
import Link from "next/link";
import { Instagram, Mail } from "lucide-react";

interface FooterProps {
  compact?: boolean;
}

const menuLinks = [
  { label: "Beranda", href: "/" },
  { label: "Katalog", href: "/#catalog" },
  { label: "Tukar Tambah", href: "#" },
  { label: "Cara Beli", href: "#" },
  { label: "Testimoni", href: "/#testimoni" },
  { label: "FAQ", href: "/#faq" },
];

const informasiLinks = [
  { label: "Syarat & Ketentuan", href: "#" },
  { label: "Kebijakan Privasi", href: "#" },
  { label: "Refund & Garansi", href: "#" },
];

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M27.2 15.4c0 6.2-5 11.3-11.3 11.3-2 0-4-.5-5.7-1.5l-6.1 1.9 2-5.9a11.2 11.2 0 0 1-1.8-5.9C4.3 9.1 9.4 4 15.7 4S27.2 9.1 27.2 15.4Zm-11.5-9.5c-5.2 0-9.4 4.2-9.4 9.4 0 1.9.6 3.7 1.6 5.2l.2.2-1.2 3.7 3.8-1.2.2.1c1.5.9 3.2 1.4 4.9 1.4 5.2 0 9.4-4.2 9.4-9.4 0-5.2-4.2-9.4-9.5-9.4Zm5.4 12c-.3-.2-1.8-.9-2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.7-1.7-2-.2-.3 0-.4.1-.6l.5-.6c.2-.2.2-.4.3-.6.1-.2 0-.4 0-.6 0-.2-.7-1.7-.9-2.3-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.1 1.1-1.1 2.6s1.1 3 1.3 3.2c.2.2 2.2 3.5 5.4 4.8 3.2 1.2 3.2.8 3.8.7.6-.1 1.8-.8 2.1-1.5.3-.7.3-1.4.2-1.5-.1-.1-.3-.2-.6-.4Z"
      />
    </svg>
  );
}

function TikTokGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M19.32 6.94c-1.42-.16-2.74-.72-3.83-1.61a5.64 5.64 0 0 1-1.9-3.33h-3.2v13.24c0 1.4-.98 2.58-2.36 2.86a2.93 2.93 0 0 1-3.44-2.85 2.93 2.93 0 0 1 3.68-2.83v-3.24a6.16 6.16 0 0 0-6.9 6.07 6.15 6.15 0 0 0 6.15 6.15 6.15 6.15 0 0 0 6.15-6.15V9.4a9.02 9.02 0 0 0 5.65 1.97V8.14c-.63 0-1.24-.06-1.85-.2Z"
      />
    </svg>
  );
}

function DiscordGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M20.32 4.57A19.79 19.79 0 0 0 16.6 3.4a.07.07 0 0 0-.08.04c-.16.29-.34.66-.47.96a18.3 18.3 0 0 0-5.5 0 12.6 12.6 0 0 0-.48-.96.07.07 0 0 0-.08-.04A19.74 19.74 0 0 0 6.28 4.6a.06.06 0 0 0-.03.03A20.28 20.28 0 0 0 2.7 18.15a.08.08 0 0 0 .03.05 20 20 0 0 0 5.86 2.96.08.08 0 0 0 .08-.03c.45-.61.85-1.26 1.2-1.94a.07.07 0 0 0-.05-.1 13.34 13.34 0 0 1-1.86-.87.07.07 0 0 1 0-.12c.13-.09.25-.18.36-.28a.08.08 0 0 1 .07 0c3.9 1.78 8.13 1.78 12 0a.07.07 0 0 1 .07 0c.12.1.24.2.36.28a.07.07 0 0 1 0 .12c-.6.34-1.22.63-1.87.86a.07.07 0 0 0-.04.11c.36.68.77 1.33 1.2 1.94a.08.08 0 0 0 .08.03 19.94 19.94 0 0 0 5.87-2.96.08.08 0 0 0 .03-.05 20.19 20.19 0 0 0-3.55-13.55.05.05 0 0 0-.03-.03ZM8.52 15.65c-1.15 0-2.1-1.05-2.1-2.35 0-1.29.94-2.34 2.1-2.34s2.12 1.06 2.1 2.34c0 1.3-.95 2.35-2.1 2.35Zm7.75 0c-1.15 0-2.1-1.05-2.1-2.35 0-1.29.94-2.34 2.1-2.34s2.12 1.06 2.1 2.34c0 1.3-.94 2.35-2.1 2.35Z"
      />
    </svg>
  );
}

export default function Footer({ compact = false }: FooterProps) {
  if (compact) {
    return (
      <footer className="border-t border-white/[0.05] bg-transparent py-6">
        <div className="container mx-auto flex flex-col items-center gap-2 px-4 text-center">
          <img
            src="/images/logo.png"
            alt="Fuzevalo"
            className="h-6 w-6 opacity-40"
          />
          <p className="font-display text-[10px] tracking-[0.3em] text-muted-foreground/40">
            © 2026 FUZEVALO — ALL RIGHTS RESERVED
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-white/[0.05] bg-transparent">
      <div className="mx-auto w-full max-w-[1480px] px-4 pb-6 pt-12 sm:px-6 lg:px-8 lg:pt-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr_1fr] lg:gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <Image
                src="/images/logo.png"
                alt="Fuzevalo"
                width={36}
                height={36}
                className="h-9 w-9 object-contain"
              />
              <span className="font-display text-lg font-bold tracking-wider text-white">
                FUZE<span className="text-primary">VALO</span>
              </span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground/70">
              Marketplace jual beli akun Valorant murah, aman, dan bergaransi.
            </p>
            <div className="flex items-center gap-2.5">
              <SocialIconLink
                href="https://www.instagram.com/fuzevalo/"
                label="Instagram Fuzevalo"
              >
                <Instagram size={16} />
              </SocialIconLink>
              <SocialIconLink
                href="https://wa.me/628881462675"
                label="WhatsApp Fuzevalo"
              >
                <WhatsAppGlyph className="h-4 w-4" />
              </SocialIconLink>
              <SocialIconLink
                href="https://www.tiktok.com/@fuzevalo_"
                label="TikTok Fuzevalo"
              >
                <TikTokGlyph className="h-4 w-4" />
              </SocialIconLink>
              <SocialIconLink
                href="https://discord.com/invite/fuzevalo-1147449215237226517"
                label="Discord Fuzevalo"
              >
                <DiscordGlyph className="h-4 w-4" />
              </SocialIconLink>
            </div>
          </div>

          <FooterColumn title="MENU">
            <ul className="flex flex-col gap-2">
              {menuLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground/75 transition hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn title="INFORMASI">
            <ul className="flex flex-col gap-2">
              {informasiLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground/75 transition hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn title="HUBUNGI KAMI">
            <ul className="flex flex-col gap-3">
              <ContactRow
                icon={<WhatsAppGlyph className="h-4 w-4" />}
                title="WhatsApp"
                value="0888-1462-675"
                href="https://wa.me/628881462675"
                iconBg="linear-gradient(135deg,#22C55E,#15803D)"
                iconColor="#F0FDF4"
              />
              <ContactRow
                icon={<Instagram size={16} />}
                title="Instagram"
                value="@fuzevalo"
                href="https://www.instagram.com/fuzevalo/"
                iconBg="linear-gradient(135deg,#F58529,#DD2A7B,#8134AF)"
                iconColor="#FFFFFF"
              />
              <ContactRow
                icon={<Mail size={16} />}
                title="Email"
                value="cs@fuzevalo.com"
                href="mailto:cs@fuzevalo.com"
                iconBg="linear-gradient(135deg,#3B82F6,#1D4ED8)"
                iconColor="#EFF6FF"
              />
            </ul>
          </FooterColumn>

          <FooterColumn title="JAM OPERASIONAL">
            <div className="flex flex-col gap-1 text-sm text-muted-foreground/75">
              <p>Setiap Hari</p>
              <p>24 Jam Nonstop</p>
            </div>
          </FooterColumn>
        </div>

        <div className="mt-10 border-t border-white/[0.05] pt-5">
          <p className="text-center font-display text-[11px] tracking-[0.24em] text-muted-foreground/40">
            © 2026 Fuzevalo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-display text-xs font-bold tracking-[0.28em] text-primary/85">
        {title}
      </h3>
      {children}
    </div>
  );
}

function SocialIconLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.03] text-muted-foreground/80 transition hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
    >
      {children}
    </a>
  );
}

function ContactRow({
  icon,
  title,
  value,
  href,
  iconBg,
  iconColor,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  href: string;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <li className="flex items-start gap-3">
      <span
        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
        style={{ background: iconBg, color: iconColor }}
      >
        {icon}
      </span>
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        className="flex flex-col leading-tight transition hover:text-primary"
      >
        <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground/55">
          {title}
        </span>
        <span className="text-sm text-white/85">{value}</span>
      </a>
    </li>
  );
}
