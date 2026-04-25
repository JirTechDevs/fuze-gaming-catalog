"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, Pencil, Plus, Trash2, Upload, X } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/features/catalog/domain/product";
import { formatPrice } from "@/features/catalog/domain/product";
import Navbar from "@/features/storefront/components/navbar";

const emptyProduct: Omit<Product, "id"> = {
  code: "",
  image: "/placeholder.svg",
  rank: "",
  price: 0,
  skins: [],
  sisaVP: "-",
  agent: "",
  changeNick: "Ready",
  region: "IDN",
  premier: "",
  status: "available",
};

const primaryButtonClassName =
  "rounded-lg bg-primary py-2.5 font-display text-sm font-bold tracking-wider text-primary-foreground transition-all hover:box-glow-strong";
const iconButtonClassName =
  "rounded p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground";
const destructiveIconButtonClassName =
  "rounded p-1.5 text-muted-foreground transition-colors hover:bg-destructive/20 hover:text-destructive";
const fieldLabelClassName =
  "mb-1 block font-display text-xs tracking-wider text-muted-foreground";
const textFieldClassName =
  "w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary/50 focus:outline-none";
const imageFieldClassName =
  "flex-1 rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary/50 focus:outline-none";

interface AdminCatalogPageProps {
  initialProducts: Product[];
}

