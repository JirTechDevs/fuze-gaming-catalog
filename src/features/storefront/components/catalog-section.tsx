"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/features/catalog/domain/product";
import { valorantRanks } from "@/features/catalog/domain/valorant-ranks";
import { useIsMobile } from "@/hooks/use-mobile";
import ProductCard from "@/features/storefront/components/product-card";
import styles from "./catalog-section.module.css";

interface CatalogSectionProps {
  products: Product[];
}

const ACCOUNTS_PER_PAGE = 6;

const ambientParticles = [
  { left: "5%", top: "14%", size: 180, delay: 0, duration: 14, opacity: 0.14 },
  { left: "82%", top: "10%", size: 130, delay: 1.1, duration: 16, opacity: 0.12 },
  { left: "14%", top: "66%", size: 150, delay: 0.7, duration: 15, opacity: 0.1 },
  { left: "76%", top: "74%", size: 210, delay: 1.8, duration: 18, opacity: 0.09 },
  { left: "44%", top: "28%", size: 90, delay: 0.4, duration: 12, opacity: 0.12 },
];

const techLines = [
  { left: "8%", top: "12%", width: "w-24", delay: 0.2 },
  { left: "72%", top: "18%", width: "w-16", delay: 1.3 },
  { left: "18%", top: "58%", width: "w-20", delay: 0.6 },
  { left: "76%", top: "68%", width: "w-28", delay: 1.6 },
  { left: "42%", top: "84%", width: "w-24", delay: 0.9 },
];

