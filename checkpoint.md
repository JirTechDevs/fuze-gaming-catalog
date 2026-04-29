# Fuzevalo Project Checkpoint

Last updated: 2026-04-20

## Phase Status

| Phase | Name | Status | Notes |
| --- | --- | --- | --- |
| Phase 0 | Scope Lock | Completed | Planning approved. Route structure, admin layout direction, simple field set, and WebP upload direction are agreed. Sold-item behavior is carried forward using the current storefront assumption: sold items are not shown in the main available catalog flow. |
| Phase 1 | Supabase Foundation | Completed | Supabase project, auth basics, URL configuration, database tables, RLS policies, storage bucket, and storage policies are in place. Remaining housekeeping: rotate exposed secret key later and mirror env vars into Vercel during deployment setup. |
| Phase 2 | Auth And Dashboard Shell | Completed | Login, protected dashboard routes, Supabase session wiring, and the collapsible admin shell are implemented and verified with typecheck, lint, and production build. |
| Phase 3 | Catalog CRUD Without Upload Complexity First | Completed | Real Supabase-backed catalog list, create, edit, delete, search, and status toggle flows are implemented and verified. |
| Phase 4 | Image Upload And Auto WebP | Completed | Catalog image uploads, auto WebP conversion, storage cleanup, and admin previews are implemented and verified. |
| Phase 5 | Public Storefront Migration | Completed | Public homepage and detail pages now read live Supabase catalog data instead of mock/in-memory data. |
| Phase 6 | Polish And Settings | Not started | Pending MVP completion. |

## Phase 0 Cross-Check

Phase 0 is considered completed based on the agreed proposal.

### Agreed Items

- Admin routes:
  - `/login`
  - `/dashboard`
  - `/dashboard/catalog`
  - `/dashboard/catalog/new`
  - `/dashboard/catalog/[id]/edit`
- Admin layout direction:
  - left sidebar
  - same visual language as storefront
  - simple non-technical wording
- Sidebar menu:
  - Dashboard
  - Catalog
  - Settings
  - Logout
- Simple V1 admin fields:
  - Foto utama
  - Foto tambahan
  - Kode akun
  - Rank
  - Harga
  - Status jual
  - Region
  - Change Nick
  - Agent Unlock
  - Sisa VP
  - Premier / Emblem
  - Daftar skin
- Image direction:
  - admin can upload common image formats
  - system auto-converts images to WebP
- App direction:
  - Next.js fullstack
  - Supabase for auth, database, and storage
  - Vercel deployment

### Active Assumptions Carried Into Phase 1

- Sold items follow the current storefront behavior for now:
  - available items appear in the main public catalog
  - sold items remain managed in admin and can be handled later in public display polish if needed
- Skin input should use multiline entry:
  - one skin per line
- The first backend milestone is Supabase setup before app integration begins

## Phase 1 Completion Notes

Phase 1 is completed from the Supabase foundation side.

### Completed Work

- Supabase project created on Free tier
- auth configured for email login
- public signup disabled
- initial admin users created manually
- auth URL configuration set for:
  - `http://localhost:3000/**`
  - `https://fuzevalo.com/**`
  - `https://www.fuzevalo.com/**`
- `catalog_items` table created
- `store_settings` table created
- auto `updated_at` trigger function created
- RLS enabled on application tables
- public read and authenticated write policies created for MVP
- `catalog-images` storage bucket created
- storage restrictions set:
  - public bucket enabled
  - 5 MB file size limit
  - `image/webp` MIME type only
- storage policies created for public read and authenticated write/update/delete

### Follow-Up Housekeeping

- rotate the Supabase secret key because it was exposed during setup
- keep `.env` local only
- later mirror production env vars into Vercel

## Phase 2 Scope Lock

Phase 2 is locked for implementation with the following scope.

### Goal

- establish login flow and the protected dashboard shell inside the Next.js app

### In Scope

- install Supabase packages required by the app
- add Next.js Supabase helpers for:
  - browser/client usage
  - server usage
  - middleware/session handling if needed
- create `/login`
- create sign-in and sign-out flow
- protect `/dashboard`
- create dashboard app shell with left sidebar
- create dashboard landing page
- verify only authenticated users can access dashboard routes

### Expected Phase 2 Outputs

- working `/login` page
- authenticated session support in the app
- protected `/dashboard`
- left sidebar layout matching the agreed admin direction
- dashboard home page placeholder ready for catalog module integration

### Out Of Scope For Phase 2

- catalog list CRUD screens
- create/edit catalog form
- image upload UI
- storefront migration to live Supabase data
- dashboard analytics beyond a simple placeholder shell

### Phase 2 Implementation Assumptions

- login method remains email/password
- signup remains disabled
- current manual Supabase users are enough for first admin access
- admin authorization is still based on authenticated access for MVP
- stricter role-based authorization can be tightened in a later phase if needed

## Phase 2 Completion Notes

