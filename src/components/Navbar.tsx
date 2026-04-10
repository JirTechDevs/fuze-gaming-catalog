import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/20 bg-background/60 backdrop-blur-2xl">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/images/logo.png" alt="Fuzevalo" className="h-8 w-8 object-contain" />
          <span className="font-display text-base font-bold tracking-[0.2em] text-foreground">
            FUZE<span className="text-primary">VALO</span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-1 md:flex">
          <Link to="/" className={`rounded-lg px-3.5 py-1.5 font-display text-[11px] tracking-[0.15em] transition-all ${!isAdmin ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
            CATALOG
          </Link>
          <Link to="/admin" className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 font-display text-[11px] tracking-[0.15em] transition-all ${isAdmin ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
            <Shield size={11} />
            ADMIN
          </Link>
        </div>

        <button onClick={() => setOpen(!open)} className="text-foreground md:hidden">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-border/20 bg-background/95 backdrop-blur-2xl md:hidden"
          >
            <div className="flex flex-col gap-1 p-3">
              <Link to="/" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 font-display text-[11px] tracking-[0.15em] text-foreground hover:bg-primary/10 hover:text-primary">CATALOG</Link>
              <Link to="/admin" onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 font-display text-[11px] tracking-[0.15em] text-foreground hover:bg-primary/10 hover:text-primary">ADMIN</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
