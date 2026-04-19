import { Database, Lock, PanelLeftClose } from "lucide-react";

const quickNotes = [
  {
    title: "Supabase Auth",
    description: "Login dashboard sudah aktif menggunakan email + password dari Supabase.",
    icon: Lock,
  },
  {
    title: "Dashboard Shell",
    description: "Sidebar kiri sudah siap dan bisa di-collapse untuk navigasi admin.",
    icon: PanelLeftClose,
  },
  {
    title: "Database Ready",
    description: "Fondasi tabel, RLS, dan storage bucket sudah disiapkan di Phase 1.",
    icon: Database,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-[1.8rem] border border-border/35 bg-[linear-gradient(180deg,hsl(var(--card)/0.88),hsl(var(--background)/0.92))] p-6 sm:p-7">
        <p className="font-display text-[11px] tracking-[0.38em] text-primary/62">
          PHASE 2
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-[0.08em] text-foreground">
          Dashboard Home
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground/78 sm:text-base">
          Auth dan dashboard shell sudah dipasang. Phase berikutnya bisa fokus ke
          catalog CRUD tanpa perlu menyentuh fondasi login lagi.
        </p>
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        {quickNotes.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.title}
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
            </article>
          );
        })}
      </section>
    </div>
  );
}
