-- Keep the actual time an account is marked sold so daily sales can be
-- compared with storefront visitors. Existing sold records are intentionally
-- left null because their sale date was never recorded.

alter table public.catalog_items
  add column if not exists sold_at timestamptz;

create index if not exists catalog_items_sold_at_idx
  on public.catalog_items (sold_at desc)
  where status = 'sold' and sold_at is not null;
