-- Add session_id for unique-visitor deduplication.
-- One row per (session_id, calendar day) via unique index + ON CONFLICT DO NOTHING.

alter table public.storefront_views
  add column if not exists session_id text;

-- Unique per session per day — so returning visitors within a day only count once.
create unique index if not exists storefront_views_session_day_idx
  on public.storefront_views (session_id, (viewed_at::date))
  where session_id is not null;
