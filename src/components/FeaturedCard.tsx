import { motion } from "framer-motion";
import { MessageCircle, Shield, Flame, Tag, Sparkles } from "lucide-react";
import { Product, formatPrice, getWhatsAppLink } from "@/lib/data";

interface Props {
  product: Product;
  onSelect: (product: Product) => void;
  index: number;
}

const rankColors: Record<string, string> = {
  Iron: "text-[hsl(20,15%,50%)]",
  Bronze: "text-[hsl(30,50%,45%)]",
  Silver: "text-[hsl(220,10%,65%)]",
  Gold: "text-[hsl(45,80%,55%)]",
  Platinum: "text-[hsl(187,60%,55%)]",
  Diamond: "text-[hsl(280,60%,65%)]",
  Ascendant: "text-[hsl(150,60%,50%)]",
  Immortal: "text-[hsl(0,70%,60%)]",
  Radiant: "text-[hsl(45,100%,65%)]",
};

const getRankColor = (rank: string) => {
  const base = rank.split(" ")[0];
  return rankColors[base] || "text-foreground";
};

const badgeConfig: Record<string, { label: string; icon: typeof Flame; bg: string; text: string; border: string }> = {
  hot: { label: "HOT", icon: Flame, bg: "bg-[hsl(0,80%,50%)]/15", text: "text-[hsl(0,80%,60%)]", border: "border-[hsl(0,80%,50%)]/30" },
  "best-deal": { label: "BEST DEAL", icon: Tag, bg: "bg-[hsl(140,60%,45%)]/15", text: "text-[hsl(140,60%,55%)]", border: "border-[hsl(140,60%,45%)]/30" },
  rare: { label: "RARE", icon: Sparkles, bg: "bg-[hsl(280,70%,60%)]/15", text: "text-[hsl(280,70%,65%)]", border: "border-[hsl(280,70%,60%)]/30" },
};

const FeaturedCard = ({ product, onSelect, index }: Props) => {
  const badge = product.featured ? badgeConfig[product.featured] : null;
  const BadgeIcon = badge?.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group relative flex w-[320px] shrink-0 cursor-pointer flex-col overflow-hidden rounded-2xl border border-primary/20 bg-card/90 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:box-glow md:w-[360px]"
      onClick={() => onSelect(product)}
    >
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

      <div className="flex h-full flex-col">
        <div className="relative aspect-[16/10] overflow-hidden bg-secondary/50">
          <img
            src={product.image}
            alt={product.code}
            className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-lg border border-primary/20 bg-background/90 px-3 py-1.5 backdrop-blur-sm">
            <Shield size={11} className="text-primary" />
            <span className="font-display text-xs font-bold tracking-[0.15em] text-primary">{product.code}</span>
          </div>

          {badge && BadgeIcon && (
            <div className={`absolute right-3 top-3 flex items-center gap-1.5 rounded-lg border ${badge.border} ${badge.bg} px-3 py-1.5 backdrop-blur-sm`}>
              <BadgeIcon size={11} className={badge.text} />
              <span className={`font-display text-[10px] font-bold tracking-[0.2em] ${badge.text}`}>{badge.label}</span>
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col justify-between gap-4 p-5">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className={`font-display text-base font-bold tracking-wide ${getRankColor(product.rank)}`}>
                {product.rank}
              </span>
              <span className="rounded border border-border/50 bg-secondary/50 px-2.5 py-0.5 font-display text-[10px] tracking-widest text-muted-foreground">
                {product.region}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {product.skins.slice(0, 3).map((skin) => (
                <span
                  key={skin}
                  className="rounded-md border border-border/30 bg-secondary/40 px-2 py-0.5 text-[11px] text-muted-foreground/80"
                >
                  {skin}
                </span>
              ))}
              {product.skins.length > 3 && (
                <span className="rounded-md border border-border/30 bg-secondary/40 px-2 py-0.5 text-[11px] text-muted-foreground/80">
                  +{product.skins.length - 3} more
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground/60">
              <span>Agent: <span className="text-foreground/80">{product.agent}</span></span>
              <span>Nick: <span className="text-foreground/80">{product.changeNick}</span></span>
            </div>
          </div>

          <div className="flex items-end justify-between border-t border-border/30 pt-4">
            <div>
              <span className="font-display text-[10px] tracking-[0.2em] text-muted-foreground/50">PRICE</span>
              <p className="font-display text-xl font-bold leading-none text-primary text-glow">
                Rp {formatPrice(product.price)}
              </p>
            </div>
            <a
              href={getWhatsAppLink(product)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/10 px-4 py-2.5 font-display text-[11px] font-bold tracking-widest text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:box-glow-strong"
            >
              <MessageCircle size={14} />
              BUY NOW
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FeaturedCard;
