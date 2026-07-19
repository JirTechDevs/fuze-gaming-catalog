-- catalog-images storage bucket.
-- Hosts product photos (rooted at bucket) and banner images
-- (under the storefront-banners/ prefix). Public read, authenticated
-- write — enforced by the RLS policies in 20260701_enable_rls.sql.

insert into storage.buckets (id, name, public)
values ('catalog-images', 'catalog-images', true)
on conflict (id) do nothing;
