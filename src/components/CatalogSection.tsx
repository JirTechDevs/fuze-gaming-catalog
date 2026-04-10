import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import ProductCard from "./ProductCard";
import ProductModal from "./ProductModal";
import { Product, sampleProducts } from "@/lib/data";

const CatalogSection = () => {
  const [selected, setSelected] = useState<Product | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "available" | "sold">("all");

  const filtered = useMemo(() => {
    return sampleProducts.filter((p) => {
      const matchSearch = p.code.toLowerCase().includes(search.toLowerCase()) || p.rank.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === "all" || p.status === filter;
      return matchSearch && matchFilter;
    });
  }, [search, filter]);

  const filters: { label: string; value: "all" | "available" | "sold" }[] = [
    { label: "All", value: "all" },
    { label: "Available", value: "available" },
    { label: "Sold", value: "sold" },
  ];

  const count = filtered.length;

  return (
    <section id="catalog" className="container mx-auto px-4 py-20">
      {/* Section header */}
      <motion.div
        className="mb-12 flex flex-col gap-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col gap-1">
          <span className="font-display text-[11px] tracking-[0.4em] text-primary/60">BROWSE OUR COLLECTION</span>
          <h2 className="font-display text-3xl font-bold tracking-wider text-foreground md:text-4xl">
            ACCOUNT <span className="text-primary text-glow">CATALOG</span>
          </h2>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={14} className="text-muted-foreground/50" />
            <div className="flex gap-1">
              {filters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`rounded-lg px-3.5 py-1.5 font-display text-[11px] tracking-[0.15em] transition-all duration-200 ${
                    filter === f.value
                      ? "bg-primary/10 text-primary border border-primary/30"
                      : "text-muted-foreground hover:text-foreground border border-transparent"
                  }`}
                >
                  {f.label.toUpperCase()}
                </button>
              ))}
            </div>
            <span className="ml-2 rounded bg-secondary/50 px-2 py-0.5 font-display text-[10px] tracking-wider text-muted-foreground/50">
              {count} {count === 1 ? "ITEM" : "ITEMS"}
            </span>
          </div>

          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
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
        {filtered.map((product, i) => (
          <ProductCard key={product.id} product={product} onSelect={setSelected} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="mt-20 flex flex-col items-center gap-3">
          <div className="h-16 w-16 rounded-full bg-secondary/30 flex items-center justify-center">
            <Search size={24} className="text-muted-foreground/30" />
          </div>
          <p className="font-display text-sm tracking-widest text-muted-foreground/50">NO ACCOUNTS FOUND</p>
        </div>
      )}

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </section>
  );
};

export default CatalogSection;
