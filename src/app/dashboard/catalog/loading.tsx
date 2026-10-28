export default function DashboardCatalogLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Top Header Card Skeleton */}
      <section className="rounded-[1.8rem] border border-border/35 bg-[linear-gradient(180deg,hsl(var(--card)/0.88),hsl(var(--background)/0.92))] p-6 sm:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <div className="h-3 w-20 rounded-md bg-primary/20" />
            <div className="h-8 w-64 rounded-lg bg-foreground/15" />
            <div className="h-4 w-96 max-w-full rounded-md bg-muted-foreground/15" />
          </div>

          <div className="h-11 w-40 rounded-[1rem] bg-primary/25" />
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <div className="h-11 flex-1 rounded-[1rem] bg-background/55 border border-border/30" />
          <div className="h-11 w-24 rounded-[1rem] bg-card/60 border border-border/30" />
        </div>
      </section>

      {/* Table Card Skeleton */}
      <section className="rounded-[1.8rem] border border-border/35 bg-card/72 p-4 sm:p-5">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border/30">
                {["Code", "Rank", "Price", "Status", "Region", "Actions"].map((heading) => (
                  <th
                    key={heading}
                    className="px-4 py-3 font-display text-[11px] tracking-[0.24em] text-muted-foreground/40"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {Array.from({ length: 5 }).map((_, index) => (
                <tr key={index}>
                  <td className="px-4 py-4">
                    <div className="h-5 w-20 rounded bg-primary/25" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 w-28 rounded bg-foreground/10" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 w-32 rounded bg-foreground/10" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-6 w-20 rounded-full bg-emerald-500/15" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 w-12 rounded bg-foreground/10" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <div className="h-10 w-10 rounded-[0.9rem] bg-card/80 border border-border/30" />
                      <div className="h-10 w-10 rounded-[0.9rem] bg-card/80 border border-border/30" />
                      <div className="h-10 w-10 rounded-[0.9rem] bg-destructive/15 border border-destructive/20" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Skeleton Cards */}
        <div className="space-y-3 md:hidden">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-[1.4rem] border border-border/35 bg-background/35 p-4 space-y-3"
            >
              <div className="flex justify-between items-center">
                <div className="h-5 w-24 rounded bg-primary/25" />
                <div className="h-6 w-16 rounded-full bg-foreground/10" />
              </div>
              <div className="h-4 w-32 rounded bg-foreground/10" />
              <div className="h-5 w-28 rounded bg-foreground/10" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
