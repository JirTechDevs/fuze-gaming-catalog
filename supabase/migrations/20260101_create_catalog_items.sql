-- catalog_items: storefront + admin catalog rows.
-- One row per Valorant account listing. Soft-deleted via `status = 'sold'`.

create extension if not exists "pgcrypto";

create table if not exists public.catalog_items (
  id                  uuid primary key default gen_random_uuid(),
  code                text not null unique,
  main_image_path     text,
  gallery_image_paths text[] default '{}'::text[],
  rank                text not null,
  price               numeric(12, 2) not null default 0,
  skins               text[] default '{}'::text[],
  region              text default 'IDN',
  change_nick_status  text default 'Not Ready'
                        check (change_nick_status in ('Ready', 'Not Ready')),
  agent_unlock        text,
  sisa_vp             text default '-',
  premier             text default 'Can be changed'
                        check (premier in ('Can be changed', 'Cannot be changed')),
  status              text not null default 'available'
                        check (status in ('available', 'sold')),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- Storefront query pattern: filter status, order by created_at desc.
create index if not exists catalog_items_status_created_idx
  on public.catalog_items (status, created_at desc);

-- Lookup by sheet-sync webhook + admin edit.
create index if not exists catalog_items_code_idx
  on public.catalog_items (code);

-- Shared updated_at trigger — reused by store_settings too.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists catalog_items_set_updated_at on public.catalog_items;
create trigger catalog_items_set_updated_at
  before update on public.catalog_items
  for each row
  execute function public.set_updated_at();
