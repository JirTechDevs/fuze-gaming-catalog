import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle } from "lucide-react";
import { Product, formatPrice, getWhatsAppLink } from "@/lib/data";

interface Props {
  product: Product | null;
  onClose: () => void;
}

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between border-b border-border/30 py-2">
    <span className="font-display text-xs tracking-wider text-muted-foreground">{label}</span>
    <span className="text-sm font-medium text-foreground">{value}</span>
  </div>
);

const ProductModal = ({ product, onClose }: Props) => {
  if (!product) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="relative w-full max-w-lg overflow-hidden rounded-xl border border-border/50 bg-card box-glow"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={onClose} className="absolute right-3 top-3 z-10 rounded-full bg-background/60 p-1.5 text-muted-foreground transition-colors hover:text-foreground">
            <X size={18} />
          </button>

          {/* Image */}
          <div className="relative aspect-video bg-secondary">
            <img src={product.image} alt={product.code} className="h-full w-full object-cover" />
            <div className="absolute bottom-3 left-3 rounded bg-background/80 px-3 py-1 font-display text-sm font-bold tracking-widest text-primary backdrop-blur">
              {product.code}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col gap-1 p-5">
            <h2 className="font-display text-xl font-bold tracking-wider text-foreground">
              Account <span className="text-primary text-glow">{product.code}</span>
            </h2>

            {/* Skins */}
            <div className="mt-2 mb-1">
              <span className="font-display text-xs tracking-wider text-muted-foreground">SKINS</span>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {product.skins.map((skin) => (
                  <span key={skin} className="rounded bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">{skin}</span>
                ))}
              </div>
            </div>

            <div className="mt-2">
              <DetailRow label="RANK" value={product.rank} />
              <DetailRow label="SISA VP" value={product.sisaVP} />
              <DetailRow label="AGENT" value={product.agent} />
              <DetailRow label="CHANGE NICK" value={product.changeNick} />
              <DetailRow label="REGION" value={product.region} />
              <DetailRow label="PREMIER" value={product.premier} />
            </div>

            {/* Price + CTA */}
            <div className="mt-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-muted-foreground">PRICE</span>
                <p className="font-display text-2xl font-bold text-primary text-glow">
                  Rp {formatPrice(product.price)}
                </p>
              </div>
              {product.status === "available" && (
                <a
                  href={getWhatsAppLink(product)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-display text-sm font-bold tracking-wider text-primary-foreground transition-all hover:box-glow-strong"
                >
                  <MessageCircle size={18} />
                  BUY VIA WHATSAPP
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ProductModal;
