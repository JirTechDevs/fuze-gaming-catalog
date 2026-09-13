"use client";

import { buildWhatsAppUrl } from "@/features/catalog/domain/product";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EntryPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EntryPopup({ open, onOpenChange }: EntryPopupProps) {
  const handleBeli = () => {
    onOpenChange(false);
    // ponytail: reuse the same catalog-scroll mechanism the page already uses on #catalog
    document
      .getElementById("catalog")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            Mau ngapain hari ini?
          </DialogTitle>
          <DialogDescription>
            Pilih beli akun valorant atau jual akun kamu ke kami.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleBeli}
            className="flex flex-1 items-center justify-center rounded-full bg-primary px-4 py-3 font-display text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:text-base"
          >
            Beli
          </button>
          <a
            href={buildWhatsAppUrl("haii min, aku mau jual akun valo")}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onOpenChange(false)}
            className="flex flex-1 items-center justify-center rounded-full bg-[linear-gradient(180deg,#16C784,#12A76F)] px-4 py-3 font-display text-sm font-semibold text-white shadow-[0_10px_24px_rgba(22,199,132,0.32),inset_0_1px_0_rgba(255,255,255,0.16)] transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:text-base"
          >
            Jual
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