export default function CatalogSection({ products }: CatalogSectionProps) {
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const isLiteMode = isMobile || prefersReducedMotion;
  const [search, setSearch] = useState("");
  const [rankFilter, setRankFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [nickFilter, setNickFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);

  // Keep this block commented so we can quickly restore the extra demo section later.
  // const featured = useMemo(
  //   () =>
  //     products.filter(
  //       (product) => product.status === "available" && Boolean(product.featured),
  //     ),
  //   [products],
  // );

  const availableProducts = useMemo(
    () => products.filter((product) => product.status === "available"),
    [products],
  );

  const rankOptions = useMemo(
    () => {
      const availableRankSet = new Set(availableProducts.map((product) => product.rank));
      const orderedKnownRanks = valorantRanks.filter((rank) => availableRankSet.has(rank));
      const unknownRanks = [...availableRankSet].filter(
        (rank) => !valorantRanks.includes(rank as (typeof valorantRanks)[number]),
      );

      return [...orderedKnownRanks, ...unknownRanks];
    },
    [availableProducts],
  );

  const regionOptions = useMemo(
    () => [...new Set(availableProducts.map((product) => product.region))],
    [availableProducts],
  );

  const nickOptions = useMemo(
    () => [...new Set(availableProducts.map((product) => product.changeNick))],
    [availableProducts],
  );

  const available = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const filtered = availableProducts.filter((product) => {
      const matchesSearch =
        !normalizedSearch ||
        product.code.toLowerCase().includes(normalizedSearch) ||
        product.rank.toLowerCase().includes(normalizedSearch);

      const matchesRank = rankFilter === "all" || product.rank === rankFilter;
      const matchesRegion =
        regionFilter === "all" || product.region === regionFilter;
      const matchesNick =
        nickFilter === "all" || product.changeNick === nickFilter;

      return matchesSearch && matchesRank && matchesRegion && matchesNick;
    });

    if (sortBy === "price-asc") {
      return [...filtered].sort((left, right) => left.price - right.price);
    }

    if (sortBy === "price-desc") {
      return [...filtered].sort((left, right) => right.price - left.price);
    }

    return filtered;
  }, [availableProducts, nickFilter, rankFilter, regionFilter, search, sortBy]);

  const totalPages = Math.max(1, Math.ceil(available.length / ACCOUNTS_PER_PAGE));
  const currentPageSafe = Math.min(currentPage, totalPages);
  const startIndex = available.length === 0 ? 0 : (currentPageSafe - 1) * ACCOUNTS_PER_PAGE;
  const endIndex = Math.min(startIndex + ACCOUNTS_PER_PAGE, available.length);
  const visibleProducts = available.slice(startIndex, endIndex);
  const visibleAmbientParticles = isLiteMode ? ambientParticles.slice(0, 2) : ambientParticles;
  const paginationItems = useMemo(() => {
    if (totalPages <= 1) {
      return [1];
    }

    const pages = new Set<number>([1, totalPages, currentPageSafe - 1, currentPageSafe, currentPageSafe + 1]);
    const sortedPages = [...pages]
      .filter((page) => page >= 1 && page <= totalPages)
      .sort((left, right) => left - right);

    const items: Array<number | string> = [];

    sortedPages.forEach((page, index) => {
      const previous = sortedPages[index - 1];

      if (previous && page - previous > 1) {
        items.push(`ellipsis-${previous}-${page}`);
      }

      items.push(page);
    });

    return items;
  }, [currentPageSafe, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, rankFilter, regionFilter, nickFilter, sortBy]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const resetFilters = () => {
    setSearch("");
    setRankFilter("all");
    setRegionFilter("all");
    setNickFilter("all");
    setSortBy("default");
    setCurrentPage(1);
  };

  return (
    <section id="catalog" className="relative isolate overflow-hidden pb-14 pt-3 sm:pb-16 sm:pt-4 lg:pb-20 lg:pt-4">
      <div className={`absolute inset-0 ${styles.catalogShell}`} />
      <div className={`absolute inset-0 opacity-90 ${styles.catalogAura}`} />
      <div className={`absolute inset-0 ${styles.catalogMesh}`} />
      <div className={`absolute inset-0 ${styles.catalogEdgeFade}`} />
      <div className={`absolute inset-x-0 top-0 h-72 ${styles.catalogGlowTop}`} />
      <div className={`absolute inset-x-0 bottom-0 h-80 ${styles.catalogGlowBottom}`} />
      <div className={`absolute inset-0 ${styles.catalogVignette}`} />
      <div className={`absolute left-0 right-0 ${styles.catalogStripTop}`} />
      <div className={`absolute left-0 right-0 ${styles.catalogStripBottom}`} />

      {visibleAmbientParticles.map((particle) => (
        <motion.span
          key={`${particle.left}-${particle.top}`}
          className={styles.ambientParticle}
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
          }}
          animate={
            isLiteMode
              ? { opacity: particle.opacity, y: 0, x: 0, scale: 1 }
              : {
                  opacity: [particle.opacity, particle.opacity * 1.4, particle.opacity],
                  y: [0, -18, 0],
                  x: [0, 10, 0],
                  scale: [1, 1.06, 0.98],
                }
          }
          transition={
            isLiteMode
              ? { duration: 0.2 }
              : {
                  duration: particle.duration,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                  delay: particle.delay,
                }
          }
        />
      ))}

      {techLines.map((line) => (
        <motion.div
          key={`${line.left}-${line.top}`}
          className="pointer-events-none absolute hidden items-center gap-2 lg:flex"
          style={{ left: line.left, top: line.top }}
          animate={{ opacity: [0.15, 0.48, 0.18], x: [0, 12, 0] }}
          transition={{
            duration: 5.4,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: line.delay,
          }}
        >
          <span className={styles.techDot} />
          <span className={`h-px ${line.width} ${styles.techLine}`} />
        </motion.div>
      ))}

      <div className={styles.catalogContainer}>

        <div>
          <motion.div
            className={styles.catalogHeader}
            initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div>
              <span className={styles.sectionKicker}>
                BROWSE OUR COLLECTION
              </span>
              <h2 className={styles.sectionTitle}>
                ACCOUNT <span className="text-primary">CATALOG</span>
              </h2>
            </div>

            <div className={styles.filtersPanel}>
              <div id="catalog-filters-content" className={styles.filtersBody}>
                <div className={styles.filtersGrid}>
                  <label className={styles.filterGroup}>
                    <span className={styles.filterLabel}>
                      Cari Kode / Skin
                    </span>
                    <span className={styles.filterField}>
                      <input
                        type="text"
                        placeholder="Contoh: Vandal, Oni..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        className={styles.filterInput}
                      />
                    </span>
                  </label>

                  <label className={styles.filterGroup}>
                    <span className={styles.filterLabel}>
                      Cari Rank
                    </span>
                    <span className={`${styles.filterField} ${styles.selectWrap}`}>
                      <select
                        value={rankFilter}
                        onChange={(event) => setRankFilter(event.target.value)}
                        className={styles.selectField}
                      >
                        <option value="all">Semua Rank</option>
                        {rankOptions.map((rank) => (
                          <option key={rank} value={rank}>{rank}</option>
                        ))}
                      </select>
                      <ChevronDown size={16} className={styles.selectIcon} />
                    </span>
                  </label>

                  <label className={styles.filterGroup}>
                    <span className={styles.filterLabel}>
                      Region
                    </span>
                    <span className={`${styles.filterField} ${styles.selectWrap}`}>
                      <select
                        value={regionFilter}
                        onChange={(event) => setRegionFilter(event.target.value)}
                        className={styles.selectField}
                      >
                        <option value="all">Semua Region</option>
                        {regionOptions.map((region) => (
                          <option key={region} value={region}>{region}</option>
                        ))}
                      </select>
                      <ChevronDown size={16} className={styles.selectIcon} />
                    </span>
                  </label>

                  <label className={styles.filterGroup}>
                    <span className={styles.filterLabel}>
                      Ganti Nick
                    </span>
                    <span className={`${styles.filterField} ${styles.selectWrap}`}>
                      <select
                        value={nickFilter}
                        onChange={(event) => setNickFilter(event.target.value)}
                        className={styles.selectField}
                      >
                        <option value="all">Semua Status</option>
                        {nickOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      <ChevronDown size={16} className={styles.selectIcon} />
                    </span>
                  </label>

                  <label className={styles.filterGroup}>
                    <span className={styles.filterLabel}>
                      Urutkan Harga
                    </span>
                    <span className={`${styles.filterField} ${styles.selectWrap}`}>
                      <select
                        value={sortBy}
                        onChange={(event) => setSortBy(event.target.value)}
                        className={styles.selectField}
                      >
                        <option value="default">Terbaru (Default)</option>
                        <option value="price-asc">Harga Termurah</option>
                        <option value="price-desc">Harga Termahal</option>
                      </select>
                      <ChevronDown size={16} className={styles.selectIcon} />
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={resetFilters}
                    className={styles.resetButton}
                  >
                    Reset Filter
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          <div className={styles.catalogGrid}>
            {visibleProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={startIndex + index}
              />
            ))}
          </div>

          {available.length === 0 && (
            <div className="mt-16 flex flex-col items-center gap-3 sm:mt-20">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/30">
                <Search size={24} className="text-muted-foreground/30" />
              </div>
              <p className="font-display text-sm tracking-widest text-muted-foreground/50">
                NO ACCOUNTS FOUND
              </p>
            </div>
          )}

          {available.length > 0 && (
            <div className="mt-8 flex flex-col items-center gap-4 sm:mt-10">
              <p className="text-center font-display text-[11px] tracking-[0.18em] text-muted-foreground/60 sm:text-xs">
                Showing {startIndex + 1} - {endIndex} of {available.length}{" "}
                {available.length === 1 ? "Account" : "Accounts"}
              </p>

              {totalPages > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {paginationItems.map((item) => {
                    if (typeof item === "string") {
                      return (
                        <span
                          key={item}
                          className="px-1 font-display text-sm tracking-[0.2em] text-muted-foreground/45"
                        >
                          ...
                        </span>
                      );
                    }

                    const isActive = item === currentPageSafe;

                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setCurrentPage(item)}
                        aria-current={isActive ? "page" : undefined}
                        className={`flex h-10 min-w-10 items-center justify-center rounded-[0.9rem] border px-3 font-display text-sm font-bold transition ${
                          isActive
                            ? "border-primary bg-primary text-primary-foreground shadow-[0_0_24px_hsl(var(--primary)_/_0.28)]"
                            : "border-border/40 bg-card/55 text-foreground/78 hover:border-primary/30 hover:text-primary"
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* {sold.length > 0 && (
          <div>
            <motion.div
              className="mb-8 flex flex-col gap-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center gap-2">
                <Archive size={13} className="text-muted-foreground/40" />
                <span className="font-display text-[11px] tracking-[0.4em] text-muted-foreground/40">
                  RECENTLY PURCHASED
                </span>
              </div>
              <h2 className="font-display text-2xl font-bold tracking-wider text-muted-foreground/50">
                SOLD ACCOUNTS
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {sold.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  className="relative overflow-hidden rounded-xl border border-border/20 bg-card/40 p-4 opacity-50"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xs font-bold tracking-wider text-muted-foreground/60">
                      {product.code}
                    </span>
                    <span className="rounded border border-destructive/20 bg-destructive/5 px-2 py-0.5 font-display text-[9px] tracking-[0.2em] text-destructive/60">
                      SOLD
                    </span>
                  </div>
                  <p className="mt-1.5 font-display text-sm text-muted-foreground/40">
                    {product.rank}
                  </p>
                  <p className="mt-0.5 font-display text-xs text-muted-foreground/30">
                    Rp {new Intl.NumberFormat("id-ID").format(product.price)}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )} */}
      </div>
    </section>
  );
}
