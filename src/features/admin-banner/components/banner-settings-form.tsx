"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { ImagePlus, Save, Upload, X } from "lucide-react";
import { useFormStatus } from "react-dom";
import { saveBannerSettingsAction } from "@/features/admin-banner/actions";
import type { BannerSettingsRecord } from "@/features/admin-banner/server";
import { useActionToast } from "@/hooks/use-action-toast";
import { initialActionResult } from "@/lib/action-result";

interface BannerSettingsFormProps {
  settings: BannerSettingsRecord;
}

type BannerSlotValue = {
  file: File | null;
  storedUrl: string;
  previewUrl: string;
  removeStored: boolean;
};

function SubmitButton({ disabled = false }: { disabled?: boolean }) {
  const { pending } = useFormStatus();
  const isDisabled = pending || disabled;

  return (
    <button
      type="submit"
      disabled={isDisabled}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-[1rem] bg-primary px-5 font-display text-sm font-bold tracking-[0.16em] text-primary-foreground transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
    >
      <Save className="size-4" />
      {pending ? "MENYIMPAN..." : "SIMPAN BANNER"}
    </button>
  );
}

function BannerPreview({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.3rem] border border-border/35 bg-background/30 p-4">
      <p className="font-display text-[11px] tracking-[0.26em] text-muted-foreground/68">
        {label}
      </p>
      <div className="mt-3 overflow-hidden rounded-[1rem] border border-border/30 bg-card/65">
        {value ? (
          <img
            src={value}
            alt={label}
            className="aspect-[1840/853] w-full object-contain"
          />
        ) : (
          <div className="flex aspect-[1840/853] items-center justify-center text-center text-sm text-muted-foreground/66">
            Banner belum diisi
          </div>
        )}
      </div>
    </div>
  );
}

function syncFileInputFile(
  inputRef: React.RefObject<HTMLInputElement | null>,
  file: File | null,
) {
  if (!inputRef.current) {
    return;
  }

  if (!file) {
    inputRef.current.value = "";
    return;
  }

  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(file);
  inputRef.current.files = dataTransfer.files;
}

