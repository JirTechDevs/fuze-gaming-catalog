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
    <section className="flex h-full flex-col rounded-[1.6rem] border border-border/35 bg-card/70 p-3 shadow-[0_0_40px_hsl(var(--primary)_/_0.08)] backdrop-blur-md sm:rounded-[2rem] sm:p-4">
      <div className="relative flex h-full flex-col overflow-hidden rounded-[1.4rem] border border-white/10 bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.22),_transparent_54%),linear-gradient(180deg,_hsl(var(--secondary)/0.9),_hsl(var(--card)))] p-3 sm:rounded-[1.7rem] sm:p-5">
        <div className="absolute left-3 right-3 top-3 z-10 flex flex-wrap items-start justify-between gap-2 sm:left-5 sm:right-5 sm:top-5">
          <div className="flex min-w-0 items-center gap-2 rounded-[1rem] border border-primary/40 bg-background/88 px-3 py-2 shadow-[0_0_18px_hsl(var(--primary)_/_0.16)] backdrop-blur-md sm:rounded-[1.2rem] sm:px-4 sm:py-2.5">
            <Shield size={14} className="shrink-0 text-primary" />
            <span className="truncate font-display text-sm font-bold tracking-[0.14em] text-primary sm:text-lg sm:tracking-[0.16em]">
              {product.code}
            </span>
          </div>

          <div className="rounded-[1rem] border border-primary/40 bg-background/88 px-3 py-2 text-right shadow-[0_0_18px_hsl(var(--primary)_/_0.16)] backdrop-blur-md sm:rounded-[1.2rem] sm:px-4 sm:py-2.5">
            <p className="font-display text-base font-bold leading-none text-primary sm:text-xl">
              Rp {formatPrice(product.price)}
            </p>
          </div>
        </div>

        <div className="relative flex-1 overflow-hidden rounded-[1.2rem] border border-white/10 bg-background/25 sm:rounded-[1.5rem]">
          <img
            src={activeImage}
            alt={`${product.code} preview`}
            className="h-full min-h-[24rem] w-full object-contain object-top sm:min-h-[32rem] lg:min-h-[40rem] xl:min-h-[46rem]"
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
                    className="h-20 w-24 object-cover sm:h-24 sm:w-28"
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
