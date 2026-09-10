import Link from "next/link";
import { ChevronRight, ImagePlus, PackagePlus, Search, Sparkles, TrendingUp, CalendarDays, Calendar, ShoppingBag, Package, PlusCircle, BarChart2 } from "lucide-react";
import { getDashboardStats } from "@/features/analytics/server";

const quickActions = [
  {
    title: "Lihat Catalog",
    description: "Buka daftar catalog untuk cek akun yang sudah aktif, sold, atau perlu diubah.",
    href: "/dashboard/catalog",
    icon: Search,
    cta: "Open catalog",
  },
  {
    title: "Tambah Catalog",
    description: "Masukkan akun baru ke sistem dengan form admin yang sudah terhubung ke database.",
    href: "/dashboard/catalog/new",
    icon: PackagePlus,
    cta: "Add new catalog",
  },
  {
    title: "Kelola Lebih Cepat",
    description: "Edit data, ubah status jual, dan hapus item langsung dari modul catalog admin.",
    href: "/dashboard/catalog",
    icon: Sparkles,
    cta: "Manage catalog",
  },
  {
    title: "Atur Banner",
    description: "Ganti banner hero storefront langsung dari dashboard admin tanpa ubah file manual.",
    href: "/dashboard/banner",
    icon: ImagePlus,
    cta: "Open banner",
  },
];

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const trafficCards = [
    { label: "Pengunjung Hari Ini", value: stats.viewsToday.toLocaleString("id-ID"), icon: TrendingUp, note: "unique visitor · hari ini" },
    { label: "Pengunjung 7 Hari",   value: stats.views7d.toLocaleString("id-ID"),    icon: CalendarDays, note: "unique visitor · 7 hari" },
    { label: "Pengunjung 30 Hari",  value: stats.views30d.toLocaleString("id-ID"),   icon: Calendar,     note: "unique visitor · 30 hari" },
  ];

  const catalogCards = [
    { label: "Produk Aktif",       value: stats.available.toLocaleString("id-ID"),       icon: Package,    note: "status available" },
    { label: "Produk Terjual",     value: stats.sold.toLocaleString("id-ID"),            icon: ShoppingBag, note: "status sold" },
    { label: "Ditambah Bulan Ini", value: stats.addedThisMonth.toLocaleString("id-ID"),  icon: PlusCircle,  note: "produk baru" },
    { label: "Conversion Rate",    value: `${stats.conversionRate}%`,                    icon: BarChart2,   note: "sold / total produk" },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-[1.8rem] border border-border/35 bg-[linear-gradient(180deg,hsl(var(--card)/0.88),hsl(var(--background)/0.92))] p-6 sm:p-7">
        <p className="font-display text-[11px] tracking-[0.38em] text-primary/62">
          DASHBOARD HOME
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-[0.08em] text-foreground">
          Hi Faza!
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground/78 sm:text-base">
          Semua fondasi admin sudah siap. Dari sini kamu bisa langsung masuk ke
          modul catalog untuk tambah, edit, atau rapikan akun yang tampil di storefront.
        </p>
      </section>

      <section className="grid grid-cols-3 gap-4">
        {trafficCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-[1.5rem] border border-border/35 bg-card/72 p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground/68">{card.label}</p>
                <div className="flex h-8 w-8 items-center justify-center rounded-[0.75rem] border border-primary/18 bg-primary/8 text-primary">
                  <Icon className="size-4" />
                </div>
              </div>
              <p className="mt-3 font-display text-3xl font-bold tracking-[0.04em] text-foreground">{card.value}</p>
              <p className="mt-1 text-[11px] text-muted-foreground/52">{card.note}</p>
            </div>
          );
        })}
      </section>

      <section className="grid grid-cols-4 gap-4">
        {catalogCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-[1.5rem] border border-border/35 bg-card/72 p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground/68">{card.label}</p>
                <div className="flex h-8 w-8 items-center justify-center rounded-[0.75rem] border border-primary/18 bg-primary/8 text-primary">
                  <Icon className="size-4" />
                </div>
              </div>
              <p className="mt-3 font-display text-3xl font-bold tracking-[0.04em] text-foreground">{card.value}</p>
              <p className="mt-1 text-[11px] text-muted-foreground/52">{card.note}</p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-4">
        {quickActions.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.title}
              href={item.href}
              className="rounded-[1.5rem] border border-border/35 bg-card/72 p-5 backdrop-blur-sm"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-[1rem] border border-primary/18 bg-primary/8 text-primary">
                <Icon className="size-5" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold tracking-[0.06em] text-foreground">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground/76">
                {item.description}
              </p>
              <div className="mt-5 inline-flex items-center gap-2 font-display text-xs tracking-[0.18em] text-primary">
                {item.cta}
                <ChevronRight className="size-4" />
              </div>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
