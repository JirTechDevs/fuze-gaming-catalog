import Link from "next/link";
import { ChevronRight, PackagePlus, Search, Sparkles } from "lucide-react";

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
];

export default function DashboardPage() {
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

      <section className="grid gap-4 xl:grid-cols-3">
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
