"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Archive, ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/features/catalog/domain/product";
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

const catalogDoodles = [
  { position: "left-[4%] top-[22%]", width: 128, rotate: -6, delay: 0, duration: 10, type: "gamepad" },
  { position: "right-[6%] top-[28%]", width: 144, rotate: 8, delay: 0.8, duration: 11.5, type: "crosshair" },
  { position: "left-[46%] top-[16%]", width: 122, rotate: 0, delay: 0.3, duration: 12.8, type: "tactical-mark" },
  { position: "left-[8%] bottom-[18%]", width: 150, rotate: 5, delay: 1.4, duration: 9.6, type: "blaster" },
  { position: "right-[10%] bottom-[14%]", width: 126, rotate: -7, delay: 0.5, duration: 10.8, type: "joystick" },
] as const;

const GamepadDoodle = () => (
  <svg viewBox="0 0 180 120" className="h-full w-full" aria-hidden="true">
    <path
      d="M44 42 C36 40 28 44 24 52 L16 74 C12 84 18 96 30 96 C37 96 43 92 47 86 L56 72 H124 L133 86 C137 92 143 96 150 96 C162 96 168 84 164 74 L156 52 C152 44 144 40 136 42 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    <path d="M56 56 H76 M66 46 V66" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <circle cx="122" cy="54" r="6" fill="none" stroke="currentColor" strokeWidth="3" />
    <circle cx="138" cy="68" r="6" fill="none" stroke="currentColor" strokeWidth="3" />
    <path d="M90 46 V72" stroke="currentColor" strokeOpacity="0.36" strokeWidth="2" strokeDasharray="4 8" />
  </svg>
);

const CrosshairDoodle = () => (
  <svg viewBox="0 0 160 160" className="h-full w-full" aria-hidden="true">
    <circle cx="80" cy="80" r="28" fill="none" stroke="currentColor" strokeWidth="3" />
    <circle
      cx="80"
      cy="80"
      r="50"
      fill="none"
      stroke="currentColor"
      strokeOpacity="0.32"
      strokeWidth="2"
      strokeDasharray="6 10"
    />
    <path d="M80 12 V40 M80 120 V148 M12 80 H40 M120 80 H148" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <circle cx="80" cy="80" r="7" fill="currentColor" />
  </svg>
);

const BlasterDoodle = () => (
  <svg viewBox="0 0 190 120" className="h-full w-full" aria-hidden="true">
    <path
      d="M22 58 H98 L124 36 H152 L168 50 L138 72 H100 L70 94 H40 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    <path d="M100 58 H170" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <path d="M136 34 L154 18" stroke="currentColor" strokeOpacity="0.42" strokeWidth="2.4" strokeLinecap="round" />
    <path d="M144 82 L160 96" stroke="currentColor" strokeOpacity="0.42" strokeWidth="2.4" strokeLinecap="round" />
    <circle cx="56" cy="58" r="7" fill="none" stroke="currentColor" strokeWidth="3" />
  </svg>
);

const JoystickDoodle = () => (
  <svg viewBox="0 0 150 150" className="h-full w-full" aria-hidden="true">
    <circle cx="75" cy="34" r="14" fill="none" stroke="currentColor" strokeWidth="3" />
    <path d="M75 48 V94" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    <path
      d="M36 94 H114 L126 122 H24 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    <circle cx="56" cy="108" r="5" fill="none" stroke="currentColor" strokeWidth="2.6" />
    <circle cx="96" cy="108" r="5" fill="none" stroke="currentColor" strokeWidth="2.6" />
  </svg>
);

