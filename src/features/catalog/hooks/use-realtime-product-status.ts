"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/features/catalog/domain/product";

/**
 * Watches a single catalog row's status via Supabase Realtime. Used on
 * the product detail page so the "Beli Sekarang" button flips to
 * "Akun Sudah Sold" the instant status changes in the sheet, without
 * requiring the user to refresh.
 */
export function useRealtimeProductStatus(
  productId: string,
  initialStatus: Product["status"],
) {
  const [status, setStatus] = useState<Product["status"]>(initialStatus);

  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus, productId]);

  useEffect(() => {
    if (!productId) return;

    const supabase = createClient();

    const channel = supabase
      .channel(`catalog-item-${productId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "catalog_items",
          filter: `id=eq.${productId}`,
        },
        (payload) => {
          const nextStatus = (payload.new as { status?: Product["status"] })
            ?.status;
          if (nextStatus === "available" || nextStatus === "sold") {
            setStatus(nextStatus);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [productId]);

  return status;
}
