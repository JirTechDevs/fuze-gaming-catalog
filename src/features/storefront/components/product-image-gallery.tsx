"use client";

import { useState } from "react";
import { Shield } from "lucide-react";
import { formatPrice, type Product } from "@/features/catalog/domain/product";

interface ProductImageGalleryProps {
  product: Product;
}

export default function ProductImageGallery({
  product,
}: ProductImageGalleryProps) {
  const images = product.images?.length ? product.images : [product.image];
  const [activeImage, setActiveImage] = useState(images[0]);

  return (
    <section className="rounded-[2rem] border border-border/35 bg-card/70 p-4 shadow-[0_0_40px_hsl(var(--primary)_/_0.08)] backdrop-blur-md">
      <div className="relative overflow-hidden rounded-[1.7rem] border border-white/10 bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.22),_transparent_54%),linear-gradient(180deg,_hsl(var(--secondary)/0.9),_hsl(var(--card)))] p-5">
        <div className="absolute left-5 top-5 z-10 flex items-center gap-2 rounded-[1.2rem] border border-primary/40 bg-background/88 px-4 py-2.5 shadow-[0_0_18px_hsl(var(--primary)_/_0.16)] backdrop-blur-md">
          <Shield size={14} className="text-primary" />
          <span className="font-display text-lg font-bold tracking-[0.16em] text-primary">
            {product.code}
          </span>
        </div>

        <div className="absolute right-5 top-5 z-10 rounded-[1.2rem] border border-primary/40 bg-background/88 px-4 py-2.5 text-right shadow-[0_0_18px_hsl(var(--primary)_/_0.16)] backdrop-blur-md">
          <p className="font-display text-xl font-bold leading-none text-primary text-glow">
            Rp {formatPrice(product.price)}
          </p>
        </div>

        <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-background/25">
          <img
            src={activeImage}
            alt={`${product.code} preview`}
            className="aspect-[16/10] w-full object-contain object-top sm:aspect-[14/9] xl:aspect-[16/8]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/10 to-transparent" />
        </div>

        {images.length > 1 && (
          <div className="horizontal-scrollbar mt-4 flex gap-3 overflow-x-auto pb-1">
            {images.map((image, index) => {
              const isActive = image === activeImage;

              return (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setActiveImage(image)}
                  className={`relative shrink-0 overflow-hidden rounded-[1rem] border transition ${
                    isActive
                      ? "border-primary/60 ring-1 ring-primary/40"
                      : "border-border/35"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.code} thumbnail ${index + 1}`}
                    className="h-24 w-28 object-cover"
                  />
                  <div
                    className={`absolute inset-0 transition ${
                      isActive ? "bg-primary/8" : "bg-background/18"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
