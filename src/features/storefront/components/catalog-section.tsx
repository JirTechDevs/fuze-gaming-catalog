"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight, Filter as FilterIcon, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "@/features/catalog/domain/product";
import { valorantRanks } from "@/features/catalog/domain/valorant-ranks";
import { useRealtimeProducts } from "@/features/catalog/hooks/use-realtime-products";
import { useIsMobile } from "@/hooks/use-mobile";
import ProductCard from "@/features/storefront/components/product-card";
import { Slider } from "@/components/ui/slider";
import styles from "./catalog-section.module.css";

interface CatalogSectionProps {
  products: Product[];
  forceLiteMode?: boolean;
}

const ACCOUNTS_PER_PAGE = 12;

const sortOptions = [
  { value: "default", label: "Terbaru" },
  { value: "price-asc", label: "Termurah" },
  { value: "price-desc", label: "Termahal" },
] as const;

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

export default function CatalogSection({ products: initialProducts, forceLiteMode = false }: CatalogSectionProps) {
  const products = useRealtimeProducts(initialProducts);
  const isMobile = useIsMobile();
  const prefersReducedMotion = useReducedMotion();
  const isLiteMode = forceLiteMode || isMobile || prefersReducedMotion;
  const [search, setSearch] = useState("");
  const [rankFilter, setRankFilter] = useState("all");
  const [nickFilter, setNickFilter] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [sortOpen, setSortOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Price range filters
  const [minPriceInput, setMinPriceInput] = useState("");
  const [maxPriceInput, setMaxPriceInput] = useState("");
  const [debouncedMinPrice, setDebouncedMinPrice] = useState("");
  const [debouncedMaxPrice, setDebouncedMaxPrice] = useState("");

  const [priceOpen, setPriceOpen] = useState(false);
  const priceRef = useRef<HTMLDivElement | null>(null);

  const isInitialized = useRef(false);
  const restoredPage = useRef<number | null>(null);

  const gridRef = useRef<HTMLDivElement | null>(null);
  const sortRef = useRef<HTMLDivElement | null>(null);
  const skipScrollRef = useRef(true);

  // Load state from sessionStorage on mount
  useEffect(() => {
    const savedSearch = sessionStorage.getItem("catalog_search");
    const savedRank = sessionStorage.getItem("catalog_rank");
    const savedNick = sessionStorage.getItem("catalog_nick");
    const savedSortBy = sessionStorage.getItem("catalog_sort_by");
    const savedPage = sessionStorage.getItem("catalog_page");
    const savedMinPrice = sessionStorage.getItem("catalog_min_price");
    const savedMaxPrice = sessionStorage.getItem("catalog_max_price");

    if (savedSearch !== null) setSearch(savedSearch);
    if (savedRank !== null) setRankFilter(savedRank);
    if (savedNick !== null) setNickFilter(savedNick);
    if (savedSortBy !== null) setSortBy(savedSortBy);
    if (savedPage !== null) {
      const pageNum = Number(savedPage);
      setCurrentPage(pageNum);
      restoredPage.current = pageNum;
    }
    if (savedMinPrice !== null) {
      setMinPriceInput(savedMinPrice);
      setDebouncedMinPrice(savedMinPrice);
    }
    if (savedMaxPrice !== null) {
      setMaxPriceInput(savedMaxPrice);
      setDebouncedMaxPrice(savedMaxPrice);
    }

    isInitialized.current = true;
  }, []);

  // Save changes to sessionStorage
  useEffect(() => {
    if (!isInitialized.current) return;
    sessionStorage.setItem("catalog_search", search);
  }, [search]);

  useEffect(() => {
    if (!isInitialized.current) return;
    sessionStorage.setItem("catalog_rank", rankFilter);
  }, [rankFilter]);


  useEffect(() => {
    if (!isInitialized.current) return;
    sessionStorage.setItem("catalog_nick", nickFilter);
  }, [nickFilter]);

  useEffect(() => {
    if (!isInitialized.current) return;
    sessionStorage.setItem("catalog_sort_by", sortBy);
  }, [sortBy]);

  useEffect(() => {
    if (!isInitialized.current) return;
    sessionStorage.setItem("catalog_page", currentPage.toString());
  }, [currentPage]);

  useEffect(() => {
    if (!isInitialized.current) return;
    sessionStorage.setItem("catalog_min_price", minPriceInput);
  }, [minPriceInput]);

  useEffect(() => {
    if (!isInitialized.current) return;
    sessionStorage.setItem("catalog_max_price", maxPriceInput);
  }, [maxPriceInput]);

  // Debouncing for price filters
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedMinPrice(minPriceInput);
    }, 300);
    return () => clearTimeout(handler);
  }, [minPriceInput]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedMaxPrice(maxPriceInput);
    }, 300);
    return () => clearTimeout(handler);
  }, [maxPriceInput]);

  // Close sort dropdown on outside click / Escape.
  useEffect(() => {
    if (!sortOpen) return;
    const onPointer = (event: PointerEvent) => {
      if (!sortRef.current?.contains(event.target as Node)) setSortOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSortOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [sortOpen]);

  // Close price dropdown on outside click / Escape.
  useEffect(() => {
    if (!priceOpen) return;
    const onPointer = (event: PointerEvent) => {
      if (!priceRef.current?.contains(event.target as Node)) setPriceOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPriceOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [priceOpen]);

  const sortLabel = sortOptions.find((option) => option.value === sortBy)?.label ?? "Terbaru";

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
      const baseRankSet = new Set(
        availableProducts.map((product) => product.rank.split(" ")[0]),
      );
      const unknownRanks = [...baseRankSet].filter(
        (rank) => !valorantRanks.includes(rank as (typeof valorantRanks)[number]),
      );

      return [...valorantRanks, ...unknownRanks];
    },
    [availableProducts],
  );

  // Helper: format raw number string as Indonesian dot-separated display ("600000" → "600.000")
  const formatPriceDisplay = (raw: string): string => {
    if (!raw) return "";
    const digits = raw.replace(/\D/g, "");
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  // Helper: strip formatting dots to get raw digits only
  const parsePriceInput = (formatted: string): string =>
    formatted.replace(/\./g, "");

  const nickOptions = useMemo(
    () => [...new Set(availableProducts.map((product) => product.changeNick))],
    [availableProducts],
  );

  // Derived: slider max ceiling — round up to the nearest 500k above the highest product price, minimum 5M.
  const sliderMax = useMemo(() => {
    const maxProductPrice = availableProducts.reduce((acc, p) => Math.max(acc, p.price), 0);
    return Math.max(5_000_000, Math.ceil(maxProductPrice / 500_000) * 500_000);
  }, [availableProducts]);

  const SLIDER_STEP = 10_000;

  // Slider value: [min, max] in raw numbers (empty string = boundary)
  const sliderValue: [number, number] = [
    minPriceInput ? Number(minPriceInput) : 0,
    maxPriceInput ? Number(maxPriceInput) : sliderMax,
  ];

  const hasPriceFilter = Boolean(minPriceInput || maxPriceInput);

  const formatPrice = (value: number) =>
    value >= 1_000_000
      ? `${(value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 1)}jt`
      : value >= 1_000
        ? `${(value / 1_000).toFixed(0)}rb`
        : `${value}`;

  const available = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const filtered = availableProducts.filter((product) => {
      const matchesSearch =
        !normalizedSearch ||
        product.code.toLowerCase().includes(normalizedSearch) ||
        product.rank.toLowerCase().includes(normalizedSearch) ||
        product.skins.some((skin) =>
          skin.toLowerCase().includes(normalizedSearch),
        );

      const matchesRank =
        rankFilter === "all" || product.rank.split(" ")[0] === rankFilter;
      const matchesNick =
        nickFilter === "all" || product.changeNick === nickFilter;

      const matchesMinPrice =
        !debouncedMinPrice || product.price >= Number(debouncedMinPrice);
      const matchesMaxPrice =
        !debouncedMaxPrice || product.price <= Number(debouncedMaxPrice);

      return (
        matchesSearch &&
        matchesRank &&
        matchesNick &&
        matchesMinPrice &&
        matchesMaxPrice
      );
    });

    if (sortBy === "price-asc") {
      return [...filtered].sort((left, right) => left.price - right.price);
    }

    if (sortBy === "price-desc") {
      return [...filtered].sort((left, right) => right.price - left.price);
    }

    return filtered;
  }, [
    availableProducts,
    nickFilter,
    rankFilter,
    search,
    sortBy,
    debouncedMinPrice,
    debouncedMaxPrice,
  ]);

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

    const windowSize = 5;
    const half = Math.floor(windowSize / 2);

    let windowStart: number;
    let windowEnd: number;

    if (currentPageSafe - half <= 1) {
      windowStart = 1;
      windowEnd = Math.min(windowSize, totalPages);
    } else if (currentPageSafe + half >= totalPages) {
      windowStart = Math.max(1, totalPages - windowSize + 1);
      windowEnd = totalPages;
    } else {
      windowStart = currentPageSafe - half;
      windowEnd = currentPageSafe + half;
    }

    const pages = new Set<number>([1, totalPages]);
    for (let page = windowStart; page <= windowEnd; page++) {
      pages.add(page);
    }

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
    if (!isInitialized.current) return;

    if (restoredPage.current !== null) {
      restoredPage.current = null;
      return;
    }

    setCurrentPage(1);
  }, [
    search,
    rankFilter,
    nickFilter,
    sortBy,
    debouncedMinPrice,
    debouncedMaxPrice,
  ]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (skipScrollRef.current) {
      skipScrollRef.current = false;
      return;
    }

    gridRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [currentPageSafe]);

  const resetFilters = () => {
    setSearch("");
    setRankFilter("all");
    setNickFilter("all");
    setSortBy("default");
    setCurrentPage(1);
    setMinPriceInput("");
    setMaxPriceInput("");
    setDebouncedMinPrice("");
    setDebouncedMaxPrice("");

    // Clear all storage keys to make sure next navigation starts fresh
    sessionStorage.removeItem("catalog_search");
    sessionStorage.removeItem("catalog_rank");
    sessionStorage.removeItem("catalog_nick");
    sessionStorage.removeItem("catalog_sort_by");
    sessionStorage.removeItem("catalog_page");
    sessionStorage.removeItem("catalog_min_price");
    sessionStorage.removeItem("catalog_max_price");
  };

  return (
    <section id="catalog" className={`relative isolate overflow-hidden pb-14 pt-3 sm:pb-16 sm:pt-4 lg:pb-20 lg:pt-4 ${isLiteMode ? styles.catalogLite : ""}`}>
      <h2 className="sr-only">Katalog Akun Valorant Ready</h2>
      <div className={`absolute inset-0 ${styles.catalogShell}`} />
      <div className={`absolute inset-0 opacity-90 ${styles.catalogAura}`} />
      <div className={`absolute inset-0 ${styles.catalogMesh}`} />
      <div className={`absolute inset-0 ${styles.catalogEdgeFade}`} />
      <div className={`absolute inset-x-0 top-0 h-72 ${styles.catalogGlowTop}`} />
      <div className={`absolute inset-x-0 bottom-0 h-80 ${styles.catalogGlowBottom}`} />
      <div className={`absolute inset-0 ${styles.catalogVignette}`} />
      <div className={`absolute left-0 right-0 ${styles.catalogStripTop}`} />
      <div className={`absolute left-0 right-0 ${styles.catalogStripBottom}`} />

      {!isLiteMode && visibleAmbientParticles.map((particle) => (
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

      {!isLiteMode && techLines.map((line) => (
        <motion.div
          key={`${line.left}-${line.top}`}
          className="pointer-events-none absolute hidden items-center gap-2 lg:flex"
          style={{ left: line.left, top: line.top }}
          animate={isLiteMode ? { opacity: 0.18, x: 0 } : { opacity: [0.15, 0.48, 0.18], x: [0, 12, 0] }}
          transition={isLiteMode ? {} : {
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
            {/* <div>
              <span className={styles.sectionKicker}>
                BROWSE OUR COLLECTION
              </span>
              <h2 className={styles.sectionTitle}>
                ACCOUNT <span className="text-primary">CATALOG</span>
              </h2>
            </div> */}

            <div className={styles.filtersPanel}>
              <div id="catalog-filters-content" className={styles.filtersBody}>
                {/* ── Filter rows ── */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">

                  {/* Row 1 (mobile) / Order 1 (desktop): Search with opaque prefix */}
                  <label className={`${styles.filterGroup} relative block w-full sm:order-1 sm:flex-1`}>
                    <span className="sr-only">Cari Skin</span>
                    <span className={`${styles.filterField} relative flex h-10 w-full items-center sm:h-11`}>
                      <input
                        type="text"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        aria-label="Cari skin"
                        className="h-full w-full appearance-none border-none bg-transparent px-3 text-[13px] text-foreground outline-none sm:px-4 sm:text-sm"
                      />

                      {/* Custom Overlay Placeholder */}
                      {!search && (
                        <div className="pointer-events-none absolute left-3 top-1/2 flex -translate-y-1/2 items-center gap-1.5 select-none text-[13px] sm:left-4 sm:text-sm">
                          <span className="font-medium text-foreground">Cari skin :</span>
                          <span className="text-muted-foreground/35">Vandal Kuronami</span>
                        </div>
                      )}
                    </span>
                  </label>
                  {/* Row 2 (mobile): Filter pill + Sort dropdown */}
                  <div className="flex gap-2 sm:contents">
                    {/* Mobile-only Filter toggle pill */}
                    <button
                      type="button"
                      onClick={() => setIsFilterOpen((current) => !current)}
                      aria-expanded={isFilterOpen}
                      className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-[0.75rem] bg-primary px-3 font-display text-[12px] font-bold tracking-[0.06em] text-primary-foreground transition hover:brightness-105 sm:hidden"
                    >
                      <FilterIcon size={13} />
                      Filter
                      <FilterIcon size={13} />
                    </button>

                    {/* Sort dropdown */}
                    <div
                      ref={sortRef}
                      className={`${styles.filterGroup} relative block flex-1 sm:order-4 sm:flex-none sm:min-w-[200px]`}
                    >
                      <span className={`${styles.filterField} relative flex h-10 w-full items-center p-0 sm:h-11`}>
                        <button
                          type="button"
                          onClick={() => setSortOpen((current) => !current)}
                          aria-haspopup="listbox"
                          aria-expanded={sortOpen}
                          className="flex h-full w-full items-center justify-between gap-2 bg-transparent px-3 text-[13px] text-foreground outline-none sm:px-4 sm:text-sm"
                        >
                          <span className="flex items-center gap-1.5 truncate">
                            <span className="hidden whitespace-nowrap text-muted-foreground/70 sm:inline">Urutkan :</span>
                            <span className="font-medium text-foreground">{sortLabel}</span>
                          </span>
                          <ChevronDown
                            size={16}
                            className={`shrink-0 text-muted-foreground/70 transition-transform ${sortOpen ? "rotate-180" : ""}`}
                          />
                        </button>

                        {sortOpen && (
                          <ul
                            role="listbox"
                            className="absolute left-0 right-0 top-[calc(100%+6px)] z-30 overflow-hidden rounded-[0.75rem] border border-border/45 bg-card/95 shadow-[0_18px_44px_rgba(0,3,15,0.55)] backdrop-blur-md sm:rounded-[0.9rem]"
                          >
                            {sortOptions.map((option) => {
                              const isActive = option.value === sortBy;
                              return (
                                <li key={option.value} role="option" aria-selected={isActive}>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSortBy(option.value);
                                      setSortOpen(false);
                                    }}
                                    className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-[13px] transition sm:text-sm ${isActive ? "bg-primary/15 text-primary" : "text-foreground hover:bg-white/[0.04]"
                                      }`}
                                  >
                                    {option.label}
                                    {isActive && <span className="text-primary">•</span>}
                                  </button>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Rank + Nick — mobile: collapsible drawer, desktop: sm:contents flattens into flex row */}
                  <div
                    className={`${isFilterOpen ? "rounded-[1rem] border border-border/35 bg-card/40 p-4" : "hidden"} sm:!contents`}
                  >
                    <div className="grid gap-3 sm:contents">
                      <label className={`${styles.filterGroup} sm:order-2 sm:min-w-[160px] sm:flex-1`}>
                        <span className={`${styles.filterLabel} sm:sr-only`}>Rank</span>
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

                      <label className={`${styles.filterGroup} sm:order-3 sm:min-w-[160px] sm:flex-1`}>
                        <span className={`${styles.filterLabel} sm:sr-only`}>Ganti Nick</span>
                        <span className={`${styles.filterField} ${styles.selectWrap}`}>
                          <select
                            value={nickFilter}
                            onChange={(event) => setNickFilter(event.target.value)}
                            className={styles.selectField}
                          >
                            <option value="all">Ganti Nick</option>
                            {nickOptions.map((nick) => (
                              <option key={nick} value={nick}>{nick}</option>
                            ))}
                          </select>
                          <ChevronDown size={16} className={styles.selectIcon} />
                        </span>
                      </label>
                    </div>

                    <div className="mt-4 flex justify-end sm:contents">
                      <button
                        type="button"
                        onClick={resetFilters}
                        className={`${styles.resetButton} px-6 sm:order-6`}
                      >
                        Reset Filter
                      </button>
                    </div>
                  </div>

                  {/* Row 3 (mobile) / Order 5 (desktop): Filter Harga — full width on mobile, inline on desktop */}
                  <div ref={priceRef} className="relative sm:order-5">
                    <button
                      type="button"
                      id="price-filter-btn"
                      onClick={() => setPriceOpen((prev) => !prev)}
                      aria-haspopup="true"
                      aria-expanded={priceOpen}
                      className={`inline-flex h-9 w-full items-center justify-center gap-2 rounded-[0.75rem] border px-3 font-display text-[12px] font-bold tracking-[0.04em] transition sm:h-11 sm:w-auto sm:rounded-[0.9rem] sm:px-4 sm:text-sm ${hasPriceFilter
                        ? "border-primary/60 bg-primary/10 text-primary shadow-[0_0_14px_hsl(var(--primary)_/_0.18)]"
                        : "border-border/45 bg-card/55 text-foreground/80 hover:border-primary/30 hover:text-primary"
                        }`}
                    >
                      <span>Filter Harga</span>
                      {hasPriceFilter && (
                        <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[9px] font-black text-primary-foreground">
                          ✓
                        </span>
                      )}
                      <ChevronDown
                        size={14}
                        className={`shrink-0 text-muted-foreground/70 transition-transform ${priceOpen ? "rotate-180" : ""
                          }`}
                      />
                    </button>

                    {priceOpen && (
                      <div
                        className="absolute left-0 right-0 top-[calc(100%+8px)] z-40 rounded-[1rem] border border-border/50 bg-card/95 p-4 shadow-[0_18px_44px_rgba(0,3,15,0.6)] backdrop-blur-md sm:left-auto sm:right-0 sm:w-[320px]"
                        role="dialog"
                        aria-label="Filter harga"
                      >
                        {/* Header */}
                        <div className="mb-3 flex items-center justify-between">
                          <span className="font-display text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground/70">
                            Filter Harga
                          </span>
                          {hasPriceFilter && (
                            <button
                              type="button"
                              onClick={() => {
                                setMinPriceInput("");
                                setMaxPriceInput("");
                                setDebouncedMinPrice("");
                                setDebouncedMaxPrice("");
                              }}
                              className="text-[10px] font-bold text-primary/80 transition hover:text-primary"
                            >
                              Reset
                            </button>
                          )}
                        </div>

                        {/* Dual-range slider */}
                        <div className="mb-4">
                          <Slider
                            min={0}
                            max={sliderMax}
                            step={SLIDER_STEP}
                            value={sliderValue}
                            onValueChange={([newMin, newMax]) => {
                              setMinPriceInput(newMin === 0 ? "" : String(newMin));
                              setMaxPriceInput(newMax === sliderMax ? "" : String(newMax));
                            }}
                            className="my-2"
                          />
                          <div className="mt-1 flex justify-between">
                            <span className="text-[10px] text-muted-foreground/55">
                              {formatPrice(sliderValue[0])}
                            </span>
                            <span className="text-[10px] text-muted-foreground/55">
                              {formatPrice(sliderValue[1])}
                            </span>
                          </div>
                        </div>

                        {/* Min / Max text inputs with Indonesian dot formatting */}
                        <div className="flex items-center gap-2">
                          <div className="flex-1">
                            <label className="mb-1 block font-display text-[9px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">
                              Min
                            </label>
                            <input
                              id="price-min-input"
                              type="text"
                              inputMode="numeric"
                              placeholder="0"
                              value={formatPriceDisplay(minPriceInput)}
                              onChange={(e) => setMinPriceInput(parsePriceInput(e.target.value))}
                              className="h-9 w-full rounded-[0.75rem] border border-border/40 bg-background/40 px-3 text-[12px] text-foreground outline-none transition placeholder:text-muted-foreground/40 focus:border-primary/45 focus:ring-2 focus:ring-primary/15"
                            />
                          </div>
                          <span className="mt-5 text-xs font-bold text-muted-foreground/40">—</span>
                          <div className="flex-1">
                            <label className="mb-1 block font-display text-[9px] font-bold uppercase tracking-[0.1em] text-muted-foreground/60">
                              Max
                            </label>
                            <input
                              id="price-max-input"
                              type="text"
                              inputMode="numeric"
                              placeholder="Semua"
                              value={formatPriceDisplay(maxPriceInput)}
                              onChange={(e) => setMaxPriceInput(parsePriceInput(e.target.value))}
                              className="h-9 w-full rounded-[0.75rem] border border-border/40 bg-background/40 px-3 text-[12px] text-foreground outline-none transition placeholder:text-muted-foreground/40 focus:border-primary/45 focus:ring-2 focus:ring-primary/15"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </div>
          </motion.div>

          <div ref={gridRef} className={styles.catalogGrid} style={{ scrollMarginTop: 96 }}>
            {visibleProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                isLiteMode={isLiteMode}
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
                  <button
                    type="button"
                    onClick={() => setCurrentPage(currentPageSafe - 1)}
                    disabled={currentPageSafe === 1}
                    aria-label="Previous page"
                    className="flex h-10 items-center justify-center gap-1 rounded-[0.9rem] border border-border/40 bg-card/55 px-3 font-display text-sm font-bold text-foreground/78 transition hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border/40 disabled:hover:text-foreground/78"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>

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
                        className={`flex h-10 min-w-10 items-center justify-center rounded-[0.9rem] border px-3 font-display text-sm font-bold transition ${isActive
                          ? "border-primary bg-primary text-primary-foreground shadow-[0_0_24px_hsl(var(--primary)_/_0.28)]"
                          : "border-border/40 bg-card/55 text-foreground/78 hover:border-primary/30 hover:text-primary"
                          }`}
                      >
                        {item}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    onClick={() => setCurrentPage(currentPageSafe + 1)}
                    disabled={currentPageSafe === totalPages}
                    aria-label="Next page"
                    className="flex h-10 items-center justify-center gap-1 rounded-[0.9rem] border border-border/40 bg-card/55 px-3 font-display text-sm font-bold text-foreground/78 transition hover:border-primary/30 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border/40 disabled:hover:text-foreground/78"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
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