function BannerUploadCard({
  slot,
  value,
  inputRef,
  onSelectFile,
  onClearNewFile,
  onRemoveStored,
}: {
  slot: 1 | 2 | 3;
  value: BannerSlotValue;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onSelectFile: (slot: 1 | 2 | 3, file: File | null) => void;
  onClearNewFile: (slot: 1 | 2 | 3) => void;
  onRemoveStored: (slot: 1 | 2 | 3) => void;
}) {
  return (
    <div className="rounded-[1.3rem] border border-border/35 bg-background/30 p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-display text-[11px] tracking-[0.28em] text-muted-foreground/68">
            BANNER {slot}
          </p>
          <p className="mt-1 text-sm text-muted-foreground/74">
            Upload gambar baru untuk slot banner {slot}.
          </p>
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-[1rem] border border-primary/24 bg-primary/10 px-4 font-display text-sm tracking-[0.14em] text-primary transition hover:bg-primary/14"
        >
          <Upload className="size-4" />
          Upload
        </button>
      </div>

      <input
        ref={inputRef}
        name={`banner${slot}File`}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="sr-only"
        onChange={(event) => onSelectFile(slot, event.target.files?.[0] ?? null)}
      />

      <input
        type="hidden"
        name={`removeBanner${slot}`}
        value={value.removeStored ? "true" : "false"}
      />

      <div className="mt-4 rounded-[1rem] border border-border/30 bg-card/65 px-4 py-3 text-sm text-muted-foreground/74">
        {value.file ? (
          <p>File baru siap diupload: {value.file.name}</p>
        ) : value.storedUrl && !value.removeStored ? (
          <p>Banner aktif sudah ada. Preview ada di panel Live Preview.</p>
        ) : (
          <p>Belum ada banner. Upload gambar untuk slot ini.</p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {value.file ? (
          <button
            type="button"
            onClick={() => onClearNewFile(slot)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-[1rem] border border-border/40 bg-background/55 px-4 text-sm text-foreground transition hover:bg-background/75"
          >
            <X className="size-4" />
            Batal File Baru
          </button>
        ) : null}
        {!value.file && value.storedUrl && !value.removeStored ? (
          <button
            type="button"
            onClick={() => onRemoveStored(slot)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-[1rem] border border-destructive/24 bg-destructive/10 px-4 text-sm text-destructive transition hover:bg-destructive/14"
          >
            <X className="size-4" />
            Hapus Banner
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default function BannerSettingsForm({
  settings,
}: BannerSettingsFormProps) {
  const banner1InputRef = useRef<HTMLInputElement>(null);
  const banner2InputRef = useRef<HTMLInputElement>(null);
  const banner3InputRef = useRef<HTMLInputElement>(null);
  const [state, formAction] = useActionState(
    saveBannerSettingsAction,
    initialActionResult,
  );
  const [bannerSlots, setBannerSlots] = useState<Record<1 | 2 | 3, BannerSlotValue>>({
    1: {
      file: null,
      storedUrl: settings.banner1Url,
      previewUrl: settings.banner1Url,
      removeStored: false,
    },
    2: {
      file: null,
      storedUrl: settings.banner2Url,
      previewUrl: settings.banner2Url,
      removeStored: false,
    },
    3: {
      file: null,
      storedUrl: settings.banner3Url,
      previewUrl: settings.banner3Url,
      removeStored: false,
    },
  });

  useActionToast(state);

  useEffect(() => {
    setBannerSlots({
      1: {
        file: null,
        storedUrl: settings.banner1Url,
        previewUrl: settings.banner1Url,
        removeStored: false,
      },
      2: {
        file: null,
        storedUrl: settings.banner2Url,
        previewUrl: settings.banner2Url,
        removeStored: false,
      },
      3: {
        file: null,
        storedUrl: settings.banner3Url,
        previewUrl: settings.banner3Url,
        removeStored: false,
      },
    });
    syncFileInputFile(banner1InputRef, null);
    syncFileInputFile(banner2InputRef, null);
    syncFileInputFile(banner3InputRef, null);
  }, [settings.banner1Url, settings.banner2Url, settings.banner3Url]);

  useEffect(() => {
    const cleanupUrls = Object.values(bannerSlots)
      .map((slot) => slot.previewUrl)
      .filter((previewUrl) => previewUrl.startsWith("blob:"));

    return () => {
      cleanupUrls.forEach((previewUrl) => {
        URL.revokeObjectURL(previewUrl);
      });
    };
  }, [bannerSlots]);

  function updateSlot(
    slot: 1 | 2 | 3,
    nextValue: BannerSlotValue,
  ) {
    setBannerSlots((current) => {
      const previousPreviewUrl = current[slot].previewUrl;

      if (
        previousPreviewUrl.startsWith("blob:") &&
        previousPreviewUrl !== nextValue.previewUrl
      ) {
        URL.revokeObjectURL(previousPreviewUrl);
      }

      return {
        ...current,
        [slot]: nextValue,
      };
    });
  }

  function getInputRef(slot: 1 | 2 | 3) {
    if (slot === 1) {
      return banner1InputRef;
    }

    if (slot === 2) {
      return banner2InputRef;
    }

    return banner3InputRef;
  }

  function handleSelectFile(slot: 1 | 2 | 3, file: File | null) {
    const currentSlot = bannerSlots[slot];
    const inputRef = getInputRef(slot);

    if (!file) {
      syncFileInputFile(inputRef, null);
      updateSlot(slot, {
        ...currentSlot,
        file: null,
        previewUrl: currentSlot.removeStored ? "" : currentSlot.storedUrl,
      });
      return;
    }

    syncFileInputFile(inputRef, file);
    updateSlot(slot, {
      file,
      storedUrl: currentSlot.storedUrl,
      previewUrl: URL.createObjectURL(file),
      removeStored: false,
    });
  }

  function handleClearNewFile(slot: 1 | 2 | 3) {
    const currentSlot = bannerSlots[slot];
    const inputRef = getInputRef(slot);
    syncFileInputFile(inputRef, null);
    updateSlot(slot, {
      ...currentSlot,
      file: null,
      previewUrl: currentSlot.removeStored ? "" : currentSlot.storedUrl,
    });
  }

  function handleRemoveStored(slot: 1 | 2 | 3) {
    const currentSlot = bannerSlots[slot];
    updateSlot(slot, {
      ...currentSlot,
      file: null,
      previewUrl: "",
      removeStored: true,
    });
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[1.8rem] border border-border/35 bg-[linear-gradient(180deg,hsl(var(--card)/0.88),hsl(var(--background)/0.92))] p-6 sm:p-7">
        <p className="font-display text-[11px] tracking-[0.36em] text-primary/62">
          STOREFRONT BANNER
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-[0.08em] text-foreground">
          Banner Management
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground/76 sm:text-base">
          Atur sampai 3 banner utama untuk hero storefront. Urutan input akan dipakai
          sebagai slide 1, slide 2, dan slide 3 di homepage.
        </p>
      </section>

      <form
        action={formAction}
        className="rounded-[1.8rem] border border-border/35 bg-card/72 p-6 backdrop-blur-sm sm:p-7"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-[11px] tracking-[0.34em] text-primary/62">
              BANNER IMAGES
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground/74">
              Upload gambar seperti flow catalog. Sistem akan auto convert ke WebP
              lalu simpan ke Supabase Storage.
            </p>
          </div>
          <SubmitButton disabled={!settings.schemaReady} />
        </div>

        {!settings.schemaReady ? (
          <div className="mt-6 rounded-[1rem] border border-amber-500/25 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            Kolom banner di table <code className="rounded bg-background/40 px-1.5 py-0.5 text-xs">store_settings</code> belum ada di Supabase.
            Jalankan SQL migration <code className="mx-1 rounded bg-background/40 px-1.5 py-0.5 text-xs">supabase/migrations/20260420_add_store_settings_banner_columns.sql</code> dulu, lalu refresh halaman ini.
          </div>
        ) : null}

        <div className="mt-6 grid gap-4">
          <BannerUploadCard
            slot={1}
            value={bannerSlots[1]}
            inputRef={banner1InputRef}
            onSelectFile={handleSelectFile}
            onClearNewFile={handleClearNewFile}
            onRemoveStored={handleRemoveStored}
          />
          <BannerUploadCard
            slot={2}
            value={bannerSlots[2]}
            inputRef={banner2InputRef}
            onSelectFile={handleSelectFile}
            onClearNewFile={handleClearNewFile}
            onRemoveStored={handleRemoveStored}
          />
          <BannerUploadCard
            slot={3}
            value={bannerSlots[3]}
            inputRef={banner3InputRef}
            onSelectFile={handleSelectFile}
            onClearNewFile={handleClearNewFile}
            onRemoveStored={handleRemoveStored}
          />
        </div>

        {state.status === "error" && state.message ? (
          <div className="mt-5 rounded-[1rem] border border-destructive/28 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {state.message}
          </div>
        ) : null}
      </form>

      <section className="rounded-[1.8rem] border border-border/35 bg-card/72 p-6 backdrop-blur-sm sm:p-7">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-[1rem] border border-primary/18 bg-primary/8 text-primary">
            <ImagePlus className="size-5" />
          </div>
          <div>
            <p className="font-display text-[11px] tracking-[0.34em] text-primary/62">
              LIVE PREVIEW
            </p>
            <p className="mt-1 text-sm text-muted-foreground/74">
              Preview ikut berubah saat kamu pilih file baru, jadi hasil upload bisa dicek sebelum disimpan.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-3">
          <BannerPreview label="Banner 1" value={bannerSlots[1].previewUrl} />
          <BannerPreview label="Banner 2" value={bannerSlots[2].previewUrl} />
          <BannerPreview label="Banner 3" value={bannerSlots[3].previewUrl} />
        </div>
      </section>
    </div>
  );
}
