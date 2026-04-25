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
import styles from "./product-card.module.css";

interface ProductCardProps {
  product: Product;
  index: number;
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
}: ProductCardProps) {
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const isLiteMode = isMobile || prefersReducedMotion;
  const isSold = product.status === "sold";
  const visibleSkins = product.skins.slice(0, 4);
  const router = useRouter();
  const featuredLabel = getFeaturedLabel(product.featured);
  const productImage = "/images/catalog/mock_image.jpg";
  // const productImage = product.image;

  return (
    <motion.div
      initial={isLiteMode ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        delay: isLiteMode ? Math.min(index * 0.02, 0.12) : index * 0.06,
        duration: isLiteMode ? 0.24 : 0.5,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={isLiteMode ? undefined : { y: -4, transition: { type: "spring", stiffness: 350, damping: 18 } }}
      className={`${styles.card} ${isSold ? styles.sold : ""}`}
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
            FULL SKIN
          </p>
          <ul className={styles.skinList}>
            {visibleSkins.map((skin) => (
              <li key={skin}>{skin}</li>
            ))}
          </ul>
        </div>
      </div>

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
            <MessageCircle size={16} />
            Beli via WhatsApp
          </a>
        )}
      </div>
    </motion.div>
  );
}
