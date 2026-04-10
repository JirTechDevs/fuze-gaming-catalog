import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, Star, Archive } from "lucide-react";
import ProductCard from "./ProductCard";
import FeaturedCard from "./FeaturedCard";
import ProductModal from "./ProductModal";
import { Product, sampleProducts } from "@/lib/data";

const CatalogSection = () => {
  const [selected, setSelected] = useState<Product | null>(null);
  const [search, setSearch] = useState("");

  const featured = useMemo(
    () => sampleProducts.filter((p) => p.featured && p.status === "available"),
    []
  );
  const latestAccounts = useMemo(() => [...featured, ...featured], [featured]);

  const available = useMemo(() => {
    return sampleProducts
      .filter((p) => p.status === "available" && !p.featured)
      .filter(
        (p) =>
          !search ||
          p.code.toLowerCase().includes(search.toLowerCase()) ||
          p.rank.toLowerCase().includes(search.toLowerCase())
      );
  }, [search]);

  const sold = useMemo(
    () => sampleProducts.filter((p) => p.status === "sold"),
    []
  );

  return (
    <section id="catalog" className="container mx-auto px-4 py-20 space-y-24">
      {/* ─── Latest ─── */}
      {featured.length > 0 && (
        <div>
          <motion.div
            className="mb-8 flex flex-col gap-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2">
              <Star size={14} className="text-primary" />
              <span className="font-display text-[11px] tracking-[0.4em] text-primary/60">
                FRESH DROP SHOWCASE
              </span>
            </div>
            <h2 className="font-display text-3xl font-bold tracking-wider text-foreground md:text-4xl">
              LATEST <span className="text-primary text-glow">ACCOUNTS</span>
            </h2>
          </motion.div>

          <div className="latest-strip-mask relative overflow-hidden rounded-[28px] border border-border/20 bg-card/30 p-4 backdrop-blur-sm">
            <div className="latest-strip-track flex w-max gap-5">
              {latestAccounts.map((product, i) => (
                <FeaturedCard
                  key={`${product.id}-${i}`}
                  product={product}
                  onSelect={setSelected}
                  index={i % featured.length}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── Available ─── */}
      <div>
        <motion.div
          className="mb-10 flex flex-col gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col gap-1">
            <span className="font-display text-[11px] tracking-[0.4em] text-primary/60">
              BROWSE OUR COLLECTION
            </span>
            <h2 className="font-display text-3xl font-bold tracking-wider text-foreground md:text-4xl">
              ACCOUNT <span className="text-primary text-glow">CATALOG</span>
            </h2>
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal
                size={14}
                className="text-muted-foreground/50"
              />
              <span className="rounded bg-secondary/50 px-2 py-0.5 font-display text-[10px] tracking-wider text-muted-foreground/50">
                {available.length}{" "}
                {available.length === 1 ? "ITEM" : "ITEMS"}
              </span>
            </div>

            <div className="relative">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40"
              />
              <input
                type="text"
                placeholder="Search code or rank..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-border/50 bg-card/60 py-2.5 pl-9 pr-4 text-sm text-foreground backdrop-blur-sm placeholder:text-muted-foreground/40 transition-all focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/20 sm:w-60"
              />
            </div>
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {available.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={setSelected}
              index={i}
            />
          ))}
        </div>

        {available.length === 0 && (
          <div className="mt-20 flex flex-col items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/30">
              <Search size={24} className="text-muted-foreground/30" />
            </div>
            <p className="font-display text-sm tracking-widest text-muted-foreground/50">
              NO ACCOUNTS FOUND
            </p>
          </div>
        )}
      </div>

      {/* ─── Sold (Social Proof) ─── */}
      {sold.length > 0 && (
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
            {sold.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
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
      )}

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </section>
  );
};

export default CatalogSection;
