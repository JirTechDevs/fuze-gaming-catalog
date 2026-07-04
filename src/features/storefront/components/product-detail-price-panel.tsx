"use client";

import { buildWhatsAppLink, formatPrice, type Product } from "@/features/catalog/domain/product";
import { useRealtimeProductStatus } from "@/features/catalog/hooks/use-realtime-product-status";
import styles from "./product-detail-page.module.css";

interface ProductDetailPricePanelProps {
  product: Product;
}

function WhatsAppGlyph() {
  return (
    <svg viewBox="0 0 32 32" className="h-5 w-5" aria-hidden="true">
      <path
        fill="currentColor"
        d="M27.2 15.4c0 6.2-5 11.3-11.3 11.3-2 0-4-.5-5.7-1.5l-6.1 1.9 2-5.9a11.2 11.2 0 0 1-1.8-5.9C4.3 9.1 9.4 4 15.7 4S27.2 9.1 27.2 15.4Zm-11.5-9.5c-5.2 0-9.4 4.2-9.4 9.4 0 1.9.6 3.7 1.6 5.2l.2.2-1.2 3.7 3.8-1.2.2.1c1.5.9 3.2 1.4 4.9 1.4 5.2 0 9.4-4.2 9.4-9.4 0-5.2-4.2-9.4-9.5-9.4Zm5.4 12c-.3-.2-1.8-.9-2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.7-1.7-2-.2-.3 0-.4.1-.6l.5-.6c.2-.2.2-.4.3-.6.1-.2 0-.4 0-.6 0-.2-.7-1.7-.9-2.3-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.1 1.1-1.1 2.6s1.1 3 1.3 3.2c.2.2 2.2 3.5 5.4 4.8 3.2 1.2 3.2.8 3.8.7.6-.1 1.8-.8 2.1-1.5.3-.7.3-1.4.2-1.5-.1-.1-.3-.2-.6-.4Z"
      />
    </svg>
  );
}

export default function ProductDetailPricePanel({
  product,
}: ProductDetailPricePanelProps) {
  const status = useRealtimeProductStatus(product.id, product.status);
  const isAvailable = status === "available";

  return (
    <div
      className={`mt-auto rounded-[1.6rem] px-4 py-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)] sm:px-5 ${styles.pricePanel}`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-3xl font-bold leading-none text-white sm:text-4xl xl:text-5xl">
            Rp {formatPrice(product.price)}
          </p>
        </div>
        <div className="inline-flex items-center gap-3 self-start sm:self-auto">
          <span className="text-base font-semibold text-white/82">Status:</span>
          <span
            className={`rounded-full px-4 py-2 text-sm font-bold lowercase shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] transition-colors ${
              isAvailable
                ? "bg-primary/18 text-primary"
                : "bg-zinc-700 text-white"
            }`}
          >
            {isAvailable ? "available" : "sold"}
          </span>
        </div>
      </div>

      {isAvailable ? (
        <a
          href={buildWhatsAppLink(product)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[linear-gradient(180deg,#16C784,#12A76F)] px-5 py-4 text-center font-display text-sm font-semibold text-white shadow-[0_10px_24px_rgba(22,199,132,0.32),inset_0_1px_0_rgba(255,255,255,0.16)] transition hover:brightness-105 sm:text-base"
        >
          <WhatsAppGlyph />
          Beli Sekarang
        </a>
      ) : (
        <span className="mt-5 flex items-center justify-center rounded-[1.2rem] bg-background/28 px-5 py-4 text-center font-display text-sm font-bold text-muted-foreground sm:text-base">
          Akun Sudah Sold
        </span>
      )}
    </div>
  );
}