export default function AdminCatalogPage({
  initialProducts,
}: AdminCatalogPageProps) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editing, setEditing] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [skinInput, setSkinInput] = useState("");

  const openNew = () => {
    setEditing({ id: crypto.randomUUID(), ...emptyProduct });
    setIsNew(true);
    setSkinInput("");
  };

  const openEdit = (product: Product) => {
    setEditing({ ...product });
    setIsNew(false);
    setSkinInput(product.skins.join(", "));
  };

  const save = () => {
    if (!editing) {
      return;
    }

    const updated = {
      ...editing,
      skins: skinInput
        .split(",")
        .map((skin) => skin.trim())
        .filter(Boolean),
    };

    if (isNew) {
      setProducts([updated, ...products]);
    } else {
      setProducts(
        products.map((product) =>
          product.id === updated.id ? updated : product,
        ),
      );
    }

    setEditing(null);
  };

  const remove = (id: string) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const toggleStatus = (id: string) => {
    setProducts(
      products.map((product) =>
        product.id === id
          ? {
              ...product,
              status:
                product.status === "available" ? "sold" : "available",
            }
          : product,
      ),
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pb-12 pt-20 sm:pt-24">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="font-display text-2xl font-bold tracking-widest text-foreground">
            ADMIN <span className="text-primary">PANEL</span>
          </h1>
          <button
            onClick={openNew}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-display text-sm font-semibold tracking-wider text-primary-foreground transition-all hover:box-glow-strong sm:w-auto"
          >
            <Plus size={16} /> ADD
          </button>
        </div>

        <div className="grid gap-4 md:hidden">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.03 }}
              className="rounded-xl border border-border/50 bg-card p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg font-semibold tracking-wider text-primary">
                    {product.code}
                  </p>
                  <p className="mt-1 text-sm text-foreground">{product.rank}</p>
                </div>
                <span
                  className={`inline-block rounded-full px-2.5 py-1 font-display text-xs tracking-wider ${
                    product.status === "available"
                      ? "bg-primary/10 text-primary"
                      : "bg-destructive/10 text-destructive"
                  }`}
                >
                  {product.status.toUpperCase()}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between gap-3 rounded-lg border border-border/40 bg-secondary/30 px-3 py-2.5">
                <span className="font-display text-xs tracking-wider text-muted-foreground">
                  PRICE
                </span>
                <span className="font-display font-semibold text-primary">
                  Rp {formatPrice(product.price)}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  onClick={() => toggleStatus(product.id)}
                  className={`${iconButtonClassName} flex h-10 min-w-10 items-center justify-center rounded-lg border border-border/40 bg-secondary/40`}
                >
                  {product.status === "available" ? (
                    <EyeOff size={15} />
                  ) : (
                    <Eye size={15} />
                  )}
                </button>
                <button
                  onClick={() => openEdit(product)}
                  className={`${iconButtonClassName} flex h-10 min-w-10 items-center justify-center rounded-lg border border-border/40 bg-secondary/40`}
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => remove(product.id)}
                  className={`${destructiveIconButtonClassName} flex h-10 min-w-10 items-center justify-center rounded-lg border border-border/40 bg-secondary/40`}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="hidden overflow-x-auto rounded-lg border border-border/50 bg-card md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                {["Code", "Rank", "Price", "Status", "Actions"].map((heading) => (
                  <th
                    key={heading}
                    className="px-4 py-3 text-left font-display text-xs tracking-widest text-muted-foreground"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((product, index) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.03 }}
                  className="border-b border-border/30 transition-colors hover:bg-secondary/30"
                >
                  <td className="px-4 py-3 font-display font-semibold tracking-wider text-primary">
                    {product.code}
                  </td>
                  <td className="px-4 py-3 text-foreground">{product.rank}</td>
                  <td className="px-4 py-3 font-display font-semibold text-primary">
                    Rp {formatPrice(product.price)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 font-display text-xs tracking-wider ${
                        product.status === "available"
                          ? "bg-primary/10 text-primary"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {product.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleStatus(product.id)}
                        className={iconButtonClassName}
                      >
                        {product.status === "available" ? (
                          <EyeOff size={15} />
                        ) : (
                          <Eye size={15} />
                        )}
                      </button>
                      <button
                        onClick={() => openEdit(product)}
                        className={iconButtonClassName}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => remove(product.id)}
                        className={destructiveIconButtonClassName}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        <AnimatePresence>
          {editing && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditing(null)}
            >
              <motion.div
                className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-xl border border-border/50 bg-card p-4 sm:p-6"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  onClick={() => setEditing(null)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  <X size={18} />
                </button>
                <h3 className="mb-4 font-display text-lg font-bold tracking-wider text-foreground">
                  {isNew ? "ADD" : "EDIT"}{" "}
                  <span className="text-primary">ACCOUNT</span>
                </h3>

                <div className="grid gap-3 sm:grid-cols-2">
                  {(
                    [
                      ["code", "Code"],
                      ["rank", "Rank"],
                      ["price", "Price"],
                      ["sisaVP", "Sisa VP"],
                      ["agent", "Agent"],
                      ["changeNick", "Change Nick"],
                      ["region", "Region"],
                      ["premier", "Premier"],
                    ] as [keyof Product, string][]
                  ).map(([key, label]) => (
                    <div key={key}>
                      <label className={fieldLabelClassName}>
                        {label}
                      </label>
                      <input
                        value={String(editing[key])}
                        onChange={(event) =>
                          setEditing({
                            ...editing,
                            [key]:
                              key === "price"
                                ? Number(event.target.value) || 0
                                : event.target.value,
                          })
                        }
                        className={textFieldClassName}
                      />
                    </div>
                  ))}

                  <div className="sm:col-span-2">
                    <label className={fieldLabelClassName}>
                      Skins (comma separated)
                    </label>
                    <textarea
                      value={skinInput}
                      onChange={(event) => setSkinInput(event.target.value)}
                      rows={4}
                      className={textFieldClassName}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className={fieldLabelClassName}>
                      Image URL
                    </label>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <input
                        value={editing.image}
                        onChange={(event) =>
                          setEditing({ ...editing, image: event.target.value })
                        }
                        className={imageFieldClassName}
                      />
                      <button className="flex items-center justify-center gap-1 rounded-md bg-secondary px-3 py-2 text-xs text-muted-foreground hover:text-foreground">
                        <Upload size={14} />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={save}
                    className={`mt-2 w-full sm:col-span-2 ${primaryButtonClassName}`}
                  >
                    {isNew ? "CREATE ACCOUNT" : "SAVE CHANGES"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
