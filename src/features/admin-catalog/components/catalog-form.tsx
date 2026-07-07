"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import {
  ChevronLeft,
  ImagePlus,
  Save,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { saveCatalogAction } from "@/features/admin-catalog/actions";
import { valorantRanks } from "@/features/catalog/domain/valorant-ranks";
import type {
  CatalogFormState,
  CatalogRecord,
} from "@/features/admin-catalog/types";
import { useActionToast } from "@/hooks/use-action-toast";
import { initialActionResult } from "@/lib/action-result";

interface CatalogFormProps {
  mode: "create" | "edit";
  record?: CatalogRecord;
}

const MAX_GALLERY_IMAGES = 5;
const premierOptions = [
  "Can be changed",
  "Cannot be changed",
] as const;

const initialState: CatalogFormState = initialActionResult;

const rupiahFormatter = new Intl.NumberFormat("id-ID");

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

function HiddenFileInput(
  props: React.InputHTMLAttributes<HTMLInputElement> & {
    inputRef: React.RefObject<HTMLInputElement | null>;
  },
) {
  const { inputRef, ...rest } = props;

  return (
    <input
      {...rest}
      ref={inputRef}
      className="sr-only"
      type="file"
    />
  );
}

function FileTriggerButton({
  icon: Icon,
  children,
  onClick,
  disabled = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-11 items-center justify-center gap-2 rounded-[1rem] border border-primary/24 bg-primary/10 px-4 font-display text-sm tracking-[0.14em] text-primary transition hover:bg-primary/14 disabled:cursor-not-allowed disabled:opacity-55"
    >
      <Icon className="size-4" />
      {children}
    </button>
  );
}

