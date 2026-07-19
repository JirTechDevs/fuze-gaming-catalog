-- store_settings: singleton-ish config row for the storefront.
-- Admin banner form reads/writes the most recent row.

create table if not exists public.store_settings (
  id           bigserial primary key,
  banner_1_url text,
  banner_2_url text,
  banner_3_url text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

drop trigger if exists store_settings_set_updated_at on public.store_settings;
create trigger store_settings_set_updated_at
  before update on public.store_settings
  for each row
  execute function public.set_updated_at();
