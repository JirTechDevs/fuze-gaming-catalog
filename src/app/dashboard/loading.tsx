export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Welcome Banner Skeleton */}
      <section className="rounded-[1.8rem] border border-border/35 bg-[linear-gradient(180deg,hsl(var(--card)/0.88),hsl(var(--background)/0.92))] p-6 sm:p-7 space-y-3">
        <div className="h-3 w-28 rounded-md bg-primary/20" />
        <div className="h-8 w-44 rounded-lg bg-foreground/15" />
        <div className="h-4 w-96 max-w-full rounded-md bg-muted-foreground/15" />
      </section>

      {/* Traffic Stats Skeleton */}
      <div className="space-y-2">
        <div className="h-3 w-32 rounded bg-muted-foreground/20" />
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="rounded-[1.4rem] border border-border/35 bg-card/72 p-5 space-y-3"
            >
              <div className="flex justify-between items-center">
                <div className="h-3 w-28 rounded bg-muted-foreground/20" />
                <div className="h-5 w-5 rounded bg-primary/20" />
              </div>
              <div className="h-7 w-20 rounded bg-foreground/15" />
              <div className="h-3 w-32 rounded bg-muted-foreground/15" />
            </div>
          ))}
        </div>
      </div>

      {/* Catalog Stats Skeleton */}
      <div className="space-y-2">
        <div className="h-3 w-32 rounded bg-muted-foreground/20" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-[1.4rem] border border-border/35 bg-card/72 p-5 space-y-3"
            >
              <div className="flex justify-between items-center">
                <div className="h-3 w-28 rounded bg-muted-foreground/20" />
                <div className="h-5 w-5 rounded bg-primary/20" />
              </div>
              <div className="h-7 w-20 rounded bg-foreground/15" />
              <div className="h-3 w-32 rounded bg-muted-foreground/15" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
