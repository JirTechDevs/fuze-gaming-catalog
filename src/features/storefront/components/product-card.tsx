"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MessageCircle } from "lucide-react";
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

function getRankBadgeClasses(rank: string) {
  const base = rank.split(" ")[0]?.toLowerCase();

  if (base === "silver") {
    return "border-[#7b8799] text-[#e4ebf6]";
  }

  if (base === "gold") {
    return "border-[#8a6d1f] text-[#f0cb62]";
  }

  if (base === "platinum") {
    return "border-[#2f7e86] text-[#86f0ff]";
  }

  if (base === "diamond") {
    return "border-[#8d50db] text-[#d8b4ff]";
  }

  if (base === "ascendant") {
    return "border-[#38a36d] text-[#8af3b6]";
  }

  if (base === "immortal") {
    return "border-[#d34a58] text-[#ff8a9d]";
  }

  if (base === "radiant") {
    return "border-[#c68a2f] text-[#ffe08d]";
  }

  return "border-[#2c5f87] text-[#d9f6ff]";
}

function getFeaturedLabel(featured?: Product["featured"]) {
  if (featured === "hot") {
    return "HOT";
  }

  if (featured === "best-deal") {
    return "BEST DEAL";
  }

  if (featured === "rare") {
    return "RARE";
  }

  return null;
}

function getFeaturedClasses(featured?: Product["featured"]) {
  if (featured === "hot") {
    return "border-[#ff5e72]/50 bg-[linear-gradient(180deg,#ff6d7e,#ff3f5f)] text-white";
  }

  if (featured === "best-deal") {
    return "border-[#ff9b2f]/50 bg-[linear-gradient(180deg,#ff9c34,#ff6d00)] text-[#fff4dd]";
  }

  if (featured === "rare") {
    return "border-[#3b8eff]/50 bg-[linear-gradient(180deg,#4a9dff,#2e67ff)] text-white";
  }

  return "";
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
  const featuredLabel = getFeaturedLabel(product.featured);

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
      whileHover={isLiteMode ? undefined : { y: -4, transition: { type: "spring", stiffness: 350, damping: 18 } }}
      className={`group relative flex h-full min-h-[20rem] cursor-pointer flex-col overflow-hidden rounded-[1.35rem] border border-[#153b5d] bg-[linear-gradient(180deg,rgba(8,22,45,0.98),rgba(5,15,32,0.96))] p-4 shadow-[0_18px_44px_rgba(2,9,22,0.28)] transition-all duration-300 hover:border-[#2f7faf] ${
        isSold ? "pointer-events-none opacity-50" : ""
      }`}
      style={{ contentVisibility: "auto", containIntrinsicSize: "320px 360px" }}
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
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#1d688d] bg-[#061e39]/88 px-3 py-1.5 font-display text-[12px] font-bold tracking-[0.04em] text-[#7be8ff]">
          <span className="h-2 w-2 rounded-full bg-[#68e7ff] shadow-[0_0_12px_rgba(104,231,255,0.85)]" />
          {product.code}
        </span>

        <span
          className={`inline-flex rounded-full border bg-[#0b1328]/94 px-3 py-1.5 font-display text-[12px] font-semibold ${getRankBadgeClasses(product.rank)}`}
        >
          {product.rank}
        </span>
      </div>

      <div className="relative flex items-start gap-4">
        <div className="relative w-[44%] max-w-[142px] shrink-0 overflow-hidden rounded-[0.95rem] border border-[#174363] bg-[linear-gradient(180deg,rgba(14,38,69,0.88),rgba(7,18,35,0.96))]">
          <img
            src={product.image}
            alt={product.code}
            loading="lazy"
            decoding="async"
            className="aspect-square h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#031021]/55 via-transparent to-transparent" />

          {featuredLabel && (
            <span
              className={`absolute left-3 top-3 inline-flex rounded-[0.45rem] border px-2 py-1 font-display text-[11px] font-bold leading-none ${getFeaturedClasses(product.featured)}`}
            >
              {featuredLabel}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1 pt-1">
          <p className="font-display text-[13px] font-bold tracking-[0.04em] text-[#79ecff]">
            FULL SKIN
          </p>
          <ul className="mt-3 space-y-2 text-[12px] leading-5 text-white/74">
            {visibleSkins.map((skin) => (
              <li key={skin} className="flex gap-2">
                <span className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[#67e7ff]" />
                <span className="min-w-0 truncate">{skin}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-auto pt-5">
        <p className="font-display text-[1.12rem] font-bold text-[#5ae8ff] sm:text-[1.22rem]">
          Rp {formatPrice(product.price)}
        </p>

        {!isSold && (
          <a
            href={buildWhatsAppLink(product)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="mt-4 inline-flex h-[3.05rem] w-full items-center justify-center gap-2 rounded-[0.6rem] border border-[#43f399]/18 bg-[linear-gradient(180deg,#37bc4a,#2fa844)] px-4 font-display text-[14px] font-bold text-white shadow-[0_12px_24px_rgba(24,185,85,0.18)] transition hover:brightness-105"
          >
            <MessageCircle size={16} />
            Beli via WhatsApp
          </a>
        )}
      </div>
    </motion.div>
  );
}
