import { motion } from "framer-motion";
import { MessageCircle, Shield } from "lucide-react";
import { Product, formatPrice, getWhatsAppLink } from "@/lib/data";

interface Props {
  product: Product;
  onSelect: (product: Product) => void;
  index: number;
}

const rankColors: Record<string, string> = {
  "Iron": "text-[hsl(20,15%,50%)]",
  "Bronze": "text-[hsl(30,50%,45%)]",
  "Silver": "text-[hsl(220,10%,65%)]",
  "Gold": "text-[hsl(45,80%,55%)]",
  "Platinum": "text-[hsl(187,60%,55%)]",
  "Diamond": "text-[hsl(280,60%,65%)]",
  "Ascendant": "text-[hsl(150,60%,50%)]",
  "Immortal": "text-[hsl(0,70%,60%)]",
  "Radiant": "text-[hsl(45,100%,65%)]",
};

const getRankColor = (rank: string) => {
  const base = rank.split(" ")[0];
  return rankColors[base] || "text-foreground";
};

const ProductCard = ({ product, onSelect, index }: Props) => {
  const isSold = product.status === "sold";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className={`group relative cursor-pointer overflow-hidden rounded-xl border border-border/40 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:box-glow ${isSold ? "opacity-50 pointer-events-none" : ""}`}
      onClick={() => !isSold && onSelect(product)}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/0 to-transparent transition-all duration-500 group-hover:via-primary/50" />

      {/* Image area */}
      <div className="relative aspect-[16/10] overflow-hidden bg-secondary/50">
        <img src={product.image} alt={product.code} className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110" />
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
        
        {isSold && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <span className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-1.5 font-display text-sm font-bold tracking-[0.3em] text-destructive">SOLD</span>
          </div>
        )}

        {/* Code badge */}
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-md border border-primary/20 bg-background/90 px-2.5 py-1 backdrop-blur-sm">
          <Shield size={10} className="text-primary" />
          <span className="font-display text-[11px] font-bold tracking-[0.15em] text-primary">{product.code}</span>
        </div>
      </div>

      {/* Content */}
      <div className="relative flex flex-col gap-3 p-5">
        {/* Rank + Region */}
        <div className="flex items-center justify-between">
          <span className={`font-display text-sm font-bold tracking-wide ${getRankColor(product.rank)}`}>
            {product.rank}
          </span>
          <span className="rounded border border-border/50 bg-secondary/50 px-2 py-0.5 font-display text-[10px] tracking-widest text-muted-foreground">
            {product.region}
          </span>
        </div>

        {/* Skins preview */}
        <p className="line-clamp-1 text-xs text-muted-foreground/70">
          {product.skins.slice(0, 2).join(" • ")}
          {product.skins.length > 2 && ` +${product.skins.length - 2}`}
        </p>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-border/50 via-border/20 to-transparent" />

        {/* Price + CTA */}
        <div className="flex items-end justify-between">
          <div>
            <span className="font-display text-[10px] tracking-[0.2em] text-muted-foreground/60">PRICE</span>
            <p className="font-display text-xl font-bold leading-none text-primary text-glow">
              Rp {formatPrice(product.price)}
            </p>
          </div>
          {!isSold && (
            <a
              href={getWhatsAppLink(product)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/10 px-3.5 py-2 font-display text-[11px] font-bold tracking-widest text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:box-glow-strong"
            >
              <MessageCircle size={13} />
              BUY
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
