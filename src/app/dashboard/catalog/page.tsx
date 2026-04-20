import Link from "next/link";
import { Plus, Search } from "lucide-react";
import CatalogRowActions from "@/features/admin-catalog/components/catalog-row-actions";
import { listAdminCatalog } from "@/features/admin-catalog/server";
import { formatPrice } from "@/features/catalog/domain/product";

interface DashboardCatalogPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function DashboardCatalogPage({
  searchParams,
}: DashboardCatalogPageProps) {
  const { q = "" } = await searchParams;
  const items = await listAdminCatalog(q);

  return (
    <div className="space-y-6">
      <section className="rounded-[1.8rem] border border-border/35 bg-[linear-gradient(180deg,hsl(var(--card)/0.88),hsl(var(--background)/0.92))] p-6 sm:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-display text-[11px] tracking-[0.36em] text-primary/64">
              PHASE 3
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-[0.08em] text-foreground">
              Catalog Management
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground/76 sm:text-base">
              Kelola data akun yang akan muncul di storefront. Kamu bisa cari, edit,
              hapus, dan mengganti status jual langsung dari dashboard ini.
            </p>
          </div>

          <Link
            href="/dashboard/catalog/new"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-[1rem] bg-primary px-5 font-display text-sm font-bold tracking-[0.16em] text-primary-foreground transition hover:opacity-95"
          >
            <Plus className="size-4" />
            ADD CATALOG
          </Link>
        </div>

        <form className="mt-5 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-primary/64" />
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Cari berdasarkan kode akun atau rank..."
              className="h-11 w-full rounded-[1rem] border border-border/45 bg-background/55 pl-11 pr-4 text-sm text-foreground outline-none transition focus:border-primary/45 focus:ring-2 focus:ring-primary/15"
            />
          </div>
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center rounded-[1rem] border border-border/45 bg-card/72 px-5 text-sm text-foreground transition hover:bg-card/95"
          >
            Search
          </button>
        </form>
      </section>

      <section className="rounded-[1.8rem] border border-border/35 bg-card/72 p-4 backdrop-blur-sm sm:p-5">
        {items.length === 0 ? (
          <div className="flex min-h-56 flex-col items-center justify-center rounded-[1.4rem] border border-dashed border-border/35 bg-background/35 px-6 text-center">
            <p className="font-display text-lg tracking-[0.12em] text-foreground">
              Catalog tidak ditemukan
            </p>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground/72">
              Coba ubah kata pencarian atau tambahkan catalog baru dari tombol di atas.
            </p>
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead>
                  <tr className="border-b border-border/30">
                    {["Code", "Rank", "Price", "Status", "Region", "Actions"].map((heading) => (
                      <th
                        key={heading}
                        className="px-4 py-3 font-display text-[11px] tracking-[0.24em] text-muted-foreground/64"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-border/20 last:border-b-0">
                      <td className="px-4 py-4 font-display font-semibold tracking-[0.08em] text-primary">
                        {item.code}
                      </td>
                      <td className="px-4 py-4 text-foreground/84">{item.rank}</td>
                      <td className="px-4 py-4 font-medium text-foreground/84">
                        Rp {formatPrice(item.price)}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs ${
                            item.status === "available"
                              ? "bg-primary/12 text-primary"
                              : "bg-destructive/12 text-destructive"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-foreground/72">{item.region}</td>
                      <td className="px-4 py-4">
                        <CatalogRowActions item={item} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 md:hidden">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="rounded-[1.4rem] border border-border/35 bg-background/35 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-base font-bold tracking-[0.08em] text-primary">
                        {item.code}
                      </p>
                      <p className="mt-1 text-sm text-foreground/84">{item.rank}</p>
                    </div>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs ${
                        item.status === "available"
                          ? "bg-primary/12 text-primary"
                          : "bg-destructive/12 text-destructive"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 rounded-[1.1rem] border border-border/25 bg-card/60 p-3">
                    <div>
                      <p className="text-[11px] tracking-[0.18em] text-muted-foreground/60">PRICE</p>
                      <p className="mt-1 text-sm text-foreground">Rp {formatPrice(item.price)}</p>
                    </div>
                    <div>
                      <p className="text-[11px] tracking-[0.18em] text-muted-foreground/60">REGION</p>
                      <p className="mt-1 text-sm text-foreground">{item.region}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <CatalogRowActions item={item} />
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
