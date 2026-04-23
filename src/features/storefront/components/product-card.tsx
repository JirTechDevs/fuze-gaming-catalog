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
    return "border-[rgba(148,163,184,0.35)] bg-[rgba(148,163,184,0.12)] text-[#94A3B8]";
  }

  if (base === "gold") {
    return "border-[rgba(245,158,11,0.35)] bg-[rgba(245,158,11,0.12)] text-[#F59E0B]";
  }

  if (base === "platinum") {
    return "border-[rgba(34,211,238,0.35)] bg-[rgba(34,211,238,0.12)] text-[#22D3EE]";
  }

  if (base === "diamond") {
    return "border-[rgba(34,211,238,0.35)] bg-[rgba(34,211,238,0.12)] text-[#22D3EE]";
  }

  if (base === "ascendant") {
    return "border-[rgba(34,197,94,0.35)] bg-[rgba(34,197,94,0.12)] text-[#4ADE80]";
  }

  if (base === "immortal") {
    return "border-[rgba(239,68,68,0.35)] bg-[rgba(239,68,68,0.12)] text-[#EF4444]";
  }

  if (base === "radiant") {
    return "border-[rgba(251,146,60,0.35)] bg-[rgba(251,146,60,0.12)] text-[#FB923C]";
  }

  return "border-[rgba(0,200,255,0.24)] bg-[rgba(0,200,255,0.1)] text-[#00C8FF]";
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
      className={`group relative flex h-full min-h-[20rem] cursor-pointer flex-col overflow-hidden rounded-[12px] border border-[rgba(0,200,255,0.12)] bg-[#0A1128] p-4 transition-all duration-300 hover:border-[rgba(0,200,255,0.4)] hover:shadow-[0_0_24px_rgba(0,200,255,0.08)] ${
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
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <span className="inline-flex min-w-0 max-w-full items-center gap-2 rounded-full border border-white/[0.08] bg-[#0D1530] px-3 py-1.5 font-display text-[12px] font-bold tracking-[0.04em] text-white/84">
          <span className="h-2 w-2 rounded-full bg-[#00C8FF] shadow-[0_0_12px_rgba(0,200,255,0.6)]" />
          <span className="break-all">{product.code}</span>
        </span>

        <span
          className={`inline-flex shrink-0 rounded-full border px-3 py-1.5 font-display text-[12px] font-semibold ${getRankBadgeClasses(product.rank)}`}
        >
          {product.rank}
        </span>
      </div>

      <div className="relative flex items-start gap-3 sm:gap-4">
        <div className="relative w-[42%] max-w-[128px] shrink-0 overflow-hidden rounded-[10px] border border-white/[0.08] bg-[#0D1530] sm:max-w-[142px]">
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
          <p className="font-display text-[13px] font-bold tracking-[0.04em] text-white/52">
            FULL SKIN
          </p>
          <ul className="mt-3 space-y-2 text-[12px] leading-5 text-white/74">
            {visibleSkins.map((skin) => (
              <li key={skin} className="flex items-start gap-2">
                <span className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[#00C8FF]" />
                <span className="min-w-0 break-words">{skin}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-auto pt-5">
        <p className="font-display text-[1.32rem] font-bold text-[#00C8FF] sm:text-[1.48rem]">
          Rp {formatPrice(product.price)}
        </p>

        {!isSold && (
          <a
            href={buildWhatsAppLink(product)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => event.stopPropagation()}
            className="mt-4 inline-flex h-[3.05rem] w-full items-center justify-center gap-2 rounded-[8px] bg-[#22C55E] px-4 font-display text-[14px] font-bold text-white shadow-[0_12px_24px_rgba(34,197,94,0.22)] transition hover:brightness-105"
          >
            <MessageCircle size={16} />
            Beli via WhatsApp
          </a>
        )}
      </div>
    </motion.div>
  );
}
