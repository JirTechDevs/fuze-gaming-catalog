"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import {
  buildWhatsAppLink,
  formatPrice,
  type Product,
} from "@/features/catalog/domain/product";
import Footer from "@/features/storefront/components/footer";
import ProductImageGallery from "@/features/storefront/components/product-image-gallery";
import Navbar from "@/features/storefront/components/navbar";
import styles from "./product-detail-page.module.css";

interface ProductDetailPageProps {
  product: Product;
}

type DetailPanelMode = "overview" | "heroes" | "skins";
const detailPanelOrder: DetailPanelMode[] = ["overview", "skins", "heroes"];

function getHeroCount(product: Product) {
  if (product.agent.toLowerCase() === "full unlock") {
    return "23/23";
  }

  return product.agent || "-";
}

function getAgentRankNote(product: Product) {
  const notes = [];

  if (product.changeNick) {
    notes.push(`Nick ${product.changeNick}`);
  }

  if (product.sisaVP && product.sisaVP !== "-") {
    notes.push(`${product.sisaVP} VP`);
  }

  if (product.premier && product.premier !== "Unranked") {
    notes.push(`Premier ${product.premier}`);
  }

  return notes.join(" • ") || "No special note";
}

function getMinusNotes(product: Product) {
  const minusNotes = [];

  if (product.changeNick.toLowerCase() !== "ready") {
    minusNotes.push("Change nick belum ready.");
  }

  if (product.agent.toLowerCase() !== "full unlock") {
    minusNotes.push(`Hero belum full unlock (${product.agent}).`);
  }

  if (product.premier.toLowerCase() === "can't be changed") {
    minusNotes.push("Premier/emblem tidak bisa diganti.");
  }

  if (product.status !== "available") {
    minusNotes.push("Akun sudah sold.");
  }

  return minusNotes;
}

function buildHeroItems(product: Product) {
  const heroCount = getHeroCount(product);
  const items = [
    `Status unlock agent: ${heroCount}`,
    `Change nick: ${product.changeNick}`,
    `Region account: ${product.region}`,
  ];

  if (product.premier) {
    items.push(`Emblem / Premier: ${product.premier}`);
  }

  if (product.sisaVP && product.sisaVP !== "-") {
    items.push(`Sisa VP: ${product.sisaVP}`);
  }

  return items;
}

function getDetailPanelLabel(mode: DetailPanelMode) {
  if (mode === "overview") {
    return "Description";
  }

  if (mode === "skins") {
    return "Skins";
  }

  return "Heroes";
}

