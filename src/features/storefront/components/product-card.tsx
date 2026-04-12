"use client";

import { motion } from "framer-motion";
import { MessageCircle, Shield } from "lucide-react";
import {
  buildWhatsAppLink,
  formatPrice,
  type Product,
} from "@/features/catalog/domain/product";

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  index: number;
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

export default function ProductCard({
  product,
  onSelect,
  index,
}: ProductCardProps) {
  const isSold = product.status === "sold";
  const visibleSkins = product.skins.slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        delay: index * 0.06,
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className={`group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[1.75rem] border border-border/40 bg-card/85 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:box-glow ${
        isSold ? "pointer-events-none opacity-50" : ""
      }`}
      onClick={() => !isSold && onSelect(product)}
    >
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/0 to-transparent transition-all duration-500 group-hover:via-primary/50" />

      <div className="relative aspect-[4/5] overflow-hidden bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.24),_transparent_58%),linear-gradient(180deg,_hsl(var(--secondary)/0.9),_hsl(var(--card)))] p-3">
        <div className="relative h-full w-full overflow-hidden rounded-[1.35rem] border border-white/10 bg-background/25">
          <img
            src={product.image}
            alt={product.code}
            className="h-full w-full object-contain object-top transition-all duration-700 group-hover:scale-[1.03] group-hover:brightness-110"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/12 to-transparent opacity-75" />
        </div>

        {isSold && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <span className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-1.5 font-display text-sm font-bold tracking-[0.3em] text-destructive">
              SOLD
            </span>
          </div>
        )}

        <div className="absolute left-6 top-6 flex items-center gap-2 rounded-[1.2rem] border border-primary/45 bg-[linear-gradient(135deg,_hsl(var(--primary)/0.28),_hsl(var(--background)/0.96)_42%,_hsl(var(--background)/0.94)_100%)] px-4 py-3 shadow-[0_0_22px_hsl(var(--primary)/0.22)] backdrop-blur-md">
          <div className="absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-primary/80 to-transparent" />
          <Shield size={14} className="relative text-primary" />
          <span className="relative font-display text-xl font-bold leading-none tracking-[0.14em] text-primary drop-shadow-[0_0_14px_hsl(var(--primary)/0.55)]">
            {product.code}
          </span>
        </div>

        <div className="absolute right-6 top-6 rounded-[1.2rem] border border-primary/45 bg-[linear-gradient(135deg,_hsl(var(--primary)/0.28),_hsl(var(--background)/0.96)_42%,_hsl(var(--background)/0.94)_100%)] px-4 py-3 text-right shadow-[0_0_22px_hsl(var(--primary)/0.22)] backdrop-blur-md">
          <div className="absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-primary/80 to-transparent" />
          <p className="font-display text-xl font-bold leading-none text-primary drop-shadow-[0_0_14px_hsl(var(--primary)/0.55)]">
            Rp {formatPrice(product.price)}
          </p>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-display text-[10px] tracking-[0.25em] text-muted-foreground/50">
              RANK
            </span>
            <p
              className={`mt-1 font-display text-lg font-bold tracking-wide ${getRankColor(product.rank)}`}
            >
              {product.rank}
            </p>
          </div>
          <span className="rounded-full border border-border/50 bg-secondary/50 px-3 py-1 font-display text-[10px] tracking-[0.22em] text-muted-foreground">
            {product.changeNick.toUpperCase()}
          </span>
        </div>

        <div className="flex h-[11.5rem] flex-col rounded-[1.5rem] border border-border/35 bg-background/35 p-4">
          <span className="font-display text-xs font-bold tracking-[0.16em] text-foreground">
            DAFTAR SKIN
          </span>
          <ol className="horizontal-scrollbar mt-3 flex-1 space-y-1.5 overflow-x-auto overflow-y-hidden pr-1 text-sm leading-6 text-foreground/80">
            {visibleSkins.map((skin, skinIndex) => (
              <li key={skin} className="min-w-full whitespace-nowrap">
                <span className="inline-block w-max">
                  {skinIndex + 1}. {skin}
                </span>
              </li>
            ))}
          </ol>
          {product.skins.length > visibleSkins.length && (
            <p className="mt-3 text-xs text-muted-foreground/70">
              +{product.skins.length - visibleSkins.length} skin lainnya
            </p>
          )}
        </div>

        <div className="mt-auto flex flex-col gap-4">
          {!isSold && (
            <a
              href={buildWhatsAppLink(product)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(event) => event.stopPropagation()}
              className="flex w-full items-center justify-center gap-2 rounded-[1.15rem] bg-primary px-4 py-3.5 font-display text-sm font-bold tracking-[0.16em] text-primary-foreground transition-all duration-300 hover:box-glow-strong"
            >
              <MessageCircle size={16} />
              BELI AKUN INI
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
