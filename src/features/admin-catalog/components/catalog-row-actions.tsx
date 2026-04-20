"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";
import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  deleteCatalogAction,
  toggleCatalogStatusAction,
} from "@/features/admin-catalog/actions";
import type { CatalogRecord } from "@/features/admin-catalog/types";

function StatusButton({ currentStatus }: { currentStatus: CatalogRecord["status"] }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-10 min-w-10 items-center justify-center rounded-[0.9rem] border border-border/40 bg-card/72 text-foreground/74 transition hover:border-primary/30 hover:text-primary disabled:opacity-60"
      title={currentStatus === "available" ? "Mark as sold" : "Mark as available"}
    >
      {currentStatus === "available" ? (
        <EyeOff className="size-4" />
      ) : (
        <Eye className="size-4" />
      )}
    </button>
  );
}

function DeleteConfirmButton() {
  const { pending } = useFormStatus();

  return (
    <AlertDialogAction
      type="submit"
      disabled={pending}
      className="rounded-[0.95rem] bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-70"
    >
      {pending ? "MENGHAPUS..." : "Ya, hapus"}
    </AlertDialogAction>
  );
}

interface CatalogRowActionsProps {
  item: CatalogRecord;
}

export default function CatalogRowActions({ item }: CatalogRowActionsProps) {
  const toggleAction = toggleCatalogStatusAction.bind(null, item.id, item.status);
  const deleteAction = deleteCatalogAction.bind(null, item.id);

  return (
    <div className="flex items-center gap-2">
      <form action={toggleAction}>
        <StatusButton currentStatus={item.status} />
      </form>

      <Link
        href={`/dashboard/catalog/${item.id}/edit`}
        className="inline-flex h-10 min-w-10 items-center justify-center rounded-[0.9rem] border border-border/40 bg-card/72 text-foreground/74 transition hover:border-primary/30 hover:text-primary"
        title="Edit catalog"
      >
        <Pencil className="size-4" />
      </Link>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button
            type="button"
            className="inline-flex h-10 min-w-10 items-center justify-center rounded-[0.9rem] border border-destructive/20 bg-destructive/8 text-destructive transition hover:bg-destructive/14"
            title="Delete catalog"
          >
            <Trash2 className="size-4" />
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent className="rounded-[1.5rem] border-border/45 bg-[linear-gradient(180deg,hsl(var(--card)/0.96),hsl(var(--background)/0.98))]">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-xl tracking-[0.08em] text-foreground">
              Hapus Catalog
            </AlertDialogTitle>
            <AlertDialogDescription className="leading-6 text-muted-foreground/76">
              Kamu yakin ingin menghapus <span className="font-semibold text-foreground">{item.code}</span>?
              Tindakan ini tidak bisa dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-[0.95rem] border-border/45 bg-background/60">
              Batal
            </AlertDialogCancel>
            <form action={deleteAction}>
              <DeleteConfirmButton />
            </form>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
