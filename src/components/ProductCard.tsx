import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { Product, formatPrice, getWhatsAppLink } from "@/lib/data";

interface Props {
  product: Product;
  onSelect: (product: Product) => void;
  index: number;
}

const ProductCard = ({ product, onSelect, index }: Props) => {
  const isSold = product.status === "sold";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ y: -4 }}
      className={`group relative cursor-pointer overflow-hidden rounded-lg border border-border/50 bg-card transition-all duration-300 hover:border-primary/30 hover:box-glow ${isSold ? "opacity-60" : ""}`}
      onClick={() => onSelect(product)}
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden bg-secondary">
        <img src={product.image} alt={product.code} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        {isSold && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70">
            <span className="font-display text-lg font-bold tracking-widest text-destructive">SOLD</span>
          </div>
        )}
        <div className="absolute left-2 top-2 rounded bg-background/80 px-2 py-0.5 font-display text-xs font-semibold tracking-wider text-primary backdrop-blur">
          {product.code}
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between">
          <span className="font-display text-sm font-medium tracking-wide text-muted-foreground">{product.rank}</span>
          <span className="font-display text-sm text-muted-foreground">{product.region}</span>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs text-muted-foreground">Price</span>
            <p className="font-display text-lg font-bold text-primary text-glow">
              Rp {formatPrice(product.price)}
            </p>
          </div>
          {!isSold && (
            <a
              href={getWhatsAppLink(product)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 font-display text-xs font-semibold tracking-wider text-primary-foreground transition-all hover:box-glow-strong"
            >
              <MessageCircle size={14} />
              BUY
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