Phase 2 is completed in the app.

### Completed Work

- Supabase app packages installed:
  - `@supabase/supabase-js`
  - `@supabase/ssr`
- Supabase helper files added for:
  - browser client
  - server client
  - `proxy.ts` session refresh flow
- `/login` page created
- login form wired to Supabase email/password auth
- sign-out action added
- `/dashboard` route protected with server-side auth checks
- collapsible left sidebar dashboard shell added
- dashboard home page placeholder added
- placeholder pages added for:
  - `/dashboard/catalog`
  - `/dashboard/settings`
- auth guards hardened so logged-out access redirects cleanly to `/login`
- dashboard header updated so:
  - logout sits beside the authenticated badge
  - logout requires confirmation before ending the session
- tab icon now follows the storefront branding instead of the old generated icon

### Verification

- `bun run typecheck`
- `bun run lint`
- `bun run build`

### Notes Carried Into Phase 3

- both existing Supabase users can access the dashboard
- authorization is still authenticated-user based for MVP
- legacy `/admin` route still exists and can be cleaned or redirected later if desired

## Phase 3 Ready State

Phase 3 can now start from a stable admin foundation.

### Ready Inputs

- working login flow
- protected dashboard shell
- Supabase tables and storage already prepared
- `/dashboard/catalog` route already exists as a placeholder

### Phase 3 Primary Goal

- replace the placeholder catalog module with real list/create/edit/delete flows using the existing Supabase catalog table

## Phase 3 Completion Notes

Phase 3 is completed in the app.

### Completed Work

- `/dashboard/catalog` now reads real catalog data from Supabase
- search added for:
  - account code
  - rank
- catalog list now shows:
  - code
  - rank
  - price
  - status
  - region
- actions added on the catalog list:
  - edit
  - delete
  - toggle sold / available
- delete flow now uses confirmation popup
- create page added:
  - `/dashboard/catalog/new`
- edit page added:
  - `/dashboard/catalog/[id]/edit`
- shared catalog form added for create/edit
- form fields match the agreed Phase 3 defaults:
  - manual image path fields
  - multiline skin input
  - simple dropdowns where agreed
- catalog CRUD writes now go to the existing Supabase `catalog_items` table

### Verification

- `bun run typecheck`
- `bun run lint`
- `bun run build`

## Phase 4 Completion Notes

Phase 4 is completed in the app.

### Completed Work

- catalog form now uses upload buttons instead of manual path text inputs for:
  - `Foto Utama (Thumbnail)`
  - `Foto Tambahan`
- thumbnail upload supports exactly:
  - `1` image
- gallery upload supports:
  - up to `5` images
- simple preview cards added for:
  - existing saved images
  - newly selected uploads before save
- server-side image processing added with:
  - auto resize
  - auto WebP conversion
  - final size guard before upload
- Supabase Storage upload flow added for the `catalog-images` bucket
- generated filenames now follow the agreed code pattern:
  - `KODEIMG1.webp`
  - `KODEIMG2.webp`
  - and so on based on the saved image order for that catalog
- rank field now uses a fixed Valorant rank dropdown instead of manual typing
- harga field now auto-formats to rupiah while still saving numeric values to the database
- `Premier / Emblem` field has been removed from the admin form
- top form actions were polished so:
  - `Kembali ke Catalog`
  - `Batal`
  - `Create Catalog / Save Changes`
  sit together in the header area
- replacing or removing images now deletes old managed storage files
- deleting an entire catalog item now also cleans up managed storage images
- existing Phase 3 manual image paths remain compatible for older records

### Verification

- `bun run build`
- `bun run lint`
- `bun run typecheck`

### Notes Carried Into Phase 5

- new uploads now save as public Supabase Storage URLs
- older manually entered image paths can still coexist until storefront migration is completed

## Phase 5 Completion Notes

Phase 5 is completed in the app.

### Completed Work

- public storefront repository now reads from Supabase instead of the old in-memory mock repository
- homepage `/` now loads live catalog items from `catalog_items`
- homepage only shows:
  - `available` items
- homepage ordering now uses:
  - newest first
- detail page `/catalog/[id]` now loads live data by id from Supabase
- sold item detail pages remain accessible and keep the existing sold-state UI
- static mock-based catalog detail generation has been removed so admin updates no longer depend on rebuild-time ids
- missing main images now fall back safely to the existing catalog placeholder image
- existing uploaded Supabase public URLs and older manual image paths both remain compatible with the current storefront UI

### Verification

- `bun run build`
- `bun run lint`
- `bun run typecheck`

### Notes Carried Into Phase 6

- storefront and admin are now connected to the same live catalog source
- remaining MVP polish can focus on settings, cleanup, and user-facing refinement instead of data-source migration

## Update Rule

Whenever a phase is completed:

1. Update the phase status table.
2. Add a short note explaining what was completed.
3. Record any assumptions or scope changes before starting the next phase.
