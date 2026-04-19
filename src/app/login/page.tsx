import type { Metadata } from "next";
import LoginForm from "@/features/admin-auth/components/login-form";
import { redirectAuthenticatedUser } from "@/features/admin-auth/guards";

export const metadata: Metadata = {
  title: "Login | Fuzevalo",
  description: "Login admin untuk mengakses dashboard Fuzevalo.",
};

export default async function LoginPage() {
  await redirectAuthenticatedUser();

  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.15),_transparent_40%),linear-gradient(180deg,hsl(var(--background)),hsl(var(--background)/0.98))]" />
      <div className="absolute inset-0 bg-grid opacity-55" />
      <div className="absolute left-1/2 top-24 h-52 w-52 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-10">
        <div className="w-full max-w-md rounded-[1.8rem] border border-border/38 bg-[linear-gradient(180deg,hsl(var(--card)/0.9),hsl(var(--background)/0.92))] p-6 shadow-[0_24px_80px_hsl(var(--background)_/_0.46)] backdrop-blur-md sm:p-8">
          <div className="mb-8 text-center">
            <p className="font-display text-[11px] tracking-[0.4em] text-primary/64">
              FUZEVALO
            </p>
            <h1 className="mt-3 font-display text-3xl font-bold tracking-[0.14em] text-foreground">
              LOGIN
            </h1>
            <p className="mt-3 text-sm text-muted-foreground/74">
              Masuk untuk mengakses dashboard admin.
            </p>
          </div>

          <LoginForm />
        </div>
      </div>
    </main>
  );
}
