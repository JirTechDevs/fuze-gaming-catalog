"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { LockKeyhole, Mail } from "lucide-react";
import { signInAction, type LoginFormState } from "@/features/admin-auth/actions";
import { useActionToast } from "@/hooks/use-action-toast";
import { initialActionResult } from "@/lib/action-result";

const initialLoginFormState: LoginFormState = initialActionResult;

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 w-full items-center justify-center rounded-[1rem] bg-primary px-4 font-display text-sm font-bold tracking-[0.18em] text-primary-foreground transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {pending ? "MASUK..." : "LOGIN"}
    </button>
  );
}

export default function LoginForm() {
  const [state, formAction] = useActionState(signInAction, initialLoginFormState);
  useActionToast(state);

  return (
    <form action={formAction} className="space-y-4">
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="font-display text-[11px] tracking-[0.28em] text-muted-foreground/68"
        >
          EMAIL
        </label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-primary/65" />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="h-12 w-full rounded-[1rem] border border-border/55 bg-background/55 pl-11 pr-4 text-sm text-foreground outline-none transition focus:border-primary/45 focus:ring-2 focus:ring-primary/15"
            placeholder="admin@fuzevalo.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="password"
          className="font-display text-[11px] tracking-[0.28em] text-muted-foreground/68"
        >
          PASSWORD
        </label>
        <div className="relative">
          <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-primary/65" />
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="h-12 w-full rounded-[1rem] border border-border/55 bg-background/55 pl-11 pr-4 text-sm text-foreground outline-none transition focus:border-primary/45 focus:ring-2 focus:ring-primary/15"
            placeholder="Masukkan password"
          />
        </div>
      </div>

      {state.status === "error" && state.message && (
        <div className="rounded-[1rem] border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.message}
        </div>
      )}

      <SubmitButton />
    </form>
  );
}
