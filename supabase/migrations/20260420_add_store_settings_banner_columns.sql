alter table public.store_settings
  add column if not exists banner_1_url text,
  add column if not exists banner_2_url text,
  add column if not exists banner_3_url text;
