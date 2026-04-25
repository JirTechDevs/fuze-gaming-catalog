# Fuzevalo Admin Panel MVP Plan

## Goal

Build a simple admin panel for managing the game account catalog with:

- Next.js fullstack app structure
- Supabase for database, auth, and storage
- Vercel for deployment
- simple non-technical admin UX
- automatic image conversion to WebP on upload

The working rule for this project is:

- discuss and approve first
- implement phase by phase after approval

## Current Project Status

The current app already has:

- public storefront at `/`
- product detail page at `/catalog/[id]`
- mock admin page at `/admin`
- product model and UI already wired to catalog fields

The current app does not have:

- real database persistence
- login/auth flow
- dashboard route
- Supabase integration
- real image upload pipeline

Catalog data is still powered by in-memory mock data, so the main backend work is replacing that fake repository with a real Supabase-backed repository.

## Target Admin Routes

- `/login`
- `/dashboard`
- `/dashboard/catalog`
- `/dashboard/catalog/new`
- `/dashboard/catalog/[id]/edit`

## Dashboard UX Direction

The admin panel should stay simple and familiar:

- same visual direction as the storefront
- left sidebar layout
- clean dashboard shell
- very simple form labels
- dropdowns where possible
- minimal technical wording

Suggested sidebar menu:

- Dashboard
- Catalog
- Settings
- Logout

## Simple Admin Fields

These are the recommended V1 fields for non-technical users.

### Gambar

- Foto utama
- Foto tambahan

### Informasi utama

- Kode akun
- Rank
- Harga
- Status jual

### Detail akun

- Region
- Change Nick
- Agent Unlock
- Sisa VP
- Premier / Emblem

### Daftar skin

- Skin list as multiline input
- one skin per line

## Why These Fields

These fields match the current storefront needs and avoid unnecessary complexity.

The public UI currently depends mostly on:

- account code
- main image
- optional gallery images
- rank
- price
- skins
- region
- change nick status
- agent unlock info
- sisa VP
- premier
- availability status

## User Stories

1. As an admin, I can log in from `/login`.
2. As an admin, I can access `/dashboard` after authentication.
3. As an admin, I can view a list of catalog items.
4. As an admin, I can add a new catalog item with a simple form.
5. As an admin, I can edit an existing catalog item.
6. As an admin, I can mark an item as sold or available.
7. As an admin, I can upload images without needing to convert them manually.
8. As a public visitor, I can see catalog data pulled from the real database.

## MVP Priority

### Must Have

- login page
- protected dashboard
- dashboard shell with left sidebar
- catalog list page
- add/edit catalog form
- create, update, delete catalog
- status toggle
- Supabase database
- Supabase auth
- Supabase storage
- automatic WebP conversion on upload
- storefront reads live catalog data from Supabase

### Nice To Have Later

- analytics cards
- featured tags
- testimonial management
- audit log
- multiple admin roles
- richer settings panel

## Delivery Phases

### Phase 0 - Scope Lock

Goal:

- finalize UX and data model before coding

Outputs:

- agreed route structure
- agreed admin sidebar menu
- agreed catalog fields
- agreed image rules
- agreed sold-item behavior

### Phase 1 - Supabase Foundation

Goal:

- prepare backend infrastructure first

Outputs:

- Supabase project created
- database tables created
- storage bucket created
- auth enabled
- RLS policies defined
- environment variables prepared for local and Vercel

### Phase 2 - Auth And Dashboard Shell

Goal:

- establish admin access and app shell

Outputs:

- `/login` page
- protected `/dashboard`
- server-side auth guard
- left sidebar layout
- dashboard home page

### Phase 3 - Catalog CRUD Without Upload Complexity First

Goal:

- make catalog management work end to end with text fields and existing image paths

Outputs:

- catalog list page
- create form
- edit form
- delete action
- sold/available toggle
- validation

### Phase 4 - Image Upload And Auto WebP

Goal:

- make image handling easy for admin users

Outputs:

- upload JPG, JPEG, PNG, or WebP
- convert uploads to `.webp` on the server
- upload final files to Supabase Storage
- save storage paths in the database

### Phase 5 - Public Storefront Migration

Goal:

- replace mock data with real Supabase data

Outputs:

- storefront home page reads from Supabase
- product detail page reads from Supabase
- revalidation after admin changes
- old in-memory repository retired

### Phase 6 - Polish And Settings

Goal:

- make the MVP safer and cleaner for production

Outputs:

- friendly empty states
- helper text for form fields
- better validation feedback
- settings for WhatsApp number
- migration/import of current mock data

## Proposed Tech Approach

### Frontend / App Layer

- keep Next.js app router
- keep existing feature structure
- use server components for read paths
- use server actions for create/update/delete where suitable
- keep the storefront UI mostly unchanged

### Backend / Data Layer

- replace in-memory repository with Supabase-backed repository
- centralize catalog data access in the existing application layer
- store catalog images in Supabase Storage
- use Supabase Auth for admin login

### Image Handling

- admin uploads common image formats
- server converts files to WebP automatically
- only final WebP files are stored
- save only the final path or public URL in the database

Recommended implementation detail:

- use `sharp` server-side for conversion

## Supabase Highlights

### 1. Database

Recommended main table:

- `catalog_items`

Suggested columns:

- `id uuid primary key`
- `code text unique`
- `main_image_path text`
- `gallery_image_paths text[]`
- `rank text`
- `price integer`
- `skins text[]`
- `region text`
- `change_nick_status text`
- `agent_unlock text`
- `sisa_vp text`
- `premier text`
- `status text`
- `created_at timestamptz`
- `updated_at timestamptz`

### 2. Auth

Recommended setup:

- Supabase email/password auth
- no public signup
- admin users created intentionally

Recommended supporting table:

- `profiles` or `admin_users`

Purpose:

- map auth users to admin role

### 3. Storage

Recommended bucket:

- `catalog-images`

Usage:

- main image uploads
- gallery image uploads
- final stored format should be WebP

### 4. RLS Policies

Need to define:

- public read access for storefront catalog data
- admin-only insert/update/delete access
- admin-only storage upload/delete access

### 5. Settings Storage

Recommended table:

- `store_settings`

Initial use:

- WhatsApp number

This is important because the current WhatsApp target is hardcoded and should be moved into settings or environment configuration.

### 6. Migration Workflow

Supabase supports migration-style SQL workflow.

Recommended approach:

- use Supabase CLI
- keep SQL migrations in the repo
- treat migrations as the source of truth

This is the closest equivalent to PHP/Laravel-style database migrations for this project.

### 7. Environment Variables

Expected env vars later:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Important:

- `SUPABASE_SERVICE_ROLE_KEY` must stay server-only
- never expose service role credentials to the browser

## Vercel Notes

Deployment target:

- Vercel for the Next.js app
- Supabase as external backend service

Setup notes:

- create Supabase project first
- add env vars locally
- add the same env vars to Vercel
- make sure any admin-only logic runs server-side

## Important Product Decisions To Confirm Before Coding

- login method: email/password only
- how many admin users will exist
- max upload size
- max gallery image count per item
- whether sold items are hidden or displayed on the storefront
- whether account code is auto-generated or manually entered

## Recommended Working Style

1. Discuss and lock each phase.
2. Approve before implementation.
3. Implement one phase at a time.
4. Pause after each phase for review.

## Suggested Immediate Next Step

Before writing code:

- create the Supabase account and project
- confirm the final admin field labels
- confirm sold-item behavior
- confirm image upload limits

After that, the first implementation target should be Phase 1: Supabase foundation.
