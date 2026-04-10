import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-3">
          <img src="/images/logo.png" alt="Fuzevalo" className="h-10 w-10 object-contain" />
          <span className="font-display text-xl font-bold tracking-wider text-foreground">
            FUZE<span className="text-primary text-glow">VALO</span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-6 md:flex">
          <Link to="/" className={`font-display text-sm tracking-wider transition-colors hover:text-primary ${!isAdmin ? "text-primary" : "text-muted-foreground"}`}>
            CATALOG
          </Link>
          <Link to="/admin" className={`font-display text-sm tracking-wider transition-colors hover:text-primary ${isAdmin ? "text-primary" : "text-muted-foreground"}`}>
            ADMIN
          </Link>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="text-foreground md:hidden">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-border/50 bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-4 p-4">
              <Link to="/" onClick={() => setOpen(false)} className="font-display text-sm tracking-wider text-foreground hover:text-primary">CATALOG</Link>
              <Link to="/admin" onClick={() => setOpen(false)} className="font-display text-sm tracking-wider text-foreground hover:text-primary">ADMIN</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
