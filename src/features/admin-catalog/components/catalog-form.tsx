"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { ChevronLeft, Save } from "lucide-react";
import {
  saveCatalogAction,
} from "@/features/admin-catalog/actions";
import type {
  CatalogFormState,
  CatalogRecord,
} from "@/features/admin-catalog/types";

interface CatalogFormProps {
  mode: "create" | "edit";
  record?: CatalogRecord;
}

const initialState: CatalogFormState = {
  error: null,
};

function SubmitButton({ mode }: { mode: CatalogFormProps["mode"] }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-[1rem] bg-primary px-5 font-display text-sm font-bold tracking-[0.16em] text-primary-foreground transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
    >
      <Save className="size-4" />
      {pending ? "MENYIMPAN..." : mode === "create" ? "CREATE CATALOG" : "SAVE CHANGES"}
    </button>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-2 block font-display text-[11px] tracking-[0.26em] text-muted-foreground/70">
      {children}
    </label>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="h-11 w-full rounded-[1rem] border border-border/45 bg-background/55 px-4 text-sm text-foreground outline-none transition focus:border-primary/45 focus:ring-2 focus:ring-primary/15"
    />
  );
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="w-full rounded-[1rem] border border-border/45 bg-background/55 px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary/45 focus:ring-2 focus:ring-primary/15"
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="h-11 w-full rounded-[1rem] border border-border/45 bg-background/55 px-4 text-sm text-foreground outline-none transition focus:border-primary/45 focus:ring-2 focus:ring-primary/15"
    />
  );
}

export default function CatalogForm({ mode, record }: CatalogFormProps) {
  const formAction = saveCatalogAction.bind(null, record?.id ?? null);
  const [state, action] = useActionState(formAction, initialState);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-[11px] tracking-[0.36em] text-primary/64">
            {mode === "create" ? "NEW CATALOG" : "EDIT CATALOG"}
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-[0.08em] text-foreground sm:text-3xl">
            {mode === "create" ? "Tambah Catalog" : `Edit ${record?.code ?? "Catalog"}`}
          </h2>
        </div>
        <Link
          href="/dashboard/catalog"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-[1rem] border border-border/45 bg-card/72 px-4 text-sm text-foreground transition hover:bg-card/95"
        >
          <ChevronLeft className="size-4" />
          Kembali ke Catalog
        </Link>
      </div>

      <form
        action={action}
        className="rounded-[1.8rem] border border-border/35 bg-[linear-gradient(180deg,hsl(var(--card)/0.88),hsl(var(--background)/0.92))] p-5 sm:p-7"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <FieldLabel>KODE AKUN</FieldLabel>
            <TextInput
              name="code"
              required
              defaultValue={record?.code}
              placeholder="FZ3067"
            />
          </div>

          <div>
            <FieldLabel>RANK</FieldLabel>
            <TextInput
              name="rank"
              required
              defaultValue={record?.rank}
              placeholder="Platinum 1"
            />
          </div>

          <div>
            <FieldLabel>HARGA</FieldLabel>
            <TextInput
              name="price"
              type="number"
              min="0"
              required
              defaultValue={record?.price ?? 0}
              placeholder="650000"
            />
          </div>

          <div>
            <FieldLabel>STATUS JUAL</FieldLabel>
            <Select name="status" defaultValue={record?.status ?? "available"}>
              <option value="available">available</option>
              <option value="sold">sold</option>
            </Select>
          </div>

          <div className="sm:col-span-2">
            <FieldLabel>FOTO UTAMA</FieldLabel>
            <TextInput
              name="mainImagePath"
              required
              defaultValue={record?.mainImagePath}
              placeholder="/images/catalog/example.webp"
            />
          </div>

          <div className="sm:col-span-2">
            <FieldLabel>FOTO TAMBAHAN</FieldLabel>
            <TextArea
              name="galleryImagePaths"
              rows={4}
              defaultValue={record?.galleryImagePaths.join("\n")}
              placeholder="/images/catalog/example-1.webp&#10;/images/catalog/example-2.webp"
            />
            <p className="mt-2 text-xs text-muted-foreground/62">
              Isi satu path per baris. Boleh dikosongkan kalau hanya ada satu gambar.
            </p>
          </div>

          <div>
            <FieldLabel>REGION</FieldLabel>
            <TextInput
              name="region"
              required
              defaultValue={record?.region ?? "IDN"}
              placeholder="IDN"
            />
          </div>

          <div>
            <FieldLabel>CHANGE NICK</FieldLabel>
            <Select
              name="changeNickStatus"
              defaultValue={record?.changeNickStatus ?? "Ready"}
            >
              <option value="Ready">Ready</option>
              <option value="Not Ready">Not Ready</option>
            </Select>
          </div>

          <div>
            <FieldLabel>AGENT UNLOCK</FieldLabel>
            <TextInput
              name="agentUnlock"
              required
              defaultValue={record?.agentUnlock ?? "Full Unlock"}
              placeholder="Full Unlock"
            />
          </div>

          <div>
            <FieldLabel>SISA VP</FieldLabel>
            <TextInput
              name="sisaVp"
              defaultValue={record?.sisaVp ?? "-"}
              placeholder="-"
            />
          </div>

          <div className="sm:col-span-2">
            <FieldLabel>PREMIER / EMBLEM</FieldLabel>
            <TextInput
              name="premier"
              defaultValue={record?.premier ?? "-"}
              placeholder="-"
            />
          </div>

          <div className="sm:col-span-2">
            <FieldLabel>DAFTAR SKIN</FieldLabel>
            <TextArea
              name="skins"
              rows={8}
              required
              defaultValue={record?.skins.join("\n")}
              placeholder={"Reaver Vandal\nPrime Phantom\nIon Sheriff"}
            />
            <p className="mt-2 text-xs text-muted-foreground/62">
              Isi satu skin per baris supaya lebih mudah dibaca oleh admin non-tech.
            </p>
          </div>
        </div>

        {state.error && (
          <div className="mt-5 rounded-[1rem] border border-destructive/28 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {state.error}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Link
            href="/dashboard/catalog"
            className="inline-flex h-11 items-center justify-center rounded-[1rem] border border-border/45 bg-background/55 px-5 text-sm text-foreground transition hover:bg-background/75"
          >
            Batal
          </Link>
          <SubmitButton mode={mode} />
        </div>
      </form>
    </div>
  );
}
