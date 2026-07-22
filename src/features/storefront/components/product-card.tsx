"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  buildWhatsAppLink,
  formatPrice,
  type Product,
} from "@/features/catalog/domain/product";
import styles from "./product-card.module.css";

function WhatsAppGlyph() {
  return (
    <svg viewBox="0 0 32 32" className="h-4 w-4" aria-hidden="true">
      <path
        fill="currentColor"
        d="M27.2 15.4c0 6.2-5 11.3-11.3 11.3-2 0-4-.5-5.7-1.5l-6.1 1.9 2-5.9a11.2 11.2 0 0 1-1.8-5.9C4.3 9.1 9.4 4 15.7 4S27.2 9.1 27.2 15.4Zm-11.5-9.5c-5.2 0-9.4 4.2-9.4 9.4 0 1.9.6 3.7 1.6 5.2l.2.2-1.2 3.7 3.8-1.2.2.1c1.5.9 3.2 1.4 4.9 1.4 5.2 0 9.4-4.2 9.4-9.4 0-5.2-4.2-9.4-9.5-9.4Zm5.4 12c-.3-.2-1.8-.9-2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.7-1.7-2-.2-.3 0-.4.1-.6l.5-.6c.2-.2.2-.4.3-.6.1-.2 0-.4 0-.6 0-.2-.7-1.7-.9-2.3-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.1 1.1-1.1 2.6s1.1 3 1.3 3.2c.2.2 2.2 3.5 5.4 4.8 3.2 1.2 3.2.8 3.8.7.6-.1 1.8-.8 2.1-1.5.3-.7.3-1.4.2-1.5-.1-.1-.3-.2-.6-.4Z"
      />
    </svg>
  );
}

interface ProductCardProps {
  product: Product;
  index: number;
  isLiteMode: boolean;
}

function getRankBadgeClasses(rank: string) {
  const base = rank.split(" ")[0]?.toLowerCase();

  if (base === "silver") {
    return styles.rankSilver;
  }

  if (base === "gold") {
    return styles.rankGold;
  }

  if (base === "diamond" || base === "platinum") {
    return styles.rankDiamond;
  }

  if (base === "ascendant") {
    return styles.rankDefault;
  }

  if (base === "immortal") {
    return styles.rankImmortal;
  }

  if (base === "radiant") {
    return styles.rankGold;
  }

  return styles.rankDefault;
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
    return styles.flagHot;
  }

  if (featured === "best-deal") {
    return styles.flagBest;
  }

  if (featured === "rare") {
    return styles.flagRare;
  }

  return "";
}

export default function ProductCard({
  product,
  index,
  isLiteMode,
}: ProductCardProps) {
  const isSold = product.status === "sold";
  const router = useRouter();
  const detailHref = `/jual-beli-akun/${product.code}`;
  const featuredLabel = getFeaturedLabel(product.featured);
  const productImage = product.image;

  // ponytail: prefetch on first interaction hint instead of on mount, so 12 cards don't fire 12 parallel prefetches
  // during hydration and blow iOS Safari's memory ceiling. Pointerenter fires on hover (desktop) or first touch (mobile).
  const prefetchDetail = () => {
    if (isSold) return;
    router.prefetch(detailHref);
  };
  // const productImage = "/images/catalog/mock_image.jpg";

  return (
    <motion.div
      initial={isLiteMode ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        delay: isLiteMode
          ? Math.min(index * 0.02, 0.12)
          : Math.min(index * 0.04, 0.28),
        duration: isLiteMode ? 0.24 : 0.4,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={isLiteMode ? undefined : { y: -4, transition: { type: "spring", stiffness: 350, damping: 18 } }}
      className={`${styles.card} ${isSold ? styles.sold : ""}`}
      style={{ contentVisibility: "auto", containIntrinsicSize: "320px 360px" }}
      role="link"
      tabIndex={isSold ? -1 : 0}
      onPointerEnter={prefetchDetail}
      onFocus={prefetchDetail}
      onClick={() => !isSold && router.push(detailHref)}
      onKeyDown={(event) => {
        if (isSold) {
          return;
        }

        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          router.push(detailHref);
        }
      }}
    >
      <div className={styles.cardTop}>
        <span className={styles.productId}>
          <span className={styles.productCode}>{product.code}</span>
        </span>

        <span
          className={`${styles.rankBadge} ${getRankBadgeClasses(product.rank)}`}
        >
          {product.rank}
        </span>
      </div>

      <div className={styles.cardMain}>
        <div className={styles.thumbWrap}>
          <img
            src={productImage}
            alt={product.code}
            loading="lazy"
            decoding="async"
          />
          <div className={styles.thumbShade} />

          {featuredLabel && (
            <span
              className={`${styles.flag} ${getFeaturedClasses(product.featured)}`}
            >
              {featuredLabel}
            </span>
          )}
        </div>

        <div className={styles.cardInfo}>
          <p className={styles.cardInfoTitle}>
            Daftar Skin
          </p>
          <ul className={styles.skinList}>
            {product.skins.map((skin, index) => (
              <li key={`${index}-${skin}`}>
                <span className={styles.skinNumber}>
                  {index + 1}.
                </span>
                <span>{skin}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ponytail: hidden real link so crawlers see /jual-beli-akun/{code} as an internal link; users still get fast client-side router.push via the card onClick above. */}
      <a href={detailHref} className="sr-only" tabIndex={-1} aria-hidden="true">
        Lihat detail akun {product.code}
      </a>

      <div className={styles.footer}>
        <p className={styles.price}>
          Rp {formatPrice(product.price)}
        </p>

        {!isSold && (
          <a
            href={buildWhatsAppLink(product)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => event.stopPropagation()}
            className={styles.cta}
          >
            <WhatsAppGlyph />
            Beli via WhatsApp
          </a>
        )}
      </div>
    </motion.div>
  );
}
