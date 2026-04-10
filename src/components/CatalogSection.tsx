import { useState, useMemo } from "react";
import { Search } from "lucide-react";
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

  return (
    <section id="catalog" className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="font-display text-2xl font-bold tracking-widest text-foreground">
          ACCOUNT <span className="text-primary text-glow">CATALOG</span>
        </h2>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Filter pills */}
          <div className="flex gap-1.5">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`rounded-full px-3 py-1 font-display text-xs tracking-wider transition-all ${
                  filter === f.value
                    ? "bg-primary text-primary-foreground box-glow"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {f.label.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search code or rank..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-border bg-secondary py-2 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 sm:w-56"
            />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product, i) => (
          <ProductCard key={product.id} product={product} onSelect={setSelected} index={i} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-12 text-center font-display text-sm tracking-wider text-muted-foreground">NO ACCOUNTS FOUND</p>
      )}

      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </section>
  );
};

export default CatalogSection;
