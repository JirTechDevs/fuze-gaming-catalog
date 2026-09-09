-- Add session_id for unique-visitor deduplication.
-- One row per (session_id, calendar day) via unique index + ON CONFLICT DO NOTHING.

alter table public.storefront_views
  add column if not exists session_id   text,
  add column if not exists visited_date date not null default current_date;

-- Unique per session per calendar day — returning visitors count once per day.
create unique index if not exists storefront_views_session_day_idx
  on public.storefront_views (session_id, visited_date)
  where session_id is not null;
