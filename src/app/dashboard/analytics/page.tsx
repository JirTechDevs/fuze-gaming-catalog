import { BarChart2, Calendar, CalendarDays, ExternalLink, Globe, MousePointerClick, Search, TrendingUp } from "lucide-react";
import { getDashboardStats } from "@/features/analytics/server";
import { getSearchConsoleData } from "@/features/analytics/search-console";
import GscChart from "@/features/analytics/components/gsc-chart";

export default async function AnalyticsPage() {
  const [stats, gsc] = await Promise.all([
    getDashboardStats(),
    getSearchConsoleData(),
  ]);

  const trafficCards = [
    { label: "Hari Ini",  value: stats.viewsToday.toLocaleString("id-ID"), icon: TrendingUp,  note: "unique visitor" },
    { label: "7 Hari",   value: stats.views7d.toLocaleString("id-ID"),    icon: CalendarDays, note: "unique visitor" },
    { label: "30 Hari",  value: stats.views30d.toLocaleString("id-ID"),   icon: Calendar,     note: "unique visitor" },
  ];

  return (
    <div className="space-y-8">

      {/* ── Section 1: Storefront ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-[0.85rem] border border-primary/20 bg-primary/8 text-primary">
            <Globe className="size-4" />
          </div>
          <div>
            <p className="font-display text-[10px] tracking-[0.32em] text-primary/60">INTERNAL TRACKING</p>
            <h2 className="font-display text-base font-bold tracking-[0.06em] text-foreground">Storefront Traffic</h2>
          </div>
          <span className="ml-auto rounded-full border border-primary/18 bg-primary/6 px-2.5 py-1 text-[10px] text-primary/72">
            fuzevalo.com · semua sumber traffic
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {trafficCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.label} className="rounded-[1.4rem] border border-border/35 bg-card/72 p-5 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground/68">Pengunjung {card.label}</p>
                  <div className="flex h-8 w-8 items-center justify-center rounded-[0.75rem] border border-primary/18 bg-primary/8 text-primary">
                    <Icon className="size-4" />
                  </div>
                </div>
                <p className="mt-3 font-display text-3xl font-bold tracking-[0.04em] text-foreground">{card.value}</p>
                <p className="mt-1 text-[11px] text-muted-foreground/52">{card.note}</p>
              </div>
            );
          })}
        </div>

        <p className="text-[11px] text-muted-foreground/45">
          Mencakup semua traffic: Google, WhatsApp, direct, social media. Bot dan admin dikecualikan. Unique per session per hari.
        </p>
      </section>

      <div className="border-t border-border/25" />

      {/* ── Section 2: Google Search Console ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-[0.85rem] border border-[#4285F4]/25 bg-[#4285F4]/8 text-[#4285F4]">
            <Search className="size-4" />
          </div>
          <div>
            <p className="font-display text-[10px] tracking-[0.32em] text-[#4285F4]/70">GOOGLE SEARCH CONSOLE</p>
            <h2 className="font-display text-base font-bold tracking-[0.06em] text-foreground">Google Search Traffic</h2>
          </div>
          <span className="ml-auto rounded-full border border-border/30 bg-card/60 px-2.5 py-1 text-[10px] text-muted-foreground/60">
            hanya dari hasil Google Search
          </span>
        </div>

        {gsc ? (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4">
              {[
                { label: "Total Clicks",    value: gsc.clicks.toLocaleString("id-ID"),      icon: MousePointerClick, note: "28 hari terakhir" },
                { label: "Impressions",     value: gsc.impressions.toLocaleString("id-ID"), icon: BarChart2,         note: "muncul di hasil search" },
                { label: "CTR",             value: `${gsc.ctr}%`,                           icon: TrendingUp,        note: "click-through rate" },
                { label: "Avg. Position",   value: gsc.position.toFixed(1),                 icon: Search,            note: "posisi rata-rata di Google" },
              ].map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.label} className="rounded-[1.4rem] border border-border/35 bg-card/72 p-5 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted-foreground/68">{card.label}</p>
                      <div className="flex h-8 w-8 items-center justify-center rounded-[0.75rem] border border-[#4285F4]/18 bg-[#4285F4]/8 text-[#4285F4]">
                        <Icon className="size-4" />
                      </div>
                    </div>
                    <p className="mt-3 font-display text-3xl font-bold tracking-[0.04em] text-foreground">{card.value}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground/52">{card.note}</p>
                  </div>
                );
              })}
            </div>

            {gsc.daily.length > 0 && (
              <div className="rounded-[1.4rem] border border-border/35 bg-card/72 p-5">
                <p className="mb-4 font-display text-xs tracking-[0.24em] text-muted-foreground/60">CLICKS & IMPRESSIONS — 28 HARI</p>
                <GscChart data={gsc.daily} />
              </div>
            )}

            {gsc.topQueries.length > 0 && (
              <div className="rounded-[1.4rem] border border-border/35 bg-card/72 p-5">
                <p className="mb-4 font-display text-xs tracking-[0.24em] text-muted-foreground/60">TOP QUERIES</p>
                <div className="space-y-2">
                  {gsc.topQueries.map((q, i) => (
                    <div key={q.query} className="flex items-center gap-3 rounded-[0.75rem] px-3 py-2.5 hover:bg-secondary/40">
                      <span className="w-5 text-right font-display text-xs text-muted-foreground/40">{i + 1}</span>
                      <span className="flex-1 text-sm text-foreground">{q.query}</span>
                      <span className="font-display text-sm font-semibold text-primary">{q.clicks.toLocaleString("id-ID")}</span>
                      <span className="w-20 text-right text-xs text-muted-foreground/52">{q.impressions.toLocaleString("id-ID")} impr.</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-[1.4rem] border border-dashed border-border/40 bg-card/40 p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[1rem] border border-border/35 bg-background/60">
              <Search className="size-5 text-muted-foreground/50" />
            </div>
            <p className="mt-4 font-display text-sm font-semibold tracking-[0.06em] text-foreground">
              Google Search Console belum terhubung
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground/60">
              Setup service account dan tambahkan <code className="rounded bg-secondary px-1 py-0.5 text-[11px]">GOOGLE_SERVICE_ACCOUNT_JSON</code> ke env var untuk menampilkan data search Google.
            </p>
            <a
              href="https://search.google.com/search-console"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#4285F4]/25 bg-[#4285F4]/8 px-4 py-2 text-xs text-[#4285F4] transition hover:bg-[#4285F4]/14"
            >
              Buka Search Console
              <ExternalLink className="size-3" />
            </a>
          </div>
        )}

        <p className="text-[11px] text-muted-foreground/45">
          Hanya mencakup traffic yang datang dari hasil pencarian Google. Tidak termasuk direct, WhatsApp, atau social media.
        </p>
      </section>

    </div>
  );
}