function GamepadDoodle() {
  return (
    <svg viewBox="0 0 180 120" className="h-full w-full" aria-hidden="true">
      <path
        d="M44 42 C36 40 28 44 24 52 L16 74 C12 84 18 96 30 96 C37 96 43 92 47 86 L56 72 H124 L133 86 C137 92 143 96 150 96 C162 96 168 84 164 74 L156 52 C152 44 144 40 136 42 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M56 56 H76 M66 46 V66" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <circle cx="122" cy="54" r="6" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="138" cy="68" r="6" fill="none" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}

function CrosshairDoodle() {
  return (
    <svg viewBox="0 0 160 160" className="h-full w-full" aria-hidden="true">
      <circle cx="80" cy="80" r="28" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle
        cx="80"
        cy="80"
        r="50"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.32"
        strokeWidth="2"
        strokeDasharray="6 10"
      />
      <path d="M80 12 V40 M80 120 V148 M12 80 H40 M120 80 H148" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function TacticalMarkDoodle() {
  return (
    <svg viewBox="0 0 150 120" className="h-full w-full" aria-hidden="true">
      <path
        d="M18 20 L62 96 H84 L62 56 H88 L132 20 H102 L74 46 L48 20 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinejoin="round"
      />
      <path
        d="M36 20 L74 86 L114 20"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.34"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WhatsAppGlyph() {
  return (
    <svg viewBox="0 0 32 32" className="h-5 w-5" aria-hidden="true">
      <path
        fill="currentColor"
        d="M27.2 15.4c0 6.2-5 11.3-11.3 11.3-2 0-4-.5-5.7-1.5l-6.1 1.9 2-5.9a11.2 11.2 0 0 1-1.8-5.9C4.3 9.1 9.4 4 15.7 4S27.2 9.1 27.2 15.4Zm-11.5-9.5c-5.2 0-9.4 4.2-9.4 9.4 0 1.9.6 3.7 1.6 5.2l.2.2-1.2 3.7 3.8-1.2.2.1c1.5.9 3.2 1.4 4.9 1.4 5.2 0 9.4-4.2 9.4-9.4 0-5.2-4.2-9.4-9.5-9.4Zm5.4 12c-.3-.2-1.8-.9-2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.7-1.7-2-.2-.3 0-.4.1-.6l.5-.6c.2-.2.2-.4.3-.6.1-.2 0-.4 0-.6 0-.2-.7-1.7-.9-2.3-.2-.5-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.1 1.1-1.1 2.6s1.1 3 1.3 3.2c.2.2 2.2 3.5 5.4 4.8 3.2 1.2 3.2.8 3.8.7.6-.1 1.8-.8 2.1-1.5.3-.7.3-1.4.2-1.5-.1-.1-.3-.2-.6-.4Z"
      />
    </svg>
  );
}

export default function ProductDetailPage({
  product,
}: ProductDetailPageProps) {
  const isAvailable = product.status === "available";
  const [detailPanelMode, setDetailPanelMode] = useState<DetailPanelMode>("overview");
  const minusNotes = getMinusNotes(product);
  const minusSummary = minusNotes[0] || "-";
  const detailsList = [
    { label: "Kode Akun", value: product.code },
    { label: "Region", value: product.region },
    { label: "Minus", value: minusSummary },
    { label: "Notes", value: getAgentRankNote(product) },
  ];
  const heroItems = buildHeroItems(product);
  const currentPanelIndex = detailPanelOrder.indexOf(detailPanelMode);
  const previousPanelMode = currentPanelIndex > 0 ? detailPanelOrder[currentPanelIndex - 1] : null;
  const nextPanelMode = currentPanelIndex < detailPanelOrder.length - 1
    ? detailPanelOrder[currentPanelIndex + 1]
    : null;
  const desktopTabs = [
    {
      label: "Description",
      mode: "overview" as const,
      meta: `${product.code} info`,
    },
    {
      label: "Skins",
      mode: "skins" as const,
      meta: `${product.skins.length} skins`,
    },
    {
      label: "Heroes",
      mode: "heroes" as const,
      meta: getHeroCount(product),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="relative isolate overflow-hidden pt-20">
        <div className={`absolute inset-0 ${styles.detailShell}`} />
        <div className={`absolute inset-0 ${styles.detailAura}`} />
        <div className={`absolute inset-0 ${styles.detailMesh}`} />
        <div className={`absolute inset-0 ${styles.detailEdgeFade}`} />
        <div className={`absolute inset-x-0 top-0 h-72 ${styles.detailGlowTop}`} />
        <div className={`absolute inset-x-0 bottom-0 h-80 ${styles.detailGlowBottom}`} />
        <div className={`absolute inset-0 ${styles.detailVignette}`} />
        <div className={`absolute left-0 right-0 ${styles.detailStripTop}`} />
        <div className={`absolute left-0 right-0 ${styles.detailStripBottom}`} />

        <div className="pointer-events-none absolute left-[4%] top-36 hidden w-28 -rotate-6 text-primary/20 xl:block">
          <GamepadDoodle />
        </div>
        <div className="pointer-events-none absolute right-[6%] top-44 hidden w-32 rotate-[8deg] text-primary/20 xl:block">
          <CrosshairDoodle />
        </div>
        <div className="pointer-events-none absolute bottom-20 left-[10%] hidden w-28 rotate-[4deg] text-primary/16 xl:block">
          <TacticalMarkDoodle />
        </div>

        <div className="relative z-10 container mx-auto px-4 pb-16 pt-8 sm:pb-20 sm:pt-10">
          <div className="mb-6 flex flex-wrap items-center gap-2 sm:mb-8 sm:gap-3">
            <Link
              href="/#catalog"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2.5 font-display text-[11px] tracking-[0.16em] text-primary transition hover:bg-primary hover:text-primary-foreground sm:w-auto sm:justify-start sm:py-2"
            >
              <ArrowLeft size={14} />
              KEMBALI KE KATALOG
            </Link>
            <span className="rounded-full border border-border/40 bg-background/35 px-3 py-1.5 font-display text-[10px] tracking-[0.22em] text-muted-foreground">
              ACCOUNT DETAIL
            </span>
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-stretch xl:gap-8">
            <section className="h-full">
              <ProductImageGallery product={product} />
            </section>

            <section className="flex flex-col gap-4">
              <div className="rounded-[1.8rem] border border-border/35 bg-[linear-gradient(180deg,hsl(var(--card)/0.88),hsl(var(--background)/0.92))] p-5 backdrop-blur-md sm:p-6 xl:p-7">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h1 className="break-words font-display text-xl font-black tracking-[0.02em] text-white sm:text-3xl xl:text-[2.55rem]">
                        Valorant Account
                      </h1>
                    </div>
                    <div className="flex items-center gap-2 self-start font-display text-lg font-bold tracking-[0.08em] text-white/92 sm:pt-1 sm:text-2xl">
                      <span>{product.code}</span>
                      <span className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-[10px] tracking-[0.18em] text-primary sm:hidden">
                        {product.rank}
                      </span>
                    </div>
                  </div>

                  <div className="hidden items-center justify-between gap-4 rounded-[1.2rem] border border-border/30 bg-background/12 px-4 py-3 sm:flex">
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground/72">
                        Rank
                      </p>
                      <p className="mt-1 font-display text-lg font-bold text-white sm:text-xl">
                        {product.rank}
                      </p>
                    </div>
                    <span className="rounded-full border border-primary/30 bg-primary/12 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-primary">
                      {isAvailable ? "Available" : "Sold"}
                    </span>
                  </div>

                  <div className="hidden gap-3 sm:grid sm:grid-cols-3">
                    {desktopTabs.map((item) => {
                      const isActive = detailPanelMode === item.mode;

                      return (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => setDetailPanelMode(item.mode)}
                          className={`rounded-[1.15rem] border px-4 py-3 text-left transition ${
                            isActive
                              ? "border-primary/50 bg-[linear-gradient(145deg,hsl(var(--primary)/0.18),hsl(var(--primary)/0.06)_55%,transparent)] shadow-[0_0_18px_hsl(var(--primary)_/_0.14)]"
                              : "border-border/30 bg-background/16 hover:border-primary/25 hover:bg-primary/6"
                          }`}
                        >
                          <span className={`block text-xs font-semibold uppercase tracking-[0.16em] ${
                            isActive ? "text-primary" : "text-muted-foreground/72"
                          }`}>
                            {item.label}
                          </span>
                          <p className="mt-1 text-base font-bold text-white sm:text-lg">
                            {item.meta}
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  <div className="h-px bg-border/35" />

                  <div className="relative min-h-[22rem] rounded-[1.5rem] border border-border/30 bg-background/12 p-4 sm:p-5">
                    <div className="pointer-events-none absolute inset-y-0 -left-8 -right-8 flex items-center justify-between sm:hidden">
                      <button
                        type="button"
                        onClick={() => previousPanelMode && setDetailPanelMode(previousPanelMode)}
                        disabled={!previousPanelMode}
                        className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-background/45 text-white/88 backdrop-blur-md transition disabled:cursor-not-allowed disabled:opacity-30"
                        aria-label={`Go to ${previousPanelMode ? getDetailPanelLabel(previousPanelMode) : "previous"} panel`}
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() => nextPanelMode && setDetailPanelMode(nextPanelMode)}
                        disabled={!nextPanelMode}
                        className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-background/45 text-white/88 backdrop-blur-md transition disabled:cursor-not-allowed disabled:opacity-30"
                        aria-label={`Go to ${nextPanelMode ? getDetailPanelLabel(nextPanelMode) : "next"} panel`}
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>

                    {detailPanelMode !== "overview" ? (
                      <div className="mb-4 flex items-center justify-between gap-3 border-b border-border/35 pb-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground/72">
                            Detail Viewer
                          </p>
                          <p className="mt-1 text-sm text-white/84">
                            Showing {detailPanelMode === "heroes" ? "hero info" : "skin list"}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setDetailPanelMode("overview")}
                          className="hidden rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-primary transition hover:bg-primary hover:text-primary-foreground sm:inline-flex"
                        >
                          Kembali ke Deskripsi
                        </button>
                      </div>
                    ) : null}

                    {detailPanelMode === "overview" ? (
                      <div className="space-y-5">
                        <div className="space-y-2 text-sm leading-6 text-white/90 sm:text-lg sm:leading-7">
                          <p><span className="font-bold text-white">Minus:</span> {minusSummary}</p>
                          <p><span className="font-bold text-white">Emblem:</span> {product.premier || "-"}</p>
                          <p><span className="font-bold text-white">Region:</span> {product.region}</p>
                          <p><span className="font-bold text-white">Agent:</span> {getHeroCount(product)}</p>
                        </div>

                        <div className="rounded-[1.35rem] border border-primary/30 bg-primary/20 px-4 py-4 shadow-[0_0_24px_hsl(var(--primary)_/_0.14)]">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-primary/35 bg-primary/16 text-primary">
                              <ShieldCheck size={18} />
                            </div>
                            <div>
                              <p className="font-display text-[10px] tracking-[0.26em] text-primary/78">
                                GUARANTEE
                              </p>
                              <p className="mt-1 text-xs font-bold uppercase tracking-[0.06em] text-white sm:text-base">
                                Lifetime Warranty, No Hackback, Best Price
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-5 border-t border-border/35 pt-5">
                          <div>
                            <p className="font-display text-base font-bold uppercase tracking-[0.04em] text-white sm:text-xl">
                              Contact Admin For More Info
                            </p>
                          </div>

                          <div>
                            <p className="font-display text-base font-bold uppercase tracking-[0.04em] text-white sm:text-xl">
                              Details
                            </p>
                            <div className="mt-4 space-y-2 text-sm leading-6 text-white/90 sm:text-lg sm:leading-7">
                              {detailsList.map((item) => (
                                <p key={item.label}>
                                  <span className="font-bold text-white">{item.label}:</span> {item.value}
                                </p>
                              ))}
                            </div>
                          </div>

                          <div className="border-t border-border/35 pt-5">
                            <p className="font-display text-base font-black uppercase tracking-[0.04em] text-white sm:text-lg">
                              Reminder
                            </p>
                            <div className="mt-3 space-y-2 text-sm leading-6 text-white/88 sm:text-lg sm:leading-7">
                              <p>* Garansi akun selamanya & anti HB</p>
                              <p>* Pembelian akun diproses aman via admin storefront</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : detailPanelMode === "heroes" ? (
                      <div className="flex h-full flex-col">
                        <div className="flex items-center justify-between gap-3 border-b border-border/35 pb-4">
                          <div>
                            <p className="font-display text-base font-bold uppercase tracking-[0.04em] text-white sm:text-lg">
                              Hero Unlock
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground/78">
                              Detail unlock yang tersedia dari data akun saat ini.
                            </p>
                          </div>
                          <span className="rounded-full border border-primary/30 bg-primary/12 px-3 py-1 text-sm font-bold text-primary">
                            {getHeroCount(product)}
                          </span>
                        </div>
                        <ol className="panel-scrollbar mt-4 max-h-[16rem] space-y-2 overflow-y-auto pr-2 text-sm leading-6 text-white/88 sm:max-h-[18rem] sm:text-base">
                          {heroItems.slice(0, 10).map((item, index) => (
                            <li
                              key={`${item}-${index}`}
                              className="rounded-[1rem] border border-border/25 bg-background/22 px-4 py-3"
                            >
                              <span className="mr-2 font-display text-primary/86">
                                {String(index + 1).padStart(2, "0")}.
                              </span>
                              {item}
                            </li>
                          ))}
                        </ol>
                      </div>
                    ) : (
                      <div className="flex h-full flex-col">
                        <div className="flex items-center justify-between gap-3 border-b border-border/35 pb-4">
                          <div>
                            <p className="font-display text-base font-bold uppercase tracking-[0.04em] text-white sm:text-lg">
                              Skin List
                            </p>
                           
                          </div>
                          <span className="whitespace-nowrap rounded-full border border-primary/30 bg-primary/12 px-3 py-1 text-sm font-bold text-primary">
                            {product.skins.length} skins
                          </span>
                        </div>
                        <ol className="panel-scrollbar mt-4 max-h-[16rem] space-y-2 overflow-y-auto pr-2 text-sm leading-6 text-white/88 sm:max-h-[18rem] sm:text-base">
                          {product.skins.slice(0, 10).map((skin, index) => (
                            <li
                              key={skin}
                              className="rounded-[1rem] border border-border/25 bg-background/22 px-4 py-3"
                            >
                              <span className="mr-2 font-display text-primary/86">
                                {String(index + 1).padStart(2, "0")}.
                              </span>
                              {skin}
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>

                  <div className={`rounded-[1.6rem] border border-border/40 px-4 py-5 sm:px-5 ${styles.pricePanel}`}>
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <p className="font-display text-[2.6rem] font-black leading-none text-white sm:text-[3.15rem] xl:text-[3.75rem]">
                          Rp {formatPrice(product.price)}
                        </p>
                      </div>
                      <div className="inline-flex items-center gap-3 self-start sm:self-auto">
                        <span className="text-base font-semibold text-white/82">Status:</span>
                        <span className={`rounded-full px-4 py-2 text-sm font-bold lowercase ${
                          isAvailable
                            ? "border border-primary/35 bg-primary/18 text-primary"
                            : "bg-zinc-700 text-white"
                        }`}>
                          {isAvailable ? "available" : "sold"}
                        </span>
                      </div>
                    </div>

                    {isAvailable ? (
                      <a
                        href={buildWhatsAppLink(product)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-[1.2rem] bg-white px-5 py-4 text-center font-display text-base font-bold text-zinc-950 transition hover:bg-primary hover:text-primary-foreground"
                      >
                        <WhatsAppGlyph />
                        Beli Sekarang
                      </a>
                    ) : (
                      <span className="mt-5 flex items-center justify-center rounded-[1.2rem] border border-border/35 bg-background/28 px-5 py-4 text-center font-display text-base font-bold text-muted-foreground">
                        Akun Sudah Sold
                      </span>
                    )}
                  </div>
                </div>
              </div>

            </section>
          </div>
        </div>
      </main>

      <Footer compact />
    </div>
  );
}
