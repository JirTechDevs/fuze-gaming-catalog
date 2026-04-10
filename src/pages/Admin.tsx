import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, Eye, EyeOff, X, Upload } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Product, sampleProducts, formatPrice } from "@/lib/data";

const emptyProduct: Omit<Product, "id"> = {
  code: "", image: "/placeholder.svg", rank: "", price: 0, skins: [],
  sisaVP: "-", agent: "", changeNick: "Ready", region: "IDN", premier: "", status: "available",
};

const Admin = () => {
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [editing, setEditing] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [skinInput, setSkinInput] = useState("");

  const openNew = () => {
    setEditing({ id: crypto.randomUUID(), ...emptyProduct });
    setIsNew(true);
    setSkinInput("");
  };

  const openEdit = (p: Product) => {
    setEditing({ ...p });
    setIsNew(false);
    setSkinInput(p.skins.join(", "));
  };

  const save = () => {
    if (!editing) return;
    const updated = { ...editing, skins: skinInput.split(",").map((s) => s.trim()).filter(Boolean) };
    if (isNew) {
      setProducts([updated, ...products]);
    } else {
      setProducts(products.map((p) => (p.id === updated.id ? updated : p)));
    }
    setEditing(null);
  };

  const remove = (id: string) => setProducts(products.filter((p) => p.id !== id));

  const toggleStatus = (id: string) =>
    setProducts(products.map((p) => (p.id === id ? { ...p, status: p.status === "available" ? "sold" : "available" } : p)));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold tracking-widest text-foreground">
            ADMIN <span className="text-primary text-glow">PANEL</span>
          </h1>
          <button onClick={openNew} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-display text-sm font-semibold tracking-wider text-primary-foreground transition-all hover:box-glow-strong">
            <Plus size={16} /> ADD
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-lg border border-border/50 bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                {["Code", "Rank", "Price", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left font-display text-xs tracking-widest text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <motion.tr
                  key={p.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-border/30 transition-colors hover:bg-secondary/30"
                >
                  <td className="px-4 py-3 font-display font-semibold tracking-wider text-primary">{p.code}</td>
                  <td className="px-4 py-3 text-foreground">{p.rank}</td>
                  <td className="px-4 py-3 font-display font-semibold text-primary">Rp {formatPrice(p.price)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 font-display text-xs tracking-wider ${p.status === "available" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"}`}>
                      {p.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => toggleStatus(p.id)} className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                        {p.status === "available" ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                      <button onClick={() => openEdit(p)} className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => remove(p.id)} className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-destructive/20 hover:text-destructive">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit Modal */}
        <AnimatePresence>
          {editing && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md p-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setEditing(null)}
            >
              <motion.div
                className="relative w-full max-w-md overflow-y-auto rounded-xl border border-border/50 bg-card p-6 max-h-[90vh]"
                initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button onClick={() => setEditing(null)} className="absolute right-3 top-3 text-muted-foreground hover:text-foreground">
                  <X size={18} />
                </button>
                <h3 className="mb-4 font-display text-lg font-bold tracking-wider text-foreground">
                  {isNew ? "ADD" : "EDIT"} <span className="text-primary">ACCOUNT</span>
                </h3>

                <div className="flex flex-col gap-3">
                  {([
                    ["code", "Code"],
                    ["rank", "Rank"],
                    ["price", "Price"],
                    ["sisaVP", "Sisa VP"],
                    ["agent", "Agent"],
                    ["changeNick", "Change Nick"],
                    ["region", "Region"],
                    ["premier", "Premier"],
                  ] as [keyof Product, string][]).map(([key, label]) => (
                    <div key={key}>
                      <label className="mb-1 block font-display text-xs tracking-wider text-muted-foreground">{label}</label>
                      <input
                        value={String(editing[key])}
                        onChange={(e) => setEditing({ ...editing, [key]: key === "price" ? Number(e.target.value) || 0 : e.target.value })}
                        className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary/50 focus:outline-none"
                      />
                    </div>
                  ))}

                  <div>
                    <label className="mb-1 block font-display text-xs tracking-wider text-muted-foreground">Skins (comma separated)</label>
                    <textarea
                      value={skinInput}
                      onChange={(e) => setSkinInput(e.target.value)}
                      rows={2}
                      className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary/50 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block font-display text-xs tracking-wider text-muted-foreground">Image URL</label>
                    <div className="flex gap-2">
                      <input
                        value={editing.image}
                        onChange={(e) => setEditing({ ...editing, image: e.target.value })}
                        className="flex-1 rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground focus:border-primary/50 focus:outline-none"
                      />
                      <button className="flex items-center gap-1 rounded-md bg-secondary px-3 py-2 text-xs text-muted-foreground hover:text-foreground">
                        <Upload size={14} />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={save}
                    className="mt-2 w-full rounded-lg bg-primary py-2.5 font-display text-sm font-bold tracking-wider text-primary-foreground transition-all hover:box-glow-strong"
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
};

export default Admin;
