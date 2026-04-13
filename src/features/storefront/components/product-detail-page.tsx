import Link from "next/link";
import {
  ArrowLeft,
  CircleCheck,
} from "lucide-react";
import {
  buildWhatsAppLink,
  type Product,
} from "@/features/catalog/domain/product";
import Footer from "@/features/storefront/components/footer";
import ProductImageGallery from "@/features/storefront/components/product-image-gallery";
import Navbar from "@/features/storefront/components/navbar";
import styles from "./product-detail-page.module.css";

interface ProductDetailPageProps {
  product: Product;
}

const detailRows = (product: Product) => [
  { label: "Status Akun", value: product.status === "available" ? "Tersedia" : "Sold" },
  { label: "Change Nick", value: product.changeNick },
  { label: "Region", value: product.region },
  { label: "Sisa VP", value: product.sisaVP || "-" },
  { label: "Premier", value: product.premier || "-" },
  { label: "Agent", value: product.agent },
];

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

        <div className="relative z-10 container mx-auto px-4 pb-20 pt-10">
          <div className="mb-8 flex flex-wrap items-center gap-3">
            <Link
              href="/#catalog"
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 font-display text-[11px] tracking-[0.16em] text-primary transition hover:bg-primary hover:text-primary-foreground"
            >
              <ArrowLeft size={14} />
              KEMBALI KE KATALOG
            </Link>
            <span className="rounded-full border border-border/40 bg-background/35 px-3 py-1.5 font-display text-[10px] tracking-[0.22em] text-muted-foreground">
              ACCOUNT DETAIL
            </span>
          </div>

          <div className="grid gap-8 xl:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] xl:items-start">
            <section className="xl:sticky xl:top-28">
              <ProductImageGallery product={product} />
            </section>

            <section className="flex flex-col gap-6">
              <div className="rounded-[2rem] border border-border/35 bg-card/72 p-6 backdrop-blur-md">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <span className="font-display text-[11px] tracking-[0.34em] text-primary/62">
                      FUZEVALO ACCOUNT
                    </span>
                    <h1 className="mt-3 font-display text-3xl font-bold tracking-[0.08em] text-foreground sm:text-4xl">
                      {product.code}
                    </h1>
                    <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground/82">
                      Halaman detail akun dibuat ringkas supaya informasi utama
                      cepat terbaca tanpa kehilangan nuansa visual dari storefront.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-primary/25 bg-primary/10 px-3 py-1.5 font-display text-[10px] tracking-[0.2em] text-primary">
                      {product.rank}
                    </span>
                    <span className="rounded-full border border-border/40 bg-background/35 px-3 py-1.5 font-display text-[10px] tracking-[0.2em] text-muted-foreground">
                      {product.region}
                    </span>
                    <span className="rounded-full border border-border/40 bg-background/35 px-3 py-1.5 font-display text-[10px] tracking-[0.2em] text-muted-foreground">
                      {product.changeNick.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {detailRows(product).map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[1.5rem] border border-border/35 bg-card/62 px-5 py-4 backdrop-blur-md"
                    >
                      <span className="font-display text-[10px] tracking-[0.22em] text-muted-foreground/55">
                        {item.label}
                      </span>
                      <p className="mt-2 text-sm font-medium text-foreground/88">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div> */}
              </div>

                <div className="rounded-[2rem] border border-border/35 bg-card/72 p-6 backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <CircleCheck size={15} className="text-primary" />
                    <span className="font-display text-[11px] tracking-[0.24em] text-primary/74">
                      DAFTAR SKIN
                    </span>
                  </div>
                  <ol className="panel-scrollbar mt-5 max-h-[37rem] min-h-[31.5rem] space-y-2 overflow-y-auto pr-2 text-[13px] leading-5 text-foreground/84">
                    {product.skins.map((skin, index) => (
                      <li
                        key={skin}
                        className="rounded-[1rem] border border-border/25 bg-background/28 px-4 py-2.5"
                      >
                        <span className="mr-2 font-display text-primary/86">
                          {String(index + 1).padStart(2, "0")}.
                        </span>
                        {skin}
                      </li>
                    ))}
                  </ol>
                </div>

                {isAvailable ? (
                  <a
                    href={buildWhatsAppLink(product)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-3 rounded-[1.35rem] bg-primary px-6 py-4 font-display text-sm font-bold tracking-[0.16em] text-primary-foreground transition hover:box-glow-strong"
                  >
                    <WhatsAppGlyph />
                    BELI AKUN
                  </a>
                ) : (
                  <span className="inline-flex items-center justify-center rounded-[1.35rem] border border-border/35 bg-background/36 px-6 py-4 font-display text-sm tracking-[0.16em] text-muted-foreground">
                    AKUN SUDAH SOLD
                  </span>
                )}
              </section>
            </div>
        </div>
      </main>

      <Footer compact />
    </div>
  );
}