function DropZone({
  onFiles,
  disabled = false,
  className = "",
  children,
}: {
  onFiles: (files: File[]) => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (disabled) return;
    if (!isDragOver) setIsDragOver(true);
  }

  function handleDragLeave(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (event.currentTarget.contains(event.relatedTarget as Node)) return;
    setIsDragOver(false);
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragOver(false);
    if (disabled) return;
    const files = Array.from(event.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/"),
    );
    if (files.length) onFiles(files);
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragEnter={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`transition ${
        isDragOver
          ? "border-primary/60 bg-primary/[0.06] ring-2 ring-primary/25"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

function PreviewCard({
  imagePath,
  title,
  onRemove,
  removable = true,
}: {
  imagePath: string;
  title: string;
  onRemove?: () => void;
  removable?: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-[1.2rem] border border-border/35 bg-card/68">
      <div className="relative aspect-[4/5] overflow-hidden bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.22),_transparent_58%),linear-gradient(180deg,_hsl(var(--secondary)/0.9),_hsl(var(--card)))]">
        <img
          src={imagePath}
          alt={title}
          className="h-full w-full object-contain p-3"
        />
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-border/35 px-3 py-3">
        <p className="truncate text-xs text-muted-foreground/72">{title}</p>
        {removable && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-border/35 bg-background/55 text-muted-foreground transition hover:border-destructive/35 hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function syncFileInputFiles(
  inputRef: React.RefObject<HTMLInputElement | null>,
  files: File[],
) {
  if (!inputRef.current) {
    return;
  }

  const dataTransfer = new DataTransfer();

  files.forEach((file) => {
    dataTransfer.items.add(file);
  });

  inputRef.current.files = dataTransfer.files;
}

function toPriceDigits(value: string | number | undefined) {
  return String(value ?? "")
    .replace(/\D/g, "")
    .replace(/^0+(?=\d)/, "");
}

function formatRupiahValue(value: string) {
  if (!value) {
    return "";
  }

  return `Rp ${rupiahFormatter.format(Number(value))}`;
}

function getCodeNumberValue(code: string | undefined) {
  if (!code) {
    return "";
  }

  return code.replace(/^FZ/i, "");
}

function normalizePremierValue(value: string | undefined) {
  const normalized = (value ?? "").trim().toLowerCase();

  if (
    normalized === "cannot be changed" ||
    normalized === "can't be changed" ||
    normalized === "cant be changed"
  ) {
    return "Cannot be changed";
  }

  return "Can be changed";
}

export default function CatalogForm({ mode, record }: CatalogFormProps) {
  const formAction = saveCatalogAction.bind(null, record?.id ?? null);
  const [state, action] = useActionState(formAction, initialState);
  useActionToast(state);
  const mainInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [clientError, setClientError] = useState<string | null>(null);
  const [mainExistingPath] = useState(record?.mainImagePath ?? "");
  const [mainFile, setMainFile] = useState<File | null>(null);
  const [mainPreviewPath, setMainPreviewPath] = useState(record?.mainImagePath ?? "");
  const [existingGalleryPaths, setExistingGalleryPaths] = useState(
    record?.galleryImagePaths ?? [],
  );
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviewPaths, setGalleryPreviewPaths] = useState<string[]>([]);
  const [priceValue, setPriceValue] = useState(() => toPriceDigits(record?.price ?? 0));
  const [premierValue, setPremierValue] = useState(() =>
    normalizePremierValue(record?.premier),
  );
  const totalGalleryCount = existingGalleryPaths.length + galleryFiles.length;
  const gallerySlotsLeft = MAX_GALLERY_IMAGES - totalGalleryCount;

  useEffect(() => {
    if (!mainFile) {
      setMainPreviewPath(record?.mainImagePath ?? "");
      return;
    }

    const objectUrl = URL.createObjectURL(mainFile);
    setMainPreviewPath(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [mainFile, record?.mainImagePath]);

  useEffect(() => {
    if (!galleryFiles.length) {
      setGalleryPreviewPaths([]);
      return;
    }

    const objectUrls = galleryFiles.map((file) => URL.createObjectURL(file));
    setGalleryPreviewPaths(objectUrls);

    return () => {
      objectUrls.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [galleryFiles]);

  function handleOpenMainPicker() {
    mainInputRef.current?.click();
  }

  function handleOpenGalleryPicker() {
    galleryInputRef.current?.click();
  }

  function handleMainFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;
    setClientError(null);
    setMainFile(file);
  }

  function addFilesToGallery(incomingFiles: File[]) {
    if (!incomingFiles.length) {
      return;
    }

    setClientError(null);
    const mergedFiles = [...galleryFiles, ...incomingFiles].slice(
      0,
      MAX_GALLERY_IMAGES - existingGalleryPaths.length,
    );

    setGalleryFiles(mergedFiles);
    syncFileInputFiles(galleryInputRef, mergedFiles);
  }

  function handleGalleryFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    addFilesToGallery(Array.from(event.target.files ?? []));
  }

  function handleMainDrop(files: File[]) {
    const first = files[0];
    if (!first) return;
    setClientError(null);
    setMainFile(first);
    if (mainInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(first);
      mainInputRef.current.files = dataTransfer.files;
    }
  }

  function handleClearMainFile() {
    if (mainInputRef.current) {
      mainInputRef.current.value = "";
    }

    setClientError(null);
    setMainFile(null);
  }

  function handleRemoveExistingGallery(index: number) {
    setClientError(null);
    setExistingGalleryPaths((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  function handleRemoveGalleryFile(index: number) {
    const nextFiles = galleryFiles.filter((_, itemIndex) => itemIndex !== index);
    setClientError(null);
    setGalleryFiles(nextFiles);
    syncFileInputFiles(galleryInputRef, nextFiles);
  }

  function handlePriceChange(event: React.ChangeEvent<HTMLInputElement>) {
    setClientError(null);
    setPriceValue(toPriceDigits(event.target.value));
  }

  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    setClientError(null);

    if (!event.currentTarget.reportValidity()) {
      event.preventDefault();
      setClientError("Lengkapi semua field wajib dulu sebelum menyimpan catalog.");
      return;
    }

    if (!mainFile && !mainExistingPath) {
      event.preventDefault();
      setClientError("Foto Utama (Thumbnail) wajib diisi sebelum menyimpan catalog.");
    }
  }

  return (
    <div className="space-y-6">
      <form
        action={action}
        onSubmit={handleFormSubmit}
        className="rounded-[1.8rem] border border-border/35 bg-[linear-gradient(180deg,hsl(var(--card)/0.88),hsl(var(--background)/0.92))] p-5 sm:p-7"
      >
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-[11px] tracking-[0.36em] text-primary/64">
              {mode === "create" ? "NEW CATALOG" : "EDIT CATALOG"}
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-[0.08em] text-foreground sm:text-3xl">
              {mode === "create" ? "Tambah Catalog" : `Edit ${record?.code ?? "Catalog"}`}
            </h2>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/dashboard/catalog"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-[1rem] border border-border/45 bg-card/72 px-4 text-sm text-foreground transition hover:bg-card/95"
            >
              <ChevronLeft className="size-4" />
              Kembali ke Catalog
            </Link>
            <Link
              href="/dashboard/catalog"
              className="inline-flex h-11 items-center justify-center rounded-[1rem] border border-border/45 bg-background/55 px-5 text-sm text-foreground transition hover:bg-background/75"
            >
              Batal
            </Link>
            <SubmitButton mode={mode} />
          </div>
        </div>

        <HiddenFileInput
          inputRef={mainInputRef}
          name="mainImageFile"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleMainFileChange}
        />
        <HiddenFileInput
          inputRef={galleryInputRef}
          name="galleryImageFiles"
          accept="image/png,image/jpeg,image/webp"
          multiple
          onChange={handleGalleryFileChange}
        />
        {!mainFile && mainExistingPath && (
          <input type="hidden" name="mainImageExistingPath" value={mainExistingPath} />
        )}
        {existingGalleryPaths.map((imagePath) => (
          <input
            key={imagePath}
            type="hidden"
            name="existingGalleryImagePaths"
            value={imagePath}
          />
        ))}

        <div className="mx-auto grid max-w-2xl gap-3 md:grid-cols-2">
          <div className="md:col-span-2">
            <FieldLabel>KODE AKUN</FieldLabel>
            <div className="flex max-w-xs items-center overflow-hidden rounded-[1rem] border border-border/45 bg-background/55 focus-within:border-primary/45 focus-within:ring-2 focus-within:ring-primary/15">
              <span className="inline-flex h-11 items-center border-r border-border/35 px-4 font-display text-sm tracking-[0.16em] text-primary">
                FZ
              </span>
              <input
                name="code"
                required
                inputMode="numeric"
                defaultValue={getCodeNumberValue(record?.code)}
                placeholder="3067"
                onChange={() => setClientError(null)}
                className="h-11 w-full bg-transparent px-4 text-sm text-foreground outline-none"
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <FieldLabel>DAFTAR SKIN</FieldLabel>
            <TextArea
              name="skins"
              rows={5}
              required
              defaultValue={record?.skins.join("\n")}
              placeholder={"Reaver Vandal\nPrime Phantom\nIon Sheriff"}
              onChange={() => setClientError(null)}
            />
            <p className="mt-1.5 text-xs text-muted-foreground/62">
              Satu skin per baris.
            </p>
          </div>

          <div>
            <FieldLabel>RANK</FieldLabel>
            <Select
              name="rank"
              required
              defaultValue={record?.rank ?? "Gold 1"}
              onChange={() => setClientError(null)}
            >
              {valorantRanks.map((rank) => (
                <option key={rank} value={rank}>
                  {rank}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <FieldLabel>REGION</FieldLabel>
            <TextInput
              name="region"
              required
              defaultValue={record?.region ?? "IDN"}
              placeholder="IDN"
              onChange={() => setClientError(null)}
            />
          </div>

          <div>
            <FieldLabel>PREMIER</FieldLabel>
            <Select
              name="premier"
              value={premierValue}
              onChange={(event) => {
                setClientError(null);
                setPremierValue(event.target.value);
              }}
            >
              {premierOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <FieldLabel>AGENT UNLOCK</FieldLabel>
            <TextInput
              name="agentUnlock"
              required
              defaultValue={record?.agentUnlock ?? "Full Unlock"}
              placeholder="Full Unlock"
              onChange={() => setClientError(null)}
            />
          </div>

          <div>
            <FieldLabel>CHANGE NICK</FieldLabel>
            <Select
              name="changeNickStatus"
              defaultValue={record?.changeNickStatus ?? "Ready"}
              onChange={() => setClientError(null)}
            >
              <option value="Ready">Ready</option>
              <option value="Not Ready">Not Ready</option>
            </Select>
          </div>

          <div>
            <FieldLabel>HARGA</FieldLabel>
            <input type="hidden" name="price" value={priceValue || "0"} />
            <TextInput
              inputMode="numeric"
              required
              value={formatRupiahValue(priceValue)}
              onChange={handlePriceChange}
              placeholder="Rp 650.000"
            />
            <p className="mt-1.5 text-xs text-muted-foreground/62">
              Diformat otomatis ke rupiah.
            </p>
          </div>

          <div>
            <FieldLabel>SISA VP</FieldLabel>
            <TextInput
              name="sisaVp"
              required
              defaultValue={record?.sisaVp ?? "-"}
              placeholder="-"
              onChange={() => setClientError(null)}
            />
          </div>

          <div>
            <FieldLabel>STATUS JUAL</FieldLabel>
            <Select name="status" defaultValue={record?.status ?? "available"}>
              <option value="available">available</option>
              <option value="sold">sold</option>
            </Select>
          </div>

          <div>
            <FieldLabel>FOTO UTAMA (THUMBNAIL)</FieldLabel>
            <DropZone
              onFiles={handleMainDrop}
              className="flex h-full flex-col rounded-[1.3rem] border border-border/35 bg-background/30 p-4"
            >
              <div className="flex flex-col gap-2">
                <p className="text-sm text-foreground">
                  Drag &amp; drop atau klik untuk pilih gambar utama.
                </p>
                <div className="flex flex-wrap gap-2">
                  <FileTriggerButton icon={Upload} onClick={handleOpenMainPicker}>
                    Upload Thumbnail
                  </FileTriggerButton>
                  {mainFile && (
                    <button
                      type="button"
                      onClick={handleClearMainFile}
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-[1rem] border border-border/40 bg-background/55 px-4 text-sm text-foreground transition hover:bg-background/75"
                    >
                      <X className="size-4" />
                      Batal
                    </button>
                  )}
                </div>
              </div>

              {mainPreviewPath ? (
                <div className="mt-3 max-w-[180px]">
                  <PreviewCard
                    imagePath={mainPreviewPath}
                    title={mainFile ? mainFile.name : "Thumbnail saat ini"}
                    removable={false}
                  />
                </div>
              ) : (
                <div className="mt-3 flex aspect-[4/5] max-w-[180px] items-center justify-center rounded-[1.2rem] border border-dashed border-border/40 bg-background/35 text-center text-xs text-muted-foreground/62">
                  Drop gambar di sini
                </div>
              )}
            </DropZone>
          </div>

          <div>
            <FieldLabel>FOTO TAMBAHAN</FieldLabel>
            <DropZone
              onFiles={addFilesToGallery}
              disabled={gallerySlotsLeft <= 0}
              className="flex h-full flex-col rounded-[1.3rem] border border-border/35 bg-background/30 p-4"
            >
              <div className="flex flex-col gap-2">
                <p className="text-sm text-foreground">
                  Drag &amp; drop sampai {MAX_GALLERY_IMAGES} gambar. ({totalGalleryCount}/{MAX_GALLERY_IMAGES})
                </p>
                <FileTriggerButton
                  icon={ImagePlus}
                  onClick={handleOpenGalleryPicker}
                  disabled={gallerySlotsLeft <= 0}
                >
                  Upload Foto Tambahan
                </FileTriggerButton>
              </div>

              {totalGalleryCount > 0 ? (
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {existingGalleryPaths.map((imagePath, index) => (
                    <PreviewCard
                      key={`${imagePath}-${index}`}
                      imagePath={imagePath}
                      title={`Tersimpan ${index + 1}`}
                      onRemove={() => handleRemoveExistingGallery(index)}
                    />
                  ))}

                  {galleryPreviewPaths.map((imagePath, index) => (
                    <PreviewCard
                      key={`${imagePath}-${index}`}
                      imagePath={imagePath}
                      title={galleryFiles[index]?.name ?? `Upload baru ${index + 1}`}
                      onRemove={() => handleRemoveGalleryFile(index)}
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-3 flex min-h-24 items-center justify-center rounded-[1.2rem] border border-dashed border-border/40 bg-background/35 text-center text-xs text-muted-foreground/62">
                  Drop gambar tambahan di sini
                </div>
              )}
            </DropZone>
          </div>
        </div>

        {(clientError || (state.status === "error" ? state.message : null)) && (
          <div className="mt-5 rounded-[1rem] border border-destructive/28 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {clientError || state.message}
          </div>
        )}
      </form>
    </div>
  );
}
