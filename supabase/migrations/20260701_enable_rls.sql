-- Enable Row Level Security for storefront + admin tables.
-- Reads are public (anon), writes require authenticated Supabase session.

alter table public.catalog_items enable row level security;
alter table public.store_settings enable row level security;

-- catalog_items: public read, authenticated write.
drop policy if exists "catalog_items_public_read" on public.catalog_items;
create policy "catalog_items_public_read"
  on public.catalog_items
  for select
  using (true);

drop policy if exists "catalog_items_authenticated_write" on public.catalog_items;
create policy "catalog_items_authenticated_write"
  on public.catalog_items
  for all
  to authenticated
  using (true)
  with check (true);

-- store_settings: public read, authenticated write.
drop policy if exists "store_settings_public_read" on public.store_settings;
create policy "store_settings_public_read"
  on public.store_settings
  for select
  using (true);

drop policy if exists "store_settings_authenticated_write" on public.store_settings;
create policy "store_settings_authenticated_write"
  on public.store_settings
  for all
  to authenticated
  using (true)
  with check (true);

-- Storage buckets used by the admin panel.
-- Adjust bucket_id values if your buckets are named differently.
drop policy if exists "catalog_images_public_read" on storage.objects;
create policy "catalog_images_public_read"
  on storage.objects
  for select
  using (bucket_id = 'catalog-images');

drop policy if exists "catalog_images_authenticated_write" on storage.objects;
create policy "catalog_images_authenticated_write"
  on storage.objects
  for all
  to authenticated
  using (bucket_id = 'catalog-images')
  with check (bucket_id = 'catalog-images');
