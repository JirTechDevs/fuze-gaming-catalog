-- Enable Supabase Realtime broadcast for catalog_items so browser
-- clients can receive UPDATE / DELETE events over WebSocket.
--
-- Combined with the existing RLS "catalog_items_public_read" policy,
-- anonymous browser clients can subscribe to changes without needing
-- any additional auth. Writes still require an authenticated user
-- (or the service_role webhook), so RLS remains the source of truth.

alter publication supabase_realtime add table public.catalog_items;
