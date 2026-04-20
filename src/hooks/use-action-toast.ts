"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/sonner";
import type { ActionResult } from "@/lib/action-result";

interface UseActionToastOptions {
  refreshOnSuccess?: boolean;
}

export function useActionToast(
  state: ActionResult,
  options: UseActionToastOptions = {},
) {
  const router = useRouter();
  const handledStateRef = useRef<string | null>(null);

  useEffect(() => {
    if (state.status === "idle" || !state.message) {
      return;
    }

    const handledKey = `${state.status}:${state.message}:${state.redirectTo ?? ""}`;

    if (handledStateRef.current === handledKey) {
      return;
    }

    handledStateRef.current = handledKey;

    if (state.status === "error") {
      toast.error(state.message);
      return;
    }

    toast.success(state.message);

    if (state.redirectTo) {
      router.push(state.redirectTo);
      return;
    }

    if (options.refreshOnSuccess) {
      router.refresh();
    }
  }, [options.refreshOnSuccess, router, state.message, state.redirectTo, state.status]);
}
