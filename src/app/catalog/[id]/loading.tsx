export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border/20 bg-card/40">
        <div className="mx-auto flex h-16 max-w-[1480px] items-center gap-3 px-4 sm:px-6 lg:px-8">
          <div className="h-9 w-9 animate-pulse rounded-full bg-muted/30" />
          <div className="h-4 w-32 animate-pulse rounded-full bg-muted/30" />
        </div>
      </div>

      <main className="mx-auto max-w-[1480px] px-4 pb-16 pt-6 sm:px-6 sm:pb-20 sm:pt-10 lg:px-8">
        <div className="mb-6 h-9 w-44 animate-pulse rounded-full bg-muted/30 sm:mb-8" />

        <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch xl:gap-8">
          <section className="h-full">
            <div className="aspect-[4/3] w-full animate-pulse rounded-[1.8rem] bg-muted/20" />
            <div className="mt-4 flex gap-3">
              {[0, 1, 2, 3].map((slot) => (
                <div
                  key={slot}
                  className="h-16 w-16 shrink-0 animate-pulse rounded-[0.9rem] bg-muted/20 sm:h-20 sm:w-20"
                />
              ))}
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="rounded-[1.8rem] bg-card/50 p-5 sm:p-6 xl:p-7">
              <div className="flex flex-col gap-4">
                <div className="h-9 w-40 animate-pulse rounded-full bg-muted/25 sm:h-10 sm:w-56" />
                <div className="h-px bg-border/35" />

                <div className="rounded-[1.5rem] bg-background/12 p-4 sm:p-5">
                  <div className="flex items-center justify-between">
                    <div className="h-5 w-24 animate-pulse rounded-full bg-muted/25" />
                    <div className="h-6 w-16 animate-pulse rounded-full bg-muted/25" />
                  </div>
                  <div className="mt-4 space-y-2">
                    {[0, 1, 2, 3, 4].map((line) => (
                      <div
                        key={line}
                        className="h-8 animate-pulse rounded-[0.7rem] bg-muted/15"
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-2 px-1">
                  {[0, 1, 2].map((row) => (
                    <div key={row} className="flex gap-2">
                      <div className="h-4 w-16 animate-pulse rounded-full bg-muted/25" />
                      <div className="h-4 flex-1 animate-pulse rounded-full bg-muted/15" />
                    </div>
                  ))}
                </div>

                <div className="mt-2 h-32 animate-pulse rounded-[1.6rem] bg-muted/20" />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
