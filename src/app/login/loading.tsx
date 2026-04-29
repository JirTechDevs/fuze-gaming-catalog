export default function LoginLoading() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.15),_transparent_40%),linear-gradient(180deg,hsl(var(--background)),hsl(var(--background)/0.98))]" />
      <div className="absolute inset-0 bg-grid opacity-55" />
      <div className="absolute left-1/2 top-24 h-52 w-52 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-[1.8rem] border border-border/38 bg-[linear-gradient(180deg,hsl(var(--card)/0.9),hsl(var(--background)/0.92))] p-6 shadow-[0_24px_80px_hsl(var(--background)_/_0.46)] backdrop-blur-md sm:p-8">
          <div className="mb-8 text-center">
            <div className="mx-auto h-3 w-20 animate-pulse rounded bg-primary/20" />
            <div className="mx-auto mt-4 h-8 w-28 animate-pulse rounded bg-foreground/10" />
            <div className="mx-auto mt-4 h-4 w-56 animate-pulse rounded bg-muted-foreground/10" />
          </div>

          <div className="space-y-4">
            <div className="h-11 w-full animate-pulse rounded-xl bg-muted/40" />
            <div className="h-11 w-full animate-pulse rounded-xl bg-muted/40" />
            <div className="h-11 w-full animate-pulse rounded-xl bg-primary/15" />
          </div>
        </div>
      </div>
    </main>
  );
}
