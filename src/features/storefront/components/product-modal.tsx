"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight, MessageCircle, Shield, X } from "lucide-react";
import {
  buildWhatsAppLink,
  formatPrice,
  type Product,
} from "@/features/catalog/domain/product";

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

const rankColors: Record<string, string> = {
  Iron: "text-[hsl(20,15%,50%)]",
  Bronze: "text-[hsl(30,50%,45%)]",
  Silver: "text-[hsl(220,10%,65%)]",
  Gold: "text-[hsl(45,80%,55%)]",
  Platinum: "text-[hsl(187,60%,55%)]",
  Diamond: "text-[hsl(280,60%,65%)]",
  Ascendant: "text-[hsl(150,60%,50%)]",
  Immortal: "text-[hsl(0,70%,60%)]",
  Radiant: "text-[hsl(45,100%,65%)]",
};

function getRankColor(rank: string) {
  const base = rank.split(" ")[0];

  return rankColors[base] || "text-foreground";
}

function DetailTile({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-[1.35rem] border border-border/35 bg-background/30 px-4 py-3.5">
      <span className="font-display text-[10px] tracking-[0.22em] text-muted-foreground/55">
        {label}
      </span>
      <p
        className={`mt-1 text-sm font-medium leading-5 ${accent ? "text-primary" : "text-foreground/88"}`}
      >
        {value}
      </p>
    </div>
  );
}

export default function ProductModal({
  product,
  onClose,
}: ProductModalProps) {
  if (!product) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 overflow-y-auto bg-background/85 p-3 backdrop-blur-lg sm:p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative mx-auto my-2 w-full max-w-2xl overflow-hidden rounded-[1.6rem] border border-border/40 bg-card box-glow sm:my-4 sm:rounded-[2rem]"
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-full border border-border/30 bg-background/60 p-2 text-muted-foreground backdrop-blur-sm transition-colors hover:text-foreground"
          >
            <X size={16} />
          </button>

          <div className="relative aspect-[4/5] overflow-hidden bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.24),_transparent_52%),linear-gradient(180deg,_hsl(var(--secondary)/0.9),_hsl(var(--card)))] p-3 sm:aspect-[5/4] sm:p-4">
            <div className="relative h-full w-full overflow-hidden rounded-[1.65rem] border border-white/10 bg-background/25">
              <img
                src={product.image}
                alt={product.code}
                className="h-full w-full object-contain object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/15 to-transparent" />
            </div>

            <div className="absolute left-4 right-4 top-4 flex flex-wrap items-start justify-between gap-2 sm:left-7 sm:right-7 sm:top-7">
              <div className="flex min-w-0 items-center gap-2 rounded-full border border-primary/25 bg-background/88 px-3 py-2 backdrop-blur-sm sm:px-4">
                <Shield size={13} className="shrink-0 text-primary" />
                <span className="truncate font-display text-xs font-bold tracking-widest text-primary sm:text-sm">
                  {product.code}
                </span>
              </div>
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2 sm:bottom-7 sm:left-7 sm:right-7 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-3">
              <div className="rounded-[1.3rem] border border-primary/15 bg-background/78 px-4 py-3 backdrop-blur-sm">
                <span className="font-display text-[10px] tracking-[0.24em] text-muted-foreground/55">
                  RANK
                </span>
                <p
                  className={`mt-1 font-display text-xl font-bold tracking-wide sm:text-2xl ${getRankColor(product.rank)}`}
                >
                  {product.rank}
                </p>
              </div>
              <div className="rounded-[1.3rem] border border-primary/15 bg-background/78 px-4 py-3 backdrop-blur-sm sm:text-right">
                <span className="font-display text-[10px] tracking-[0.24em] text-muted-foreground/55">
                  PRICE
                </span>
                <p className="mt-1 font-display text-xl font-bold text-primary sm:text-2xl">
                  Rp {formatPrice(product.price)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5 p-4 sm:p-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <DetailTile label="SISA VP" value={product.sisaVP || "-"} />
              <DetailTile label="CHANGE NICK" value={product.changeNick} />
              <DetailTile label="REGION" value={product.region} />
              <DetailTile label="PREMIER" value={product.premier || "-"} />
              <DetailTile label="AGENT" value={product.agent} />
              <DetailTile
                label="STATUS"
                value={product.status === "available" ? "Tersedia" : "Sold"}
                accent={product.status === "available"}
              />
            </div>

            <div className="rounded-[1.6rem] border border-border/35 bg-background/32 p-5">
              <span className="font-display text-sm font-bold tracking-[0.16em] text-foreground">
                DAFTAR SKIN
              </span>
              <div className="mt-1 text-sm text-muted-foreground/72">
                Skin yang ikut di akun ini
              </div>
              <ol className="panel-scrollbar mt-4 max-h-64 space-y-2 overflow-y-auto pr-1 text-sm leading-6 text-foreground/84 sm:text-base">
                {product.skins.map((skin, index) => (
                  <li key={skin} className="break-words">
                    {index + 1}. {skin}
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex flex-col gap-4 rounded-[1.5rem] border border-primary/10 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="font-display text-[10px] tracking-[0.26em] text-muted-foreground/50">
                  SIAP CHECKOUT
                </span>
                <p className="mt-1 text-sm text-foreground/75">
                  Lanjut langsung ke WhatsApp untuk proses beli.
                </p>
              </div>
              {product.status === "available" && (
                <a
                  href={buildWhatsAppLink(product)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-[1.15rem] bg-primary px-5 py-3 font-display text-[11px] font-bold tracking-[0.15em] text-primary-foreground transition-all duration-300 hover:box-glow-strong hover:gap-3"
                >
                  <MessageCircle size={16} />
                  BELI AKUN INI
                  <ChevronRight size={14} />
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
