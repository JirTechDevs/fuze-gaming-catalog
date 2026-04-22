"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MessageCircle, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  buildWhatsAppLink,
  formatPrice,
  type Product,
} from "@/features/catalog/domain/product";
import { useIsMobile } from "@/hooks/use-mobile";

interface ProductCardProps {
  product: Product;
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
  index,
}: ProductCardProps) {
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const isLiteMode = isMobile || prefersReducedMotion;
  const isSold = product.status === "sold";
  const visibleSkins = product.skins.slice(0, 4);
  const router = useRouter();

  return (
    <motion.div
      initial={isLiteMode ? { opacity: 0, y: 16 } : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        delay: isLiteMode ? Math.min(index * 0.02, 0.12) : index * 0.06,
        duration: isLiteMode ? 0.24 : 0.5,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={isLiteMode ? undefined : { y: -6, scale: 1.02, transition: { type: "spring", stiffness: 350, damping: 15 } }}
      className={`group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[1.75rem] border border-border/40 bg-card/95 shadow-xl transition-all duration-300 sm:rounded-[2.25rem] sm:bg-card/85 sm:shadow-2xl hover:shadow-3xl hover:border-primary/40 ${
        isSold ? "pointer-events-none opacity-50" : ""
      }`}
      style={{ contentVisibility: "auto", containIntrinsicSize: "320px 520px" }}
      role="link"
      tabIndex={isSold ? -1 : 0}
      onClick={() => !isSold && router.push(`/catalog/${product.id}`)}
      onKeyDown={(event) => {
        if (isSold) {
          return;
        }

        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          router.push(`/catalog/${product.id}`);
        }
      }}
    >
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/0 to-transparent transition-all duration-500 group-hover:via-primary/50" />

      <div className="relative aspect-[3/4] overflow-hidden bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.24),_transparent_58%),linear-gradient(180deg,_hsl(var(--secondary)/0.9),_hsl(var(--card)))] p-1.5 sm:p-2">
        <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-background/25 sm:rounded-3xl">
          <img
            src={product.image}
            alt={product.code}
            loading="lazy"
            decoding="async"
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

        <div className="absolute inset-x-2 top-2 flex flex-col items-start gap-1 sm:inset-x-4 sm:top-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-1.5">
          <div className="relative flex max-w-full min-w-0 items-center gap-1 rounded-[0.7rem] border border-primary/45 bg-[linear-gradient(135deg,_hsl(var(--primary)/0.28),_hsl(var(--background)/0.96)_42%,_hsl(var(--background)/0.94)_100%)] px-2 py-1.5 shadow-[0_0_16px_hsl(var(--primary)/0.16)] backdrop-blur-none sm:max-w-[68%] sm:gap-1.5 sm:rounded-[1rem] sm:px-3 sm:py-2 sm:shadow-[0_0_22px_hsl(var(--primary)/0.22)] sm:backdrop-blur-md">
            <div className="absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-primary/80 to-transparent" />
            <Shield size={12} className="relative shrink-0 text-primary sm:h-[14px] sm:w-[14px]" />
            <span className="relative truncate font-display text-[10px] font-bold leading-none tracking-wider text-primary sm:text-base sm:tracking-widest">
              {product.code}
            </span>
          </div>

          <div className="relative rounded-[0.7rem] border border-primary/45 bg-[linear-gradient(135deg,_hsl(var(--primary)/0.28),_hsl(var(--background)/0.96)_42%,_hsl(var(--background)/0.94)_100%)] px-2 py-1.5 text-right shadow-[0_0_16px_hsl(var(--primary)/0.16)] backdrop-blur-none sm:rounded-[1rem] sm:px-3 sm:py-2 sm:shadow-[0_0_22px_hsl(var(--primary)/0.22)] sm:backdrop-blur-md">
            <div className="absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-primary/80 to-transparent" />
            <p
              className={`font-display text-[10px] font-bold leading-none tracking-wider sm:text-base sm:tracking-normal ${getRankColor(product.rank)}`}
            >
              {product.rank}
            </p>
          </div>
        </div>

        <div className="absolute inset-x-2 bottom-2 flex justify-start sm:inset-x-4 sm:bottom-4">
          <div className="relative rounded-[0.7rem] border border-primary/45 bg-[linear-gradient(135deg,_hsl(var(--primary)/0.28),_hsl(var(--background)/0.96)_42%,_hsl(var(--background)/0.94)_100%)] px-2.5 py-1.5 text-right shadow-[0_0_16px_hsl(var(--primary)/0.16)] backdrop-blur-none sm:rounded-[1rem] sm:px-3 sm:py-2 sm:shadow-[0_0_22px_hsl(var(--primary)/0.22)] sm:backdrop-blur-md">
            <div className="absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-primary/80 to-transparent" />
            <p className="font-display text-[10px] font-bold leading-none text-primary sm:text-base">
              Rp {formatPrice(product.price)}
            </p>
          </div>
        </div>
      </div>

      <div className="relative flex flex-1 flex-col gap-2.5 p-2.5 sm:gap-3 sm:p-4">
        <div className="flex min-h-[6rem] max-h-[7rem] flex-col rounded-[1.25rem] border border-border/35 bg-background/35 p-2.5 sm:min-h-[7.5rem] sm:max-h-[9rem] sm:rounded-3xl sm:p-3">
          <span className="font-display text-[9px] font-bold tracking-[0.12em] text-foreground sm:text-[11px] sm:tracking-[0.16em]">
            DAFTAR SKIN
          </span>
          <ol className="panel-scrollbar mt-1.5 flex-1 space-y-0.5 overflow-y-auto pr-1 text-[10px] leading-3.5 text-foreground/80 sm:mt-2 sm:space-y-1 sm:text-xs sm:leading-4">
            {visibleSkins.map((skin) => (
              <li key={skin} className="rounded-md border border-border/20 bg-background/20 px-1.5 py-1 sm:rounded-lg sm:px-2.5 sm:py-1.5">
                <span className="break-words">
                  {skin}
                </span>
              </li>
            ))}
          </ol>
          {product.skins.length > visibleSkins.length && (
            <p className="mt-2 text-[10px] text-muted-foreground/70 sm:mt-3 sm:text-xs">
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
              className={`flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-aurora px-3 py-2.5 text-center font-display text-[9px] font-bold tracking-[0.08em] text-primary-foreground shadow-[0_0_20px_hsl(var(--aurora)/0.25)] transition-transform hover:scale-105 sm:gap-2 sm:px-4 sm:py-3 sm:text-xs sm:tracking-[0.16em]`}
            >
              <MessageCircle size={14} className="sm:h-4 sm:w-4" />
              BELI AKUN INI
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
