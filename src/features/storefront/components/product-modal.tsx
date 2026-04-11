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

function DetailRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2.5">
      <span className="font-display text-[11px] tracking-[0.2em] text-muted-foreground/60">
        {label}
      </span>
      <span className={`text-sm font-medium ${accent ? "text-primary" : "text-foreground"}`}>
        {value}
      </span>
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
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 p-4 backdrop-blur-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-border/40 bg-card box-glow"
          initial={{ scale: 0.92, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-full border border-border/30 bg-background/60 p-2 text-muted-foreground transition-colors hover:text-foreground backdrop-blur-sm"
          >
            <X size={16} />
          </button>

          <div className="relative aspect-video bg-secondary/50">
            <img src={product.image} alt={product.code} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              <Shield size={14} className="text-primary" />
              <span className="font-display text-lg font-bold tracking-[0.2em] text-primary text-glow">
                {product.code}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1 p-6">
            <div className="mb-3">
              <span className="font-display text-[10px] tracking-[0.3em] text-muted-foreground/50">
                SKINS
              </span>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {product.skins.map((skin) => (
                  <span
                    key={skin}
                    className="rounded-md border border-border/30 bg-secondary/40 px-2.5 py-1 text-[11px] text-secondary-foreground/80"
                  >
                    {skin}
                  </span>
                ))}
              </div>
            </div>

            <div className="divide-y divide-border/20">
              <DetailRow label="RANK" value={product.rank} accent />
              <DetailRow label="SISA VP" value={product.sisaVP} />
              <DetailRow label="AGENT" value={product.agent} />
              <DetailRow label="CHANGE NICK" value={product.changeNick} />
              <DetailRow label="REGION" value={product.region} />
              <DetailRow label="PREMIER" value={product.premier} />
            </div>

            <div className="mt-5 flex items-center justify-between rounded-xl border border-primary/10 bg-primary/5 p-4">
              <div>
                <span className="font-display text-[10px] tracking-[0.3em] text-muted-foreground/50">
                  PRICE
                </span>
                <p className="font-display text-2xl font-bold text-primary text-glow">
                  Rp {formatPrice(product.price)}
                </p>
              </div>
              {product.status === "available" && (
                <a
                  href={buildWhatsAppLink(product)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-xl bg-primary px-5 py-3 font-display text-[11px] font-bold tracking-[0.15em] text-primary-foreground transition-all duration-300 hover:box-glow-strong hover:gap-3"
                >
                  <MessageCircle size={16} />
                  BUY VIA WHATSAPP
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
