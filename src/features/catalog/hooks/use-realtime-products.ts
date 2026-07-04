"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/features/catalog/domain/product";

type CatalogRow = {
  id: string;
  status: "available" | "sold";
};

/**
 * Keeps a client-side list of products in sync with Supabase Realtime.
 *
 * Only reacts to status changes on existing rows — new inserts still
 * require a page refresh (they need image/skin/rank data that we don't
 * pipe through the realtime payload). Hard deletes are handled by
 * dropping the row from state.
 *
 * The hook seeds itself from `initialProducts` on mount and resets the
 * seed whenever the parent passes a new server-rendered list.
 */
export function useRealtimeProducts(initialProducts: Product[]) {
  const [products, setProducts] = useState(initialProducts);

  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("catalog-items-changes")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "catalog_items" },
        (payload) => {
          const row = payload.new as CatalogRow;
          if (!row?.id) return;

          setProducts((current) =>
            current.map((product) =>
              product.id === row.id ? { ...product, status: row.status } : product,
            ),
          );
        },
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "catalog_items" },
        (payload) => {
          const row = payload.old as CatalogRow;
          if (!row?.id) return;

          setProducts((current) => current.filter((product) => product.id !== row.id));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return products;
}