const TacticalMarkDoodle = () => (
  <svg viewBox="0 0 150 120" className="h-full w-full" aria-hidden="true">
    <path
      d="M18 20 L62 96 H84 L62 56 H88 L132 20 H102 L74 46 L48 20 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.2"
      strokeLinejoin="round"
    />
    <path
      d="M36 20 L74 86 L114 20"
      fill="none"
      stroke="currentColor"
      strokeOpacity="0.34"
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <path d="M58 102 H92" stroke="currentColor" strokeOpacity="0.38" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default function CatalogSection({ products }: CatalogSectionProps) {
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const isLiteMode = isMobile || prefersReducedMotion;
  const [search, setSearch] = useState("");
  const [rankFilter, setRankFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [nickFilter, setNickFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [filtersOpen, setFiltersOpen] = useState(false);
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
    () => [...new Set(availableProducts.map((product) => product.rank))],
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

  const sold = useMemo(
    () => products.filter((product) => product.status === "sold"),
    [products],
  );

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
    <section id="catalog" className="relative isolate overflow-hidden py-14 sm:py-16 lg:py-20">
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
          className={`pointer-events-none absolute rounded-full bg-primary/14 blur-3xl ${styles.ambientParticle}`}
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
          <span className="h-1.5 w-1.5 rounded-full bg-primary/80 shadow-[0_0_16px_hsl(var(--primary)_/_0.7)]" />
          <span className={`h-px ${line.width} ${styles.techLine}`} />
        </motion.div>
      ))}

      {catalogDoodles.map((doodle) => (
        <motion.div
          key={doodle.position}
          className={`pointer-events-none absolute hidden text-primary/28 xl:block ${doodle.position}`}
          style={{ width: doodle.width }}
          initial={{ opacity: 0.16, rotate: doodle.rotate }}
          animate={{
            opacity: [0.14, 0.3, 0.16],
            y: [0, -12, 0],
            rotate: [doodle.rotate, doodle.rotate + 2, doodle.rotate],
          }}
          transition={{
            duration: doodle.duration,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: doodle.delay,
          }}
        >
          {doodle.type === "gamepad" && <GamepadDoodle />}
          {doodle.type === "crosshair" && <CrosshairDoodle />}
          {doodle.type === "tactical-mark" && <TacticalMarkDoodle />}
          {doodle.type === "blaster" && <BlasterDoodle />}
          {doodle.type === "joystick" && <JoystickDoodle />}
        </motion.div>
      ))}

      <div className="relative z-10 container mx-auto space-y-16 px-4 sm:space-y-20 lg:space-y-24">
        <div>
          <motion.div
            className="mb-8 flex flex-col gap-6 sm:mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex flex-col gap-2">
              <span className="font-display text-[11px] tracking-[0.4em] text-primary/60">
                BROWSE OUR COLLECTION
              </span>
              <h2 className="font-display text-3xl font-bold tracking-[0.12em] text-foreground md:text-4xl">
                ACCOUNT <span className="text-primary text-glow">CATALOG</span>
              </h2>
            </div>

            <div className="rounded-[1.5rem] border border-border/40 bg-card/75 p-4 backdrop-blur-none sm:bg-card/50 sm:backdrop-blur-md sm:p-5 lg:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={14} className="text-muted-foreground/50" />
                  <span className="font-display text-[11px] tracking-[0.28em] text-muted-foreground/60">
                    FILTER CATALOG
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 sm:justify-end">
                  <span className="rounded bg-secondary/50 px-2 py-0.5 font-display text-[10px] tracking-wider text-muted-foreground/50">
                    {available.length} {available.length === 1 ? "ACCOUNT" : "ACCOUNTS"}
                  </span>
                  <button
                    type="button"
                    onClick={() => setFiltersOpen((current) => !current)}
                    aria-expanded={filtersOpen}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-3 py-2 font-display text-[10px] tracking-[0.18em] text-primary transition hover:bg-primary hover:text-primary-foreground"
                  >
                    {filtersOpen ? "COLLAPSE" : "FILTERS"}
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${filtersOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>
              </div>

              <AnimatePresence initial={false}>
                {filtersOpen && (
                  <motion.div
                    key="catalog-filters"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 grid grid-cols-1 gap-3 border-t border-white/5 pt-4 sm:grid-cols-2 xl:grid-cols-5">
                      <label className="block sm:col-span-2 xl:col-span-1">
                        <span className="mb-1.5 block font-display text-[10px] tracking-[0.22em] text-muted-foreground/55">
                          SEARCH
                        </span>
                        <div className="relative">
                          <Search
                            size={15}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40"
                          />
                          <input
                            type="text"
                            placeholder="Code or rank..."
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            className="w-full rounded-lg border border-border/50 bg-background/40 py-2.5 pl-9 pr-4 text-sm text-foreground backdrop-blur-sm placeholder:text-muted-foreground/40 transition-all focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/20"
                          />
                        </div>
                      </label>

                      <label className="block">
                        <span className="mb-1.5 block font-display text-[10px] tracking-[0.22em] text-muted-foreground/55">
                          RANK
                        </span>
                        <select
                          value={rankFilter}
                          onChange={(event) => setRankFilter(event.target.value)}
                          className="w-full rounded-lg border border-border/50 bg-background/40 px-3 py-2.5 text-sm text-foreground backdrop-blur-sm transition-all focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/20"
                        >
                          <option value="all">All ranks</option>
                          {rankOptions.map((rank) => (
                            <option key={rank} value={rank}>
                              {rank}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="block">
                        <span className="mb-1.5 block font-display text-[10px] tracking-[0.22em] text-muted-foreground/55">
                          REGION
                        </span>
                        <select
                          value={regionFilter}
                          onChange={(event) => setRegionFilter(event.target.value)}
                          className="w-full rounded-lg border border-border/50 bg-background/40 px-3 py-2.5 text-sm text-foreground backdrop-blur-sm transition-all focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/20"
                        >
                          <option value="all">All regions</option>
                          {regionOptions.map((region) => (
                            <option key={region} value={region}>
                              {region}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="block">
                        <span className="mb-1.5 block font-display text-[10px] tracking-[0.22em] text-muted-foreground/55">
                          CHANGE NICK
                        </span>
                        <select
                          value={nickFilter}
                          onChange={(event) => setNickFilter(event.target.value)}
                          className="w-full rounded-lg border border-border/50 bg-background/40 px-3 py-2.5 text-sm text-foreground backdrop-blur-sm transition-all focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/20"
                        >
                          <option value="all">All status</option>
                          {nickOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="block">
                        <span className="mb-1.5 block font-display text-[10px] tracking-[0.22em] text-muted-foreground/55">
                          SORT
                        </span>
                        <select
                          value={sortBy}
                          onChange={(event) => setSortBy(event.target.value)}
                          className="w-full rounded-lg border border-border/50 bg-background/40 px-3 py-2.5 text-sm text-foreground backdrop-blur-sm transition-all focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/20"
                        >
                          <option value="default">Recommended</option>
                          <option value="price-asc">Price: Low to High</option>
                          <option value="price-desc">Price: High to Low</option>
                        </select>
                      </label>

                      <button
                        type="button"
                        onClick={resetFilters}
                        className="rounded-full border border-primary/20 bg-primary/8 px-3 py-2 font-display text-[10px] tracking-[0.18em] text-primary transition hover:bg-primary hover:text-primary-foreground sm:col-span-2 xl:col-span-5 xl:justify-self-end"
                      >
                        RESET
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 items-stretch gap-3 sm:gap-5 lg:gap-6 xl:grid-cols-3">
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
