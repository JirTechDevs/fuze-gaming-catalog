"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ChevronRight, ShoppingCart, Wallet, X } from "lucide-react";
import { buildWhatsAppUrl } from "@/features/catalog/domain/product";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
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
      <DialogPortal>
        <DialogOverlay className="bg-[#00030f]/85 backdrop-blur-sm" />
        <DialogPrimitive.Content
          onOpenAutoFocus={(e) => e.preventDefault()}
          className="fixed left-[50%] top-[50%] z-50 w-[calc(100%-2rem)] max-w-md translate-x-[-50%] translate-y-[-50%] overflow-hidden rounded-[1.75rem] border border-[#00b7ff]/40 bg-[linear-gradient(180deg,rgba(7,26,51,0.72),rgba(4,14,31,0.68))] p-6 shadow-[0_0_0_1px_rgba(0,183,255,0.1),0_0_40px_rgba(0,183,255,0.24),0_24px_60px_rgba(0,0,0,0.55)] backdrop-blur-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:p-7"
        >
          {/* grabber handle */}
          <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-[linear-gradient(90deg,#00b7ff,#00d1ff)] shadow-[0_0_12px_rgba(0,209,255,0.6)]" />

          <DialogClose className="absolute right-5 top-5 rounded-full p-1 text-white/70 transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00b7ff] focus-visible:ring-offset-2 focus-visible:ring-offset-background">
            <X className="h-6 w-6" />
            <span className="sr-only">Tutup</span>
          </DialogClose>

          <div className="text-center">
            <DialogTitle className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              <span className="text-white">Pilih </span>
              <span className="text-[#00b7ff] [text-shadow:0_0_18px_rgba(0,183,255,0.45)]">
                kebutuhanmu
              </span>
            </DialogTitle>
            <DialogDescription className="mt-1.5 text-base text-[#c7d2e5]">
              Mau cari akun ready atau jual akunmu?
            </DialogDescription>
          </div>

          <div className="mt-6 flex flex-col gap-4">
            {/* BELI AKUN — highlighted light card */}
            <button
              type="button"
              onClick={handleBeli}
              className="group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl bg-[linear-gradient(115deg,#d6f3ff,#a4e2ff_45%,#6fcdf3)] px-5 py-4 text-left shadow-[0_10px_28px_rgba(0,183,255,0.28)] transition hover:brightness-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00d1ff] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {/* diagonal shine */}
              <span className="pointer-events-none absolute -right-6 top-0 h-full w-24 skew-x-[-18deg] bg-white/25" />
              <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#0a2540] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
                <ShoppingCart className="h-6 w-6 text-white" />
              </span>
              <span className="relative flex-1">
                <span className="block font-display text-lg font-extrabold uppercase tracking-wide text-[#06203a]">
                  Beli Akun
                </span>
                <span className="block text-sm font-medium text-[#0a3a5c]/80">
                  Lihat katalog akun ready
                </span>
              </span>
              <ChevronRight className="relative h-6 w-6 shrink-0 text-[#06203a]" />
            </button>

            {/* JUAL AKUN — dark glassy card */}
            <a
              href={buildWhatsAppUrl("Haii min fuze! aku mau jual akun valo")}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => onOpenChange(false)}
              className="group relative flex w-full items-center gap-4 overflow-hidden rounded-2xl border border-[#00b7ff]/40 bg-[linear-gradient(115deg,rgba(10,28,55,0.55),rgba(8,21,43,0.5))] px-5 py-4 text-left shadow-[inset_0_0_20px_rgba(0,183,255,0.08)] backdrop-blur-md transition hover:border-[#00b7ff]/70 hover:bg-[linear-gradient(115deg,rgba(12,34,66,0.62),rgba(10,26,52,0.55))] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00d1ff] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <span className="pointer-events-none absolute -right-6 top-0 h-full w-24 skew-x-[-18deg] bg-white/[0.04]" />
              <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#0a2540] shadow-[inset_0_0_0_1px_rgba(0,183,255,0.25),0_0_16px_rgba(0,183,255,0.2)]">
                <Wallet className="h-6 w-6 text-[#8cdfff]" />
              </span>
              <span className="relative flex-1">
                <span className="block font-display text-lg font-extrabold uppercase tracking-wide text-white">
                  Jual Akun
                </span>
                <span className="block text-sm font-medium text-[#c7d2e5]/80">
                  10 menit langsung cair
                </span>
              </span>
              <ChevronRight className="relative h-6 w-6 shrink-0 text-[#00b7ff]" />
            </a>
          </div>

          {/* skip */}
          <div className="mt-5 flex items-center gap-3">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[#00b7ff]/25" />
            <DialogClose className="shrink-0 text-sm font-medium text-[#7f8ea8] transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#00b7ff] focus-visible:ring-offset-2 focus-visible:ring-offset-background">
              Lewati untuk sekarang
            </DialogClose>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[#00b7ff]/25" />
          </div>
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
