# Google Sheet → Storefront Sync

Automatic sync from the "Financial Report (New Version) - Fuzevalo"
workbook to the storefront. When the STATUS column changes on any
monthly tab, the corresponding `catalog_items` row is updated and the
storefront cache is revalidated within seconds.

## Behavior

- Only monthly tabs are watched (`Januari 26`, `Februari 26`, ...,
  `Juli 2026`, and any future month tab). Other tabs (`Master_Status`,
  `DATA STOK`, `looker_output`) are ignored.
- Column **C** on each monthly tab must contain the STATUS.
- Column **D** on each monthly tab must contain the Code (FZ####).
- Mapping:
  - `READY` → storefront status `available` (visible in catalog)
  - Any other value (`SOLD`, `HACKBACK`, `WA`, `DC`, `FB`, blank, ...)
    → storefront status `sold` (hidden from catalog)
- Soft-delete only — the row stays in Supabase, admin panel still shows
  it. A future edit that puts the sheet back to `READY` will re-expose
  the row on the storefront.

## Server-side setup (Vercel)

1. Generate a strong random secret (32+ chars). Example on macOS:

   ```bash
   openssl rand -base64 48
   ```

2. Add these environment variables in the Vercel project:

   - `SUPABASE_SERVICE_ROLE_KEY` — the Supabase project's service_role
     key (Supabase dashboard → Project Settings → API).
   - `SHEET_SYNC_SECRET` — the random string from step 1.

   Both **Preview** and **Production** environments should get the
   values. Redeploy after adding them.

3. Verify the endpoint is reachable:

   ```bash
   curl https://fuzevalo.com/api/sheet-sync
   ```

   Should return `{ "ok": true, "endpoint": "sheet-sync", ... }`.

4. Verify auth. This should return 401:

   ```bash
   curl -X POST https://fuzevalo.com/api/sheet-sync \
     -H 'content-type: application/json' \
     -d '{"code":"FZ0000","status":"SOLD"}'
   ```

## Apps Script setup (Google Sheet)

1. Open the workbook → **Extensions → Apps Script**.
2. Delete the default `myFunction` stub.
3. Paste the entire contents of `sheet-sync-apps-script.gs` into
   `Code.gs`.
4. Save (Ctrl/Cmd+S) with any project name (e.g. "Fuzevalo Sheet Sync").
5. In the Apps Script sidebar go to **Project Settings** (gear icon) →
   **Script properties** → **Add script property**:
   - Property: `SHEET_SYNC_SECRET`
   - Value: the same string set in Vercel above.
6. Go to **Triggers** (clock icon) → **Add Trigger**:
   - Function to run: `onFuzeSheetEdit`
   - Deployment: `Head`
   - Event source: `From spreadsheet`
   - Event type: `On edit`
   - Failure notification: `Immediately` (so we see errors)
7. Authorize when Google prompts — the script needs `Spreadsheet` read
   and `External requests` (URL Fetch) scopes.

## Testing

1. Open any monthly tab.
2. Find a row that currently shows as READY on the storefront.
3. Change its status to `SOLD` in column C.
4. Within ~5 seconds, refresh the storefront — the row should be gone
   from the catalog.
5. Change it back to `READY`. Refresh — the row reappears.

## Debugging when a sync doesn't happen

1. In Apps Script → **Executions** — look for `onFuzeSheetEdit` runs.
   Failed runs show a stack trace.
2. In Vercel → **Logs** for `api/sheet-sync` — you'll see the incoming
   POST, whether the code was found, and any Supabase error.
3. Common causes:
   - Secret mismatch between Vercel and script properties (401).
   - Sheet tab name doesn't match the monthly regex (script exits
     silently, add the tab to `MONTHLY_TAB_REGEX`).
   - Code column has trailing whitespace or a typo — the row is
     skipped with `reason: code_not_found`.
   - Row's code isn't in the Supabase `catalog_items` table yet.

## Backfill / recovery

If the trigger was off for a while and you want to force-sync one tab:

1. Open Apps Script → open `Code.gs`.
2. In the toolbar function dropdown pick `backfillActiveSheet`.
3. Open the sheet tab you want to re-sync in Google Sheets.
4. In Apps Script click **Run**. The script iterates every row and
   POSTs each one to the webhook.

## Cost of a bad edit

Since sync is soft-delete only, a wrong status edit is fully reversible
— flip the sheet cell back and everything comes back on the storefront.
Nothing is deleted, no images are touched.

## Removing / disabling

- Temporarily disable: Apps Script → Triggers → toggle
  `onFuzeSheetEdit` trigger off.
- Fully remove: delete the trigger, then optionally delete the Apps
  Script project. The webhook endpoint stays live (harmless if nothing
  calls it).
