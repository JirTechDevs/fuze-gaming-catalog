import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import { getSheetSyncSecret } from "@/lib/supabase/env";

/**
 * Google Sheet -> catalog_items sync.
 *
 * Trigger: an Apps Script installed inside the "Financial Report (New
 * Version) - Fuzevalo" workbook fires on every status-column edit in a
 * monthly tab and POSTs the row's { code, status } payload here.
 *
 * Auth: shared secret in the `x-sheet-secret` header. The secret lives
 * in SHEET_SYNC_SECRET env var and is embedded in the Apps Script.
 *
 * Mapping: only "READY" keeps the item visible on the storefront.
 * Every other status (SOLD, HACKBACK, WA, DC, FB, blank, ...) flips
 * catalog_items.status to "sold" so it disappears from public listings.
 */

const READY_SHEET_STATUS = "READY";

type SheetSyncPayload = {
  code: unknown;
  status: unknown;
  sheet?: unknown;
};

function normalizeCode(raw: unknown) {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim().toUpperCase();
  return trimmed || null;
}

function normalizeSheetStatus(raw: unknown) {
  if (typeof raw !== "string") return "";
  return raw.trim().toUpperCase();
}

function toDbStatus(sheetStatus: string) {
  return sheetStatus === READY_SHEET_STATUS ? "available" : "sold";
}

export async function POST(request: NextRequest) {
  const providedSecret = request.headers.get("x-sheet-secret");

  let expectedSecret: string;
  try {
    expectedSecret = getSheetSyncSecret();
  } catch {
    return NextResponse.json(
      { error: "Sheet sync is not configured on the server." },
      { status: 500 },
    );
  }

  if (!providedSecret || providedSecret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: SheetSyncPayload;
  try {
    payload = (await request.json()) as SheetSyncPayload;
  } catch {
    return NextResponse.json(
      { error: "Body must be valid JSON." },
      { status: 400 },
    );
  }

  const code = normalizeCode(payload.code);
  if (!code) {
    return NextResponse.json(
      { error: "Missing or invalid `code` in payload." },
      { status: 400 },
    );
  }

  const sheetStatus = normalizeSheetStatus(payload.status);
  const nextDbStatus = toDbStatus(sheetStatus);

  const supabase = createServiceRoleClient();

  const { data: existing, error: lookupError } = await supabase
    .from("catalog_items")
    .select("id, status")
    .eq("code", code)
    .maybeSingle();

  if (lookupError) {
    return NextResponse.json(
      { error: `Lookup failed: ${lookupError.message}` },
      { status: 500 },
    );
  }

  if (!existing) {
    return NextResponse.json(
      {
        ok: false,
        skipped: true,
        reason: "code_not_found",
        code,
      },
      { status: 404 },
    );
  }

  if (existing.status === nextDbStatus) {
    return NextResponse.json({
      ok: true,
      changed: false,
      code,
      status: nextDbStatus,
    });
  }

  const { error: updateError } = await supabase
    .from("catalog_items")
    .update({ status: nextDbStatus })
    .eq("id", existing.id);

  if (updateError) {
    return NextResponse.json(
      { error: `Update failed: ${updateError.message}` },
      { status: 500 },
    );
  }

  revalidatePath("/");
  revalidatePath(`/jual-beli-akun/${code}`);
  revalidateTag("catalog-products");
  revalidateTag(`catalog-product-${existing.id}`);
  revalidateTag(`catalog-product-code-${code}`);

  return NextResponse.json({
    ok: true,
    changed: true,
    code,
    status: nextDbStatus,
    sheetStatus,
  });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: "sheet-sync",
    message: "POST { code, status } with x-sheet-secret header",
  });
}
