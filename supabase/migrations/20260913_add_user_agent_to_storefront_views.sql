-- Only the client beacon (/api/public/track) writes user_agent. Analytics counts
-- rows WHERE user_agent IS NOT NULL, so all bot-inflated rows from the old
-- server-side tracker are excluded and counting restarts at the beacon deploy.
-- Run BEFORE deploying the beacon, otherwise its inserts fail on the missing column.

alter table public.storefront_views
  add column if not exists user_agent text;
