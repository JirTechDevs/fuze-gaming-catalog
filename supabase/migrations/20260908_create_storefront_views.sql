-- storefront_views: lightweight page-view log for admin analytics.
-- Service-role client writes; RLS blocks public access entirely.

create table if not exists public.storefront_views (
  id         uuid        primary key default gen_random_uuid(),
  path       text        not null,
  viewed_at  timestamptz not null default now()
);

create index if not exists storefront_views_viewed_at_idx
  on public.storefront_views (viewed_at desc);

alter table public.storefront_views enable row level security;
-- No public policies — only the service-role client (bypasses RLS) can read/write.
